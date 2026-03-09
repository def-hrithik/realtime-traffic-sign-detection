import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">Visiondrive</span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm">
              AI-powered traffic sign detection system for real-time driver safety alerts.
              Making roads safer, one sign at a time.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Problem', 'How It Works', 'Roadmap'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link === 'Home' ? 'hero' : link === 'How It Works' ? 'solution' : link.toLowerCase()}`}
                    className="text-sm text-gray-500 hover:text-blue-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {['Python', 'TensorFlow', 'YOLO', 'OpenCV', 'React', 'Tailwind CSS'].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs rounded-full bg-slate-800 text-gray-400 border border-slate-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600"
        >
          <span>&copy; {new Date().getFullYear()} Visiondrive. Built for safer roads.</span>
          <span>Machine Learning Capstone Project</span>
        </motion.div>
      </div>
    </footer>
  );
}
