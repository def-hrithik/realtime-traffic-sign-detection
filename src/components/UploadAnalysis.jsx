import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Config ─── */
const API_BASE = 'http://localhost:8000';

const ACCEPTED_IMAGE = ['image/jpeg', 'image/png'];
const ACCEPTED_VIDEO = ['video/mp4'];
const ACCEPTED_ALL = [...ACCEPTED_IMAGE, ...ACCEPTED_VIDEO];

/* ─── Scanning overlay ─── */
function ScanOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl"
    >
      {/* Dark tint */}
      <div className="absolute inset-0 bg-slate-900/40" />

      {/* Horizontal laser line */}
      <motion.div
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 right-0 h-0.5 z-30"
        style={{ position: 'absolute' }}
      >
        <div className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        <div className="h-6 -mt-3 bg-gradient-to-b from-blue-500/20 to-transparent" />
      </motion.div>

      {/* Corner brackets */}
      {[
        'top-2 left-2 border-t-2 border-l-2',
        'top-2 right-2 border-t-2 border-r-2',
        'bottom-2 left-2 border-b-2 border-l-2',
        'bottom-2 right-2 border-b-2 border-r-2',
      ].map((pos) => (
        <motion.div
          key={pos}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`absolute w-6 h-6 border-blue-500 ${pos}`}
        />
      ))}

      {/* Status label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-blue-500/30 rounded-lg px-4 py-2 z-30">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-blue-500"
        />
        <span className="text-sm text-blue-400 font-mono font-medium tracking-wide">
          SCANNING...
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Detection result card ─── */
function ResultCard({ result, index }) {
  const [expanded, setExpanded] = useState(false);
  const isRed = result.color === 'red';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.12, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={() => setExpanded(!expanded)}
      className="group bg-slate-800 border border-slate-700 hover:border-blue-500/40 rounded-xl p-4 transition-colors duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isRed ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
          }`}
        >
          {result.type === 'speed' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l3 3" />
            </svg>
          ) : result.type === 'regulatory' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
        </div>

        {/* Label + bar */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{result.label}</p>
          <div className="mt-1.5 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 0.8, delay: index * 0.12 + 0.2, ease: 'easeOut' }}
                className={`h-full rounded-full ${isRed ? 'bg-red-500' : 'bg-blue-500'}`}
              />
            </div>
            <span
              className={`text-xs font-mono font-bold tabular-nums ${
                isRed ? 'text-red-400' : 'text-blue-400'
              }`}
            >
              {result.confidence}%
            </span>
          </div>
        </div>

        {/* Expand chevron */}
        {result.explanation && (
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-500 shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Explanation (collapsed by default) */}
      <AnimatePresence>
        {expanded && result.explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="mt-3 pt-3 border-t border-slate-700 text-xs text-gray-400 leading-relaxed">
              {result.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function UploadAnalysis() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' | 'video'
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [processingTime, setProcessingTime] = useState(null);
  const [framesAnalyzed, setFramesAnalyzed] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  /* Cleanup object URLs on unmount or file change */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [preview]);

  const processFile = useCallback(
    async (uploaded) => {
      if (!uploaded) return;
      if (!ACCEPTED_ALL.includes(uploaded.type)) return;

      // Revoke previous
      if (preview) URL.revokeObjectURL(preview);
      if (abortRef.current) abortRef.current.abort();

      const url = URL.createObjectURL(uploaded);
      const isVideo = ACCEPTED_VIDEO.includes(uploaded.type);

      setFile(uploaded);
      setPreview(url);
      setMediaType(isVideo ? 'video' : 'image');
      setResults(null);
      setError(null);
      setProcessingTime(null);
      setFramesAnalyzed(null);
      setScanning(true);

      // Call actual backend
      const endpoint = isVideo ? '/analyze/video' : '/analyze/image';
      const formData = new FormData();
      formData.append('file', uploaded);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.detail || `Server error (${response.status})`);
        }

        const data = await response.json();
        console.log('API response:', data);
        const detections = Array.isArray(data.detections) ? data.detections : [];
        setResults(detections);
        setProcessingTime(data.processing_time || null);
        setFramesAnalyzed(data.frames_analyzed ?? null);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Upload analysis error:', err);
        setError(
          err.message === 'Failed to fetch'
            ? 'Cannot connect to the backend server. Make sure the ML backend is running on port 8000.'
            : err.message
        );
      } finally {
        setScanning(false);
        abortRef.current = null;
      }
    },
    [preview],
  );

  /* ── Handlers ── */
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      const dropped = e.dataTransfer?.files?.[0];
      processFile(dropped);
    },
    [processFile],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const onFileSelect = useCallback(
    (e) => {
      processFile(e.target.files?.[0]);
    },
    [processFile],
  );

  const resetUpload = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    if (abortRef.current) abortRef.current.abort();
    setFile(null);
    setPreview(null);
    setMediaType(null);
    setScanning(false);
    setResults(null);
    setError(null);
    setProcessingTime(null);
    setFramesAnalyzed(null);
    if (inputRef.current) inputRef.current.value = '';
  }, [preview]);

  const hasMedia = !!preview;

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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Analysis
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
            Test the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Detection Model
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Upload an image or video of a road scene and watch our AI identify traffic
            signs in real time.
          </p>
        </motion.div>

        {/* ── Main content grid ── */}
        <div className={`grid gap-8 ${hasMedia ? 'lg:grid-cols-5' : ''}`}>
          {/* Left: Upload / Preview — spans 3 cols on desktop when media loaded */}
          <div className={hasMedia ? 'lg:col-span-3' : 'max-w-2xl mx-auto w-full'}>
            <AnimatePresence mode="wait">
              {!hasMedia ? (
                /* ── Drop zone ── */
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onClick={() => inputRef.current?.click()}
                  className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-12 md:p-16 text-center transition-all duration-300 ${
                    dragActive
                      ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_40px_rgba(59,130,246,0.15)]'
                      : 'border-slate-700 hover:border-blue-500/50 bg-slate-800/40 hover:bg-slate-800/70'
                  }`}
                >
                  {/* Hidden file input */}
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.mp4"
                    onChange={onFileSelect}
                    className="hidden"
                  />

                  {/* Upload icon */}
                  <motion.div
                    animate={dragActive ? { y: -6, scale: 1.08 } : { y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${
                      dragActive
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-700/50 text-gray-500 group-hover:text-blue-400 group-hover:bg-blue-500/10'
                    }`}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </motion.div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {dragActive ? 'Drop your file here' : 'Drag & drop or click to upload'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports JPG, PNG images and MP4 video files
                  </p>
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {['JPG', 'PNG', 'MP4'].map((fmt) => (
                      <span
                        key={fmt}
                        className="px-3 py-1 text-xs rounded-full bg-slate-700/60 text-gray-400 border border-slate-600/40"
                      >
                        .{fmt.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* ── Preview ── */
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4 }}
                  className="relative"
                >
                  {/* Media container */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-800">
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500 shrink-0" />
                        <div className="w-3 h-3 rounded-full bg-green-500 shrink-0" />
                        <span className="ml-2 text-xs text-gray-500 font-mono truncate">
                          {file?.name}
                        </span>
                      </div>
                      <button
                        onClick={resetUpload}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove file"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {/* Media */}
                    <div className="relative bg-slate-900">
                      {mediaType === 'image' ? (
                        <img
                          src={preview}
                          alt="Uploaded preview"
                          className="w-full h-auto max-h-[500px] object-contain"
                        />
                      ) : (
                        <video
                          src={preview}
                          controls
                          className="w-full h-auto max-h-[500px] object-contain"
                        />
                      )}

                      {/* Scanning overlay */}
                      <AnimatePresence>{scanning && <ScanOverlay />}</AnimatePresence>
                    </div>

                    {/* Bottom status bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-t border-slate-700 text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            scanning
                              ? 'bg-blue-500 animate-pulse'
                              : error
                                ? 'bg-red-500'
                                : results
                                  ? 'bg-green-500'
                                  : 'bg-gray-500'
                          }`}
                        />
                        <span className="text-gray-400 font-mono">
                          {scanning
                            ? 'Processing...'
                            : error
                              ? 'Error'
                              : results
                                ? `${results.length} sign${results.length !== 1 ? 's' : ''} detected`
                                : 'Ready'}
                        </span>
                      </div>
                      <span className="text-gray-500 font-mono">
                        {mediaType === 'image' ? 'IMAGE' : 'VIDEO'} ·{' '}
                        {file ? `${(file.size / 1024).toFixed(1)} KB` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Upload another */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={resetUpload}
                    className="mt-4 w-full py-2.5 rounded-xl border border-slate-700 text-sm text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300"
                  >
                    Upload another file
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Results panel — 2 cols */}
          {hasMedia && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5 lg:p-6 h-full">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-white">Detection Results</h3>
                  {results && !error && (
                    <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium">
                      Complete
                    </span>
                  )}
                  {error && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                      Error
                    </span>
                  )}
                  {scanning && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium">
                      Analyzing
                    </span>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {scanning && (
                    <motion.div
                      key="scanning-placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-700/30 animate-pulse">
                          <div className="w-10 h-10 rounded-lg bg-slate-700" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-2/3 bg-slate-700 rounded" />
                            <div className="h-1.5 w-full bg-slate-700 rounded" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {!scanning && results && results.length > 0 && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      {results.map((r, i) => (
                        <ResultCard key={`${r.label}-${i}`} result={r} index={i} />
                      ))}

                      {/* Summary */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: results.length * 0.12 + 0.3 }}
                        className="mt-4 pt-4 border-t border-slate-700"
                      >
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Avg. Confidence</span>
                          <span className="font-mono font-bold text-blue-400">
                            {(results.reduce((a, r) => a + r.confidence, 0) / results.length).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-1.5">
                          <span>Processing Time</span>
                          <span className="font-mono font-bold text-gray-400">
                            {processingTime || '—'}
                          </span>
                        </div>
                        {framesAnalyzed != null && (
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-1.5">
                            <span>Frames Analyzed</span>
                            <span className="font-mono font-bold text-gray-400">
                              {framesAnalyzed}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}

                  {!scanning && results && results.length === 0 && !error && (
                    <motion.div
                      key="no-detections"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-700/40 text-gray-600 flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">No traffic signs detected</p>
                      <p className="text-xs text-gray-600">
                        Try uploading an image with visible road signs.
                      </p>
                      {processingTime && (
                        <p className="text-xs text-gray-600 mt-2 font-mono">
                          Processed in {processingTime}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {!scanning && error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-10 text-center"
                    >
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-red-400 mb-1">Analysis Failed</p>
                      <p className="text-xs text-gray-500 max-w-xs">{error}</p>
                      <button
                        onClick={() => { setError(null); processFile(file); }}
                        className="mt-4 px-4 py-2 text-xs rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white transition-colors"
                      >
                        Retry
                      </button>
                    </motion.div>
                  )}

                  {!scanning && !results && !error && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-700/40 text-gray-600 flex items-center justify-center mb-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">
                        Results will appear here after scanning.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
