import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DetectionOverlay from './DetectionOverlay';

const WS_URL = 'ws://localhost:8000/ws/live_detection';
const FRAME_INTERVAL_MS = 200; // ~5 FPS to keep bandwidth manageable

export default function LiveDetection() {
  const [cameraActive, setCameraActive] = useState(false);
  const [detections, setDetections] = useState([]);
  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 });
  const [error, setError] = useState(null);
  const [wsStatus, setWsStatus] = useState('disconnected'); // disconnected | connecting | connected
  const [signCount, setSignCount] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  /* ── Stop everything ── */
  const stopCamera = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
    setDetections([]);
    setWsStatus('disconnected');
    setSignCount(0);
  }, []);

  /* ── Start camera + WS ── */
  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);

      // Connect WebSocket
      setWsStatus('connecting');
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => setWsStatus('connected');
      ws.onclose = () => setWsStatus('disconnected');
      ws.onerror = () => {
        setError('Connection failed. Ensure the ML backend is running on port 8000.');
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setWsStatus('disconnected');
      };
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            console.warn('Live detection error:', data.error);
            return;
          }
          const dets = Array.isArray(data.detections) ? data.detections : [];
          setDetections(dets);
          setSignCount(dets.length);
          if (data.frame_width && data.frame_height) {
            setFrameSize({ w: data.frame_width, h: data.frame_height });
          }
        } catch {
          /* ignore non-JSON */
        }
      };

      // Frame capture loop
      timerRef.current = setInterval(() => {
        if (
          !wsRef.current ||
          wsRef.current.readyState !== WebSocket.OPEN ||
          !videoRef.current ||
          videoRef.current.readyState < 2
        )
          return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!canvas || video.videoWidth === 0) return;

        // Only resize canvas if dimensions changed to improve performance
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        wsRef.current.send(dataUrl);
      }, FRAME_INTERVAL_MS);
    } catch (err) {
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera permissions and try again.'
          : `Camera error: ${err.message}`,
      );
    }
  }, []);

  /* Cleanup on unmount */
  useEffect(() => stopCamera, [stopCamera]);

  return (
    <div className="space-y-6">
      {/* Camera viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-gray-500 font-mono">live_feed</span>
          </div>
          <div className="flex items-center gap-2">
            {wsStatus === 'connected' && (
              <span className="flex items-center gap-1 text-xs text-green-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                LIVE
              </span>
            )}
          </div>
        </div>

        {/* Video area */}
        <div className="relative bg-slate-900" style={{ minHeight: 320 }}>
          <video
            ref={videoRef}
            muted
            playsInline
            className={`w-full h-auto max-h-[500px] object-contain ${!cameraActive ? 'hidden' : ''}`}
          />
          <canvas ref={canvasRef} className="hidden" />

          {cameraActive && (
            <DetectionOverlay
              detections={detections}
              frameWidth={frameSize.w}
              frameHeight={frameSize.h}
              videoRef={videoRef}
            />
          )}

          {!cameraActive && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-700/50 text-gray-500 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Live Camera Detection</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                Start your webcam to detect traffic signs in real time with bounding box overlays.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={startCamera}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
              >
                Start Camera
              </motion.button>
            </div>
          )}
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-t border-slate-700 text-xs">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                cameraActive
                  ? wsStatus === 'connected'
                    ? 'bg-green-500 animate-pulse'
                    : 'bg-yellow-500 animate-pulse'
                  : 'bg-gray-500'
              }`}
            />
            <span className="text-gray-400 font-mono">
              {cameraActive
                ? wsStatus === 'connected'
                  ? `${signCount} sign${signCount !== 1 ? 's' : ''} detected`
                  : 'Connecting...'
                : 'Camera off'}
            </span>
          </div>
          <span className="text-gray-500 font-mono">LIVE · WEBCAM</span>
        </div>
      </div>

      {/* Stop button */}
      {cameraActive && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={stopCamera}
          className="w-full py-2.5 rounded-xl border border-slate-700 text-sm text-gray-400 hover:text-red-400 hover:border-red-500/50 hover:bg-slate-800 transition-all duration-300"
        >
          Stop Camera
        </motion.button>
      )}

      {/* Error display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p className="text-xs text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live results sidebar cards */}
      {cameraActive && detections.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <h4 className="text-sm font-bold text-white">Detected Signs</h4>
          {detections.map((det, i) => {
            const isRed = det.color === 'red';
            return (
              <div
                key={`${det.label}-${i}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isRed ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                  }`}
                >
                  {det.type === 'speed' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l3 3" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" /></svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{det.label}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isRed ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${det.confidence}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-mono font-bold ${isRed ? 'text-red-400' : 'text-blue-400'}`}>
                      {det.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
