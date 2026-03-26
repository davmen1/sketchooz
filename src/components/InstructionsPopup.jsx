import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tips = [
  { emoji: '📸', text: 'Use a clean photo with the product on a simple or white background' },
  { emoji: '💡', text: 'Good lighting = better sketch — avoid heavy shadows or overexposure' },
  { emoji: '📐', text: 'Shoot at a slight 3/4 angle to show depth and form' },
  { emoji: '🔍', text: 'Include the whole product — avoid cropping key parts' },
  { emoji: '🚫', text: 'Avoid cluttered backgrounds or multiple objects in frame' },
  { emoji: '🎨', text: 'Choose Pantone colors that match your design intent' },
  { emoji: '⚙️', text: 'Higher detail level works best for products with many components' },
  { emoji: '🖼️', text: 'For study sheets, a front-facing or 3/4 view gives the best results' },
];

export default function InstructionsPopup({ onRead }) {
  const [read, setRead] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleRead = () => {
    setRead(true);
    setExpanded(false);
    onRead?.();
  };

  return (
    <div className={`rounded-2xl border transition-colors ${read ? 'border-accent/40 bg-accent/5' : 'border-border bg-card'}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          {read
            ? <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
            : <span className="text-base leading-none">📋</span>
          }
          <span className={`text-sm font-medium ${read ? 'text-accent' : 'text-foreground'}`}>
            {read ? 'Tips read — you\'re good to go!' : 'Read before uploading — tips for best results'}
          </span>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        }
      </button>

      {/* Body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <ul className="space-y-2.5">
                {tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-sm leading-none mt-0.5">{tip.emoji}</span>
                    <span className="text-xs text-foreground/75 leading-snug">{tip.text}</span>
                  </li>
                ))}
              </ul>

              {!read && (
                <button
                  onClick={handleRead}
                  className="w-full h-10 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  I've read it, let's go!
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}