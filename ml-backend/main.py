"""
Traffic Sign Detection — FastAPI Server (YOLO best.pt)

Endpoints:
    WS   /ws/live_detection  – Real-time webcam detection via WebSocket
    GET  /health             – Health check / model status
"""

from __future__ import annotations

import asyncio
import base64
import io
import logging
import time
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from ultralytics import YOLO

from sign_data import get_sign_info

# ─── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("traffic-api")

# ─── Globals ──────────────────────────────────────────────────────────────────
model: YOLO | None = None

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


def _detect_frame_bytes(frame_bytes: bytes) -> dict:
    """Detect signs in a single frame from base64-decoded bytes."""
    t0 = time.perf_counter()
    pil_image = Image.open(io.BytesIO(frame_bytes))
    img_w, img_h = pil_image.size
    results = model(pil_image, verbose=False)
    detections = _parse_detections(results)
    elapsed = round(time.perf_counter() - t0, 3)
    return {
        "detections": detections,
        "processing_time": f"{elapsed}s",
        "frame_width": img_w,
        "frame_height": img_h,
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


@app.websocket("/ws/live_detection")
async def live_detection_ws(websocket: WebSocket):
    """WebSocket endpoint for real-time webcam detection."""
    await websocket.accept()
    logger.info("WebSocket client connected for live detection")
    try:
        while True:
            data = await websocket.receive_text()
            if model is None:
                await websocket.send_json({"error": "Model not loaded yet."})
                continue
            try:
                # Expect a base64 data-URL: "data:image/jpeg;base64,..."
                if "," in data:
                    data = data.split(",", 1)[1]
                frame_bytes = base64.b64decode(data)
                result = await asyncio.to_thread(_detect_frame_bytes, frame_bytes)
                await websocket.send_json(result)
            except Exception as exc:
                logger.exception("Live detection frame error")
                await websocket.send_json({"error": str(exc), "detections": []})
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as exc:
        logger.exception("WebSocket unexpected error")
        try:
            await websocket.close()
        except Exception:
            pass
