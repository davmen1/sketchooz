import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@/components/ui/switch';

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

const STORAGE_KEY = 'sketchooz_tips_read';

export default function InstructionsPopup({ onRead }) {
  const alreadyRead = !!localStorage.getItem(STORAGE_KEY);
  const [expanded, setExpanded] = useState(!alreadyRead);
  const [read, setRead] = useState(alreadyRead);

  const handleConfirm = (v) => {
    if (!v) return;
    localStorage.setItem(STORAGE_KEY, '1');
    setRead(true);
    setExpanded(false);
    onRead?.();
  };

  return (
    <div className={`rounded-xl border text-xs transition-colors ${read ? 'border-accent/30 bg-accent/5' : 'border-amber-300 bg-amber-50/60'}`}>
      {/* Header row: label + switch */}
      <div className="flex items-center justify-between px-3 py-2 gap-3">
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1.5 flex-1 text-left"
        >
          <span>{read ? '✅' : '📋'}</span>
          <span className={`font-medium ${read ? 'text-accent' : 'text-amber-700'}`}>
            {read ? 'Tips for best results' : 'Read tips for best results'}
          </span>
          {expanded
            ? <ChevronUp className="w-3 h-3 text-muted-foreground ml-1" />
            : <ChevronDown className="w-3 h-3 text-muted-foreground ml-1" />
          }
        </button>

        {!read && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-muted-foreground text-xs">Done</span>
            <Switch onCheckedChange={handleConfirm} />
          </div>
        )}
      </div>

      {/* Collapsible tips list */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="px-3 pb-3 space-y-2 border-t border-border pt-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="leading-none mt-0.5">{tip.emoji}</span>
                  <span className="text-foreground/70 leading-snug">{tip.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}