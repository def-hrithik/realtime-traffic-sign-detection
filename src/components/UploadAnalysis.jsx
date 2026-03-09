import { motion } from 'framer-motion';
import LiveDetection from './LiveDetection';

/* ─── Main Component ─── */
export default function UploadAnalysis() {
  return (
    <motion.section
      id="upload"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative py-24 md:py-32"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Live Analysis
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
            Real-Time{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Detection
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Use your webcam to detect traffic signs in real time with AI-powered
            bounding box overlays.
          </p>
        </motion.div>

        {/* Live Detection */}
        <div className="max-w-4xl mx-auto">
          <LiveDetection />
        </div>
      </div>
    </motion.section>
  );
}
