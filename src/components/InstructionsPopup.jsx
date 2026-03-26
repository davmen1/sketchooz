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

export default function InstructionsPopup({ onRead }) {
  const [expanded, setExpanded] = useState(false);
  const [read, setRead] = useState(false);

  const handleSwitch = (val) => {
    setRead(val);
    if (val) {
      setExpanded(false);
      onRead?.();
    }
  };

  return (
    <div className={`rounded-2xl border transition-colors ${read ? 'border-accent/40 bg-accent/5' : 'border-border bg-card'}`}>
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-2 flex-1 text-left min-w-0"
        >
          <span className="text-sm leading-none">📋</span>
          <span className="text-sm font-medium text-foreground truncate">
            Tips for best results
          </span>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          }
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">{read ? "Got it ✓" : "I've read it"}</span>
          <Switch checked={read} onCheckedChange={handleSwitch} />
        </div>
      </div>

      {/* Collapsible tips */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="px-4 pb-4 space-y-2.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-sm leading-none mt-0.5">{tip.emoji}</span>
                  <span className="text-xs text-foreground/75 leading-snug">{tip.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}