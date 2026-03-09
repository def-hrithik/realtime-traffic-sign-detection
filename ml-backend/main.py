"""
Traffic Sign Detection — FastAPI Server (YOLO best.pt)

Endpoints:
    POST /analyze/image   – Upload an image file for sign detection
    POST /analyze/video   – Upload a video file for sign detection
    GET  /health          – Health check / model status
"""

from __future__ import annotations

import asyncio
import io
import logging
import os
import tempfile
import time
import uuid
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from ultralytics import YOLO

from sign_data import get_sign_info

# ─── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("traffic-api")

# ─── Globals ──────────────────────────────────────────────────────────────────
model: YOLO | None = None

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png"}
ALLOWED_VIDEO_TYPES = {"video/mp4"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

# Path to the YOLO weights file (look in ml-backend/ first, then project root)
MODEL_PATH = (
    Path(__file__).parent / "best.pt"
    if (Path(__file__).parent / "best.pt").exists()
    else Path(__file__).parent.parent / "best.pt"
)


# ─── Lifespan (model loading) ────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    logger.info("Loading YOLO model from %s ...", MODEL_PATH)
    if not MODEL_PATH.exists():
        logger.error("Model file not found at %s", MODEL_PATH)
        raise FileNotFoundError(f"best.pt not found at {MODEL_PATH}")
    model = YOLO(str(MODEL_PATH))
    logger.info("YOLO model loaded. Classes: %s", list(model.names.values()))
    yield
    logger.info("Shutting down.")


# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Traffic Sign Detection API",
    version="2.0.0",
    description="YOLO (best.pt) based traffic sign detection from images and video.",
    lifespan=lifespan,
)

# CORS — allow the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Helpers ──────────────────────────────────────────────────────────────────
async def _read_upload(upload: UploadFile, allowed_types: set[str]) -> bytes:
    """Validate and read an uploaded file."""
    if upload.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {upload.content_type}. "
            f"Allowed: {', '.join(sorted(allowed_types))}",
        )
    data = await upload.read()
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum allowed size is {MAX_FILE_SIZE // (1024*1024)} MB.",
        )
    return data


def _parse_detections(results) -> list[dict]:
    """Extract detection dicts from YOLO results."""
    detections: list[dict] = []
    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            conf = round(float(box.conf[0]) * 100, 1)
            class_name = model.names[cls_id]
            sign_info = get_sign_info(class_name)
            coords = box.xyxy[0].tolist()
            detections.append({
                "label": sign_info["label"],
                "confidence": conf,
                "type": sign_info["type"],
                "color": sign_info["color"],
                "explanation": sign_info["explanation"],
                "bbox": [round(c, 1) for c in coords],
            })
    detections.sort(key=lambda d: d["confidence"], reverse=True)
    return detections


def _detect_image(file_bytes: bytes) -> dict:
    """Synchronous image detection — called via asyncio.to_thread."""
    t0 = time.perf_counter()
    pil_image = Image.open(io.BytesIO(file_bytes))
    results = model(pil_image, verbose=False)
    detections = _parse_detections(results)
    elapsed = round(time.perf_counter() - t0, 2)
    logger.info("Image: %d detection(s) in %ss", len(detections), elapsed)
    return {
        "detections": detections,
        "count": len(detections),
        "processing_time": f"{elapsed}s",
    }


def _detect_video(file_bytes: bytes, sample_every_n: int = 30, max_frames: int = 20) -> dict:
    """Synchronous video detection — called via asyncio.to_thread."""
    import cv2

    t0 = time.perf_counter()

    # Write to temp file for OpenCV
    tmp_dir = Path(tempfile.gettempdir()) / "traffic_sign_det"
    tmp_dir.mkdir(exist_ok=True)
    tmp_path = tmp_dir / f"{uuid.uuid4().hex}.mp4"
    tmp_path.write_bytes(file_bytes)

    try:
        cap = cv2.VideoCapture(str(tmp_path))
        if not cap.isOpened():
            raise ValueError("Could not open video file.")

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        logger.info(
            "Video: %d total frames, %.1f FPS, sampling every %d (max %d)",
            total_frames, fps, sample_every_n, max_frames,
        )

        seen: dict[str, dict] = {}
        frame_idx = 0
        frames_analyzed = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % sample_every_n == 0:
                # Convert BGR → RGB for YOLO
                rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                pil_frame = Image.fromarray(rgb)
                results = model(pil_frame, verbose=False)
                dets = _parse_detections(results)
                frames_analyzed += 1
                logger.info(
                    "  Frame %d/%d (idx %d): %d detection(s)",
                    frames_analyzed, max_frames, frame_idx, len(dets),
                )
                for det in dets:
                    key = det["label"]
                    if key not in seen or det["confidence"] > seen[key]["confidence"]:
                        seen[key] = det
                if frames_analyzed >= max_frames:
                    break
            frame_idx += 1

        cap.release()
    finally:
        try:
            tmp_path.unlink()
        except OSError:
            pass

    results_list = sorted(seen.values(), key=lambda d: d["confidence"], reverse=True)
    elapsed = round(time.perf_counter() - t0, 2)
    logger.info("Video: %d unique sign(s) across %d frames in %ss", len(results_list), frames_analyzed, elapsed)

    return {
        "detections": results_list,
        "count": len(results_list),
        "frames_analyzed": frames_analyzed,
        "processing_time": f"{elapsed}s",
    }


# ─── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Traffic Sign Detection API is running",
        "model": "best.pt",
    }


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model": "YOLO (best.pt)",
        "device": str(model.device) if model else "not loaded",
        "classes": list(model.names.values()) if model else [],
    }


@app.post("/analyze/image")
async def analyze_image(file: UploadFile = File(...)):
    """Upload a JPG/PNG image and receive detected traffic signs."""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet.")

    file_bytes = await _read_upload(file, ALLOWED_IMAGE_TYPES)

    try:
        result = await asyncio.to_thread(_detect_image, file_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        logger.exception("Unexpected error during image analysis")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}")

    return result


@app.post("/analyze/video")
async def analyze_video(file: UploadFile = File(...)):
    """Upload an MP4 video and receive aggregated traffic sign detections."""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet.")

    file_bytes = await _read_upload(file, ALLOWED_VIDEO_TYPES)

    try:
        result = await asyncio.to_thread(_detect_video, file_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        logger.exception("Unexpected error during video analysis")
        raise HTTPException(status_code=500, detail=f"Video analysis failed: {exc}")

    return result
