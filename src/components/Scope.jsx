import { motion } from 'framer-motion';

const roadmapItems = [
  {
    phase: 'Phase 1',
    title: 'Core Detection System',
    status: 'completed',
    period: 'Current',
    items: [
      'Speed limit sign detection (10–120 km/h)',
      'Stop sign recognition & alert',
      'Real-time audio/visual driver alerts',
      'Dashboard camera integration',
      'CNN + YOLO model training (97%+ accuracy)',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Expanded Sign Library',
    status: 'in-progress',
    period: 'Q2 2026',
    items: [
      'Yield, no-entry, and one-way signs',
      'Construction & school zone warnings',
      'Traffic light state detection (red/green/yellow)',
      'Multi-sign simultaneous detection',
      'Improved model latency (<50ms per frame)',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Advanced Capabilities',
    status: 'upcoming',
    period: 'Q4 2026',
    items: [
      'Night vision & low-light detection',
      'Weather adaptability (rain, fog, snow)',
      'GPS-based speed zone validation',
      'Driver behavior pattern analysis',
      'Cloud-based model updates (OTA)',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Vehicle Integration',
    status: 'upcoming',
    period: '2027',
    items: [
      'Automatic braking integration (ADAS)',
      'Vehicle CAN-bus communication',
      'Fleet management & telematics dashboard',
      'V2X (Vehicle-to-Everything) connectivity',
      'Regulatory compliance & certification',
    ],
  },
];

const statusConfig = {
  completed: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    dot: 'bg-green-500',
    text: 'text-green-400',
    label: 'Completed',
  },
  'in-progress': {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    dot: 'bg-blue-500',
    text: 'text-blue-400',
    label: 'In Progress',
  },
  upcoming: {
    bg: 'bg-slate-700/30',
    border: 'border-slate-600/40',
    dot: 'bg-slate-500',
    text: 'text-slate-400',
    label: 'Upcoming',
  },
};

export default function Scope() {
  return (
    <section id="scope" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900 pointer-events-none" />

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
            Roadmap
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
            Project Scope &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Future Vision
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From core speed-sign detection to a fully integrated autonomous safety
            system — here&apos;s our development roadmap.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-slate-700 to-slate-700/20 -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-16">
            {roadmapItems.map((item, i) => {
              const cfg = statusConfig[item.status];
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, y: 40, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-12 ${
                    isEven ? '' : 'lg:direction-rtl'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-8 z-10">
                    <div className={`w-4 h-4 rounded-full ${cfg.dot} ring-4 ring-slate-900 shadow-[0_0_12px_rgba(59,130,246,0.3)]`} />
                  </div>

                  {/* Card - position based on even/odd */}
                  <div className={isEven ? 'lg:pr-12' : 'lg:col-start-2 lg:pl-12'}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className={`bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-700 hover:border-blue-500/30 transition-all duration-300`}
                    >
                      {/* Phase header */}
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-500">{item.phase}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.border} ${cfg.text} border`}>
                            {cfg.label}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">{item.period}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>

                      <ul className="space-y-2.5">
                        {item.items.map((li) => (
                          <li key={li} className="flex items-start gap-3 text-sm">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                              item.status === 'completed' ? 'bg-green-500' :
                              item.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-600'
                            }`} />
                            <span className={item.status === 'upcoming' ? 'text-gray-500' : 'text-gray-400'}>
                              {li}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  {/* Empty column for layout */}
                  {isEven ? <div className="hidden lg:block" /> : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
