import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function GeneratingDisclaimer({ visible, onClose }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!visible) setDismissed(false);
  }, [visible]);

  const handleClose = () => {
    setDismissed(true);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
          <div className="flex items-start gap-3 bg-foreground text-background rounded-2xl px-4 py-3 shadow-lg pointer-events-auto">
            <span className="text-lg mt-0.5">⏳</span>
            <p className="text-sm leading-snug flex-1">
              La generazione può richiedere fino a <strong>60–90 secondi</strong>. Rimani sulla pagina, il risultato apparirà automaticamente.
            </p>
            <button className="mt-0.5 opacity-60 hover:opacity-100" onClick={handleClose}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}