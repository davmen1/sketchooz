import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tips = [
  { emoji: '📸', text: 'Use a clean photo with the product on a simple or white background' },
  { emoji: '💡', text: 'Good lighting = better sketch — avoid heavy shadows or overexposure' },
  { emoji: '📐', text: 'Shoot at a slight 3/4 angle to show depth and form' },
  { emoji: '🔍', text: 'Include the whole product — avoid cropping key parts' },
  { emoji: '🚫', text: 'Avoid cluttered backgrounds or multiple objects in frame' },
  { emoji: '🎨', text: 'Choose Pantone colors that match your design intent, not just random ones' },
  { emoji: '⚙️', text: 'Higher detail level works best for products with many components' },
  { emoji: '🖼️', text: 'For study sheets, a front-facing or 3/4 view gives the best orthographic results' },
];

export default function InstructionsPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
        Tips for best results
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Popup */}
            <motion.div
              key="popup"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed z-50 inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[420px] bg-card border border-border rounded-2xl shadow-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold">Tips for best results</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Follow these to get the most accurate sketch</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ul className="space-y-3">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-base leading-none mt-0.5">{tip.emoji}</span>
                    <span className="text-sm text-foreground/80 leading-snug">{tip.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}