import { motion, AnimatePresence } from 'framer-motion';

export default function DetectionOverlay({ detections, frameWidth, frameHeight, videoRef }) {
  if (!detections?.length || !videoRef?.current || !frameWidth || !frameHeight) return null;

  const videoEl = videoRef.current;
  const displayW = videoEl.clientWidth;
  const displayH = videoEl.clientHeight;

  const scaleX = displayW / frameWidth;
  const scaleY = displayH / frameHeight;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <AnimatePresence>
        {detections.map((det, i) => {
          if (!det.bbox || det.bbox.length < 4) return null;
          const [x1, y1, x2, y2] = det.bbox;
          const left = x1 * scaleX;
          const top = y1 * scaleY;
          const width = (x2 - x1) * scaleX;
          const height = (y2 - y1) * scaleY;
          const isRed = det.color === 'red';
          const borderColor = isRed ? 'border-red-500' : 'border-blue-500';
          const bgColor = isRed ? 'bg-red-500' : 'bg-blue-500';

          return (
            <motion.div
              key={`${det.label}-${i}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className={`absolute border-2 ${borderColor} rounded-sm`}
              style={{ left, top, width, height }}
            >
              <div
                className={`absolute -top-5 left-0 ${bgColor} text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap`}
              >
                {det.label} {det.confidence}%
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
