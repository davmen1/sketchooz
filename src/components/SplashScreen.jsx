import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onDone }) {
  const isDark = document.documentElement.classList.contains('dark');
  const [visible, setVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Mostra il contenuto dopo un breve delay (il fondo è già visibile dal CSS)
    const t1 = setTimeout(() => setShowContent(true), 400);
    // Poi dissolve tutto
    const t2 = setTimeout(() => setVisible(false), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            backgroundColor: isDark ? '#0d0d0d' : '#f7f6f2',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
              >
                <img
                  src="https://media.base44.com/images/public/69c0940be94e736c4d6366a0/5e4300c0f_Gemini_Generated_Image_p24ieqp24ieqp24i1.jpg"
                  alt="Sketchooz"
                  style={{ width: '140px', height: '140px', objectFit: 'contain' }}
                />
                <span style={{
                  fontFamily: "'Arial', 'Helvetica Neue', Helvetica, sans-serif",
                  letterSpacing: '0.22em',
                  fontSize: '1.3rem',
                  color: isDark ? '#f7f6f2' : '#1a1a1a',
                  fontWeight: 300,
                  textTransform: 'uppercase'
                }}>
                  Sketchooz
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}