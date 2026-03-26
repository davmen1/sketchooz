import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Marker pen path (body + tip)
const MARKER_BODY = "M20 8 L20 52 Q20 58 26 58 L38 58 Q44 58 44 52 L44 8 Q44 4 40 4 L24 4 Q20 4 20 8 Z";
const MARKER_TIP = "M26 58 L32 74 L38 58 Z";
const MARKER_CAP = "M20 8 Q20 4 24 4 L40 4 Q44 4 44 8 L44 18 L20 18 Z";
const MARKER_STRIPE = "M20 22 L44 22";

// "S" letter path - a simple stylized S drawn as a single stroke
const LETTER_S = "M52 28 Q52 18 64 18 Q76 18 76 28 Q76 36 64 36 Q52 36 52 46 Q52 56 64 56 Q76 56 76 46";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in'); // 'in' | 'out'

  useEffect(() => {
    // After 2.8s start exit
    const t = setTimeout(() => setPhase('out'), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {phase === 'in' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: '#E8692A' }}
        >
          {/* Animated SVG */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <svg width="120" height="120" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Marker body */}
              <motion.path
                d={MARKER_BODY}
                fill="white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              />
              {/* Marker cap */}
              <motion.path
                d={MARKER_CAP}
                fill="#1a1a1a"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              />
              {/* Marker tip */}
              <motion.path
                d={MARKER_TIP}
                fill="#1a1a1a"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              />
              {/* Marker stripe */}
              <motion.line
                x1="20" y1="22" x2="44" y2="22"
                stroke="#E8692A"
                strokeWidth="2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.2 }}
              />
              {/* Animated S letter being drawn */}
              <motion.path
                d={LETTER_S}
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.1, ease: 'easeInOut' }}
              />
            </svg>

            {/* App name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold text-white tracking-tight">Sketchooz</h1>
              <p className="text-white/70 text-sm mt-1 tracking-widest uppercase">Design Sketching AI</p>
            </motion.div>
          </motion.div>

          {/* Bottom pulse dot */}
          <motion.div
            className="absolute bottom-12 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/50"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}