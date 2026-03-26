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
  const [expanded, setExpanded] = useState(false);
  const [read, setRead] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) { setTimeout(() => onRead?.(), 0); }
    return !!stored;
  });

  const handleConfirm = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setRead(true);
    setExpanded(false);
    onRead?.();
  };

  return (
    <div className={`rounded-xl border text-xs transition-colors ${read ? 'border-accent/30 bg-accent/5' : 'border-border bg-card'}`}>
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-3 py-2 gap-2 text-left"
      >
        <div className="flex items-center gap-1.5">
          <span>{read ? '✅' : '📋'}</span>
          <span className={`font-medium ${read ? 'text-accent' : 'text-muted-foreground'}`}>
            {read ? 'Tips already read' : 'Tips for best results'}
          </span>
        </div>
        {expanded
          ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        }
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="px-3 pb-3 space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="leading-none mt-0.5">{tip.emoji}</span>
                  <span className="text-foreground/70 leading-snug">{tip.text}</span>
                </li>
              ))}
            </ul>

            {!read && (
              <div className="px-3 pb-3 flex items-center justify-end gap-2 border-t border-border pt-3">
                <span className="text-muted-foreground">I've read it</span>
                <Switch onCheckedChange={(v) => v && handleConfirm()} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}