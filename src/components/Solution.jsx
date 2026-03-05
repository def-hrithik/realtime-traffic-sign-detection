import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Flow Steps ─── */
const steps = [
  {
    num: '01',
    title: 'Live Feed Capture',
    description:
      'A dashboard-mounted camera continuously captures the road ahead at 30 FPS, feeding live video into the system.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'AI Processing & Detection',
    description:
      'Our deep-learning model (CNN + YOLO) processes each frame in real-time, identifying and classifying traffic signs with 97%+ accuracy.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <path d="M7 8l3 3-3 3" />
        <line x1="13" y1="14" x2="17" y2="14" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Real-Time Driver Alert',
    description:
      'Detected signs trigger instant visual and audio alerts. Speed limit violations produce a continuous alarm until the driver complies.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        <line x1="12" y1="2" x2="12" y2="4" />
      </svg>
    ),
  },
];

/* ─── GSAP Scroll-Triggered Car Animation ─── */
function ScrollCarAnimation() {
  const containerRef = useRef(null);
  const carRef = useRef(null);
  const signRef = useRef(null);
  const alertRef = useRef(null);
  const roadRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });

      // Car moves across
      tl.fromTo(
        carRef.current,
        { x: '-100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 1 }
      );

      // Road dashes animate
      tl.fromTo(
        roadRef.current?.children || [],
        { scaleX: 0 },
        { scaleX: 1, stagger: 0.1, duration: 0.5 },
        0
      );

      // Car reaches sign
      tl.to(carRef.current, { x: '60%', duration: 1 }, 0.5);

      // Sign pulses
      tl.fromTo(
        signRef.current,
        { scale: 0.8, opacity: 0.5 },
        { scale: 1.1, opacity: 1, duration: 0.4, ease: 'elastic.out(1,0.3)' },
        1.0
      );

      // Alert flashes
      tl.fromTo(
        alertRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3 },
        1.2
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-48 md:h-56 my-8 overflow-hidden rounded-xl bg-slate-900 border border-slate-700">
      {/* Road */}
      <div className="absolute bottom-12 left-0 right-0 h-1 bg-slate-700" />
      <div ref={roadRef} className="absolute bottom-12 left-0 right-0 flex gap-6 px-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-8 h-1 bg-yellow-500/40 origin-left" />
        ))}
      </div>

      {/* Car */}
      <div ref={carRef} className="absolute bottom-14 left-8 opacity-0">
        <div className="relative">
          {/* Car body */}
          <div className="w-20 h-8 bg-blue-500 rounded-lg relative">
            <div className="absolute -top-4 left-3 w-14 h-5 bg-blue-400 rounded-t-lg" />
            {/* Windows */}
            <div className="absolute -top-3 left-5 w-4 h-3 bg-slate-900/60 rounded-sm" />
            <div className="absolute -top-3 left-10 w-4 h-3 bg-slate-900/60 rounded-sm" />
          </div>
          {/* Wheels */}
          <div className="absolute -bottom-2 left-2 w-4 h-4 bg-slate-800 rounded-full border-2 border-slate-600" />
          <div className="absolute -bottom-2 right-2 w-4 h-4 bg-slate-800 rounded-full border-2 border-slate-600" />
          {/* Headlight glow */}
          <div className="absolute top-1 -right-3 w-6 h-2 bg-yellow-300/30 rounded-full blur-sm" />
        </div>
      </div>

      {/* Speed sign */}
      <div ref={signRef} className="absolute bottom-16 right-24 opacity-50">
        <div className="w-12 h-12 rounded-full border-3 border-red-500 bg-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
          <span className="text-sm font-black text-slate-900">60</span>
        </div>
        <div className="w-1 h-8 bg-slate-600 mx-auto" />
      </div>

      {/* Alert popup */}
      <div ref={alertRef} className="absolute top-4 right-4 opacity-0">
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-red-400 font-mono font-bold">SPEED LIMIT 60</span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 text-xs text-gray-500 font-mono">SCROLL TO ANIMATE</div>
    </div>
  );
}

/* ─── Interactive Speed Alert Demo ─── */
function SpeedAlertDemo() {
  const [speed, setSpeed] = useState(85);
  const speedLimit = 60;
  const isOverLimit = speed > speedLimit;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={`relative rounded-2xl border p-6 md:p-8 overflow-hidden transition-colors duration-500 ${
        isOverLimit
          ? 'bg-red-500/5 border-red-500/30'
          : 'bg-green-500/5 border-green-500/30'
      }`}
    >
      {/* Flashing overlay when over limit */}
      {isOverLimit && (
        <motion.div
          animate={{ opacity: [0, 0.08, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="absolute inset-0 bg-red-500 pointer-events-none"
        />
      )}

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-2">
          Interactive Speed Alert Demo
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Drag the slider to simulate driving speed. The alert activates when you exceed the limit.
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Speed gauge */}
          <div className="flex flex-col items-center">
            <div
              className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 ${
                isOverLimit
                  ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]'
                  : 'border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]'
              }`}
            >
              <motion.span
                key={speed}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className={`text-4xl font-black ${isOverLimit ? 'text-red-400' : 'text-green-400'}`}
              >
                {speed}
              </motion.span>
              <span className="text-xs text-gray-500 mt-1">km/h</span>
            </div>

            {/* Slider */}
            <div className="w-full max-w-xs mt-6">
              <input
                type="range"
                min="0"
                max="160"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${
                    isOverLimit ? '#EF4444' : '#22C55E'
                  } ${(speed / 160) * 100}%, #334155 ${(speed / 160) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0</span>
                <span>160 km/h</span>
              </div>
            </div>
          </div>

          {/* Alert panel */}
          <div className="space-y-4">
            {/* Speed limit sign */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-3 border-red-500 bg-white flex items-center justify-center shrink-0">
                <span className="text-lg font-black text-slate-900">{speedLimit}</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Detected Speed Limit</p>
                <p className="text-white font-bold">{speedLimit} km/h zone</p>
              </div>
            </div>

            {/* Status */}
            <div
              className={`rounded-xl p-4 border transition-all duration-500 ${
                isOverLimit
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={isOverLimit ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isOverLimit ? Infinity : 0 }}
                  className={`w-3 h-3 rounded-full ${
                    isOverLimit ? 'bg-red-500' : 'bg-green-500'
                  }`}
                />
                <span
                  className={`font-bold text-sm ${
                    isOverLimit ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {isOverLimit ? '⚠ SPEED LIMIT EXCEEDED' : '✓ WITHIN SPEED LIMIT'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {isOverLimit
                  ? `You are ${speed - speedLimit} km/h over the limit. Reduce speed to dismiss the alert.`
                  : 'You are driving within the safe speed range. No alerts active.'}
              </p>
            </div>

            {/* Audio indicator */}
            {isOverLimit && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-400"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
                <span className="text-xs font-mono">ALARM ACTIVE — SLOW DOWN</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Solution Section ─── */
export default function Solution() {
  return (
    <section id="solution" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-900/80 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
            From Camera to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Alert in Milliseconds
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our three-stage pipeline processes every frame in real time, turning raw
            video into life-saving driver alerts.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="group relative bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-700 hover:border-blue-500/40 transition-colors duration-300"
            >
              {/* Step number */}
              <span className="text-5xl font-black text-slate-700 group-hover:text-blue-500/20 transition-colors duration-300 absolute top-4 right-6">
                {step.num}
              </span>

              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                {step.icon}
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>

              {/* Connector arrow (not on last) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* GSAP Scroll Car Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-bold text-white mb-2 text-center">
            Scroll-Triggered Detection Simulation
          </h3>
          <p className="text-gray-400 text-sm text-center mb-4">
            Scroll through this section to watch the car approach a speed sign and trigger an alert.
          </p>
          <ScrollCarAnimation />
        </motion.div>

        {/* Interactive Demo */}
        <div className="mt-16">
          <SpeedAlertDemo />
        </div>
      </div>
    </section>
  );
}
