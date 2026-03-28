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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full px-0"
        >
          <div className="flex items-start gap-3 bg-foreground text-background rounded-2xl px-4 py-3 shadow-lg">
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