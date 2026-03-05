import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

/* Animated particle/grid background for the hero */
function HeroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    function resize() {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function createParticles() {
      particles = [];
      const count = 60;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${p.opacity})`;
        ctx.fill();
      }
      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();
    window.addEventListener('resize', () => { resize(); createParticles(); });
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

/* Animated dashboard visual */
function DashboardVisual() {
  const dashRef = useRef(null);

  useEffect(() => {
    const el = dashRef.current;
    if (!el) return;
    // GSAP pulsing glow animation on the dashboard
    gsap.to(el, {
      boxShadow: '0 0 60px rgba(59,130,246,0.3), 0 0 120px rgba(59,130,246,0.1)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  return (
    <motion.div
      ref={dashRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
      className="relative w-full max-w-xl mx-auto"
    >
      {/* Mock car dashboard */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 md:p-8 shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-gray-500 font-mono">DASH-CAM FEED</span>
        </div>

        {/* Camera view placeholder */}
        <div className="relative bg-slate-900 rounded-xl h-44 md:h-56 flex items-center justify-center overflow-hidden mb-4">
          {/* Road lines animation */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 opacity-20">
            <motion.div
              animate={{ scaleY: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-16 bg-white rounded-full mb-2"
            />
            <motion.div
              animate={{ scaleY: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="w-1 h-12 bg-white rounded-full mb-2"
            />
            <motion.div
              animate={{ scaleY: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              className="w-1 h-8 bg-white rounded-full"
            />
          </div>

          {/* Scanning overlay */}
          <motion.div
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
            style={{ position: 'absolute' }}
          />

          {/* Detected sign */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
            className="relative z-10"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-red-500 bg-white flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
              <span className="text-2xl md:text-3xl font-black text-slate-900">60</span>
            </div>
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-blue-500"
            />
          </motion.div>

          {/* Detection label */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, duration: 0.4 }}
            className="absolute top-3 right-3 bg-blue-500/20 border border-blue-500/40 rounded-md px-2 py-1"
          >
            <span className="text-xs text-blue-400 font-mono">DETECTED</span>
          </motion.div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
            <span className="text-gray-400">AI Model Active</span>
          </div>
          <span className="text-gray-500 font-mono">FPS: 30 | Conf: 97.2%</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <HeroBackground />

      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm text-blue-400 font-medium">AI-Powered Driver Safety</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6"
            >
              Smarter Drives,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                Safer Roads
              </span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-400">
                Real-Time Traffic Sign Detection
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg"
            >
              Our AI system uses your car&apos;s live camera feed to instantly detect road signs
              and alert you in real time. From speed limits to stop signs, stay informed
              and stay safe on every journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#solution"
                className="px-7 py-3.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 active:scale-95"
              >
                View Demo
              </a>
              <a
                href="#scope"
                className="px-7 py-3.5 rounded-xl border border-slate-700 text-gray-300 font-semibold hover:border-blue-500/50 hover:text-white hover:bg-slate-800 transition-all duration-300 active:scale-95"
              >
                Read Documentation
              </a>
            </motion.div>
          </div>

          {/* Dashboard Visual */}
          <DashboardVisual />
        </div>
      </div>
    </section>
  );
}
