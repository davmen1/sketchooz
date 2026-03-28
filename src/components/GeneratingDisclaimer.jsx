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
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-sm cursor-pointer"
        >
          <div className="flex items-start gap-3 bg-foreground text-background rounded-2xl px-4 py-3 shadow-lg">
            <span className="text-lg mt-0.5">⏳</span>
            <p className="text-sm leading-snug flex-1">
              La generazione può richiedere fino a <strong>60–90 secondi</strong>. Rimani sulla pagina, il risultato apparirà automaticamente.
            </p>
            <button className="mt-0.5 opacity-60 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}