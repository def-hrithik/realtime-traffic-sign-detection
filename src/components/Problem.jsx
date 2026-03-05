import { motion } from 'framer-motion';

const problems = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-11A2.5 2.5 0 0 1 6.5 5H9l1-2h4l1 2h2.5A2.5 2.5 0 0 1 20 7.5v11a2.5 2.5 0 0 1-2.5 2.5Z" />
        <line x1="9" y1="10" x2="9" y2="16" />
        <line x1="15" y1="10" x2="15" y2="16" />
        <path d="M9 16c0 0 1.5-2 3-2s3 2 3 2" />
      </svg>
    ),
    title: 'Driver Fatigue',
    description:
      'Exhausted drivers lose focus and miss critical road signs, especially during long highway trips and late-night driving. Reaction times drop by up to 50%.',
    stat: '328,000',
    statLabel: 'fatigue-related crashes per year',
    color: 'blue',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
        <line x1="4" y1="4" x2="20" y2="20" />
      </svg>
    ),
    title: 'Missed Speed Limits',
    description:
      'Speed limit signs are easily overlooked in unfamiliar areas, construction zones, or rapidly changing speed corridors. Speeding accounts for nearly a third of all traffic deaths.',
    stat: '29%',
    statLabel: 'of fatal accidents involve speeding',
    color: 'red',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: 'Preventable Accidents',
    description:
      'Many road accidents are caused by simple failures to notice or react to traffic signs. A real-time detection system can bridge the gap between human error and safety.',
    stat: '94%',
    statLabel: 'of serious crashes involve human error',
    color: 'blue',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' },
  }),
};

export default function Problem() {
  return (
    <section id="problem" className="relative py-24 md:py-32">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/50 to-slate-900 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4">
            The Problem
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
            Why Do We Need{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
              This Technology?
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every year, thousands of accidents are caused by drivers who miss critical
            road signs. The problem is both widespread and preventable.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative bg-slate-800 rounded-2xl p-6 lg:p-8 border border-slate-700 hover:border-blue-500/40 transition-colors duration-300 overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                    item.color === 'red'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-blue-500/10 text-blue-400'
                  }`}
                >
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  {item.description}
                </p>

                {/* Stat */}
                <div className="pt-4 border-t border-slate-700">
                  <span
                    className={`text-2xl font-black ${
                      item.color === 'red' ? 'text-red-400' : 'text-blue-400'
                    }`}
                  >
                    {item.stat}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{item.statLabel}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
