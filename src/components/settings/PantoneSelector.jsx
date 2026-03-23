import React from 'react';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

const PANTONE_COLORS = [
  { name: 'Cool Gray 11C', hex: '#53565A' },
  { name: 'Black C', hex: '#2D2926' },
  { name: 'Warm Gray 1C', hex: '#D6D2C4' },
  { name: '185 C', hex: '#E4002B' },
  { name: '021 C', hex: '#FE5000' },
  { name: '116 C', hex: '#FFCD00' },
  { name: '3005 C', hex: '#0077C8' },
  { name: '348 C', hex: '#00843D' },
  { name: '2685 C', hex: '#56368A' },
  { name: '7527 C', hex: '#D5C6B1' },
  { name: '7543 C', hex: '#98A4AE' },
  { name: '427 C', hex: '#D0D3D4' },
  { name: '1505 C', hex: '#FF8200' },
  { name: '2925 C', hex: '#009CDE' },
  { name: '375 C', hex: '#97D700' },
  { name: '225 C', hex: '#E0457B' },
];

export default function PantoneSelector({ selected, onChange }) {
  const toggle = (colorName) => {
    if (selected.includes(colorName)) {
      onChange(selected.filter((c) => c !== colorName));
    } else if (selected.length < 5) {
      onChange([...selected, colorName]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pantone Colors
        </Label>
        <span className="text-xs text-muted-foreground">{selected.length}/5</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {PANTONE_COLORS.map((color) => {
          const isSelected = selected.includes(color.name);
          return (
            <button
              key={color.name}
              onClick={() => toggle(color.name)}
              className="group relative flex flex-col items-center gap-1"
              title={`PANTONE ${color.name}`}
            >
              <div
                className={`w-full aspect-square rounded-lg border-2 transition-all flex items-center justify-center ${
                  isSelected ? 'border-foreground scale-105 shadow-md' : 'border-transparent hover:border-muted-foreground/30'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <Check className="w-4 h-4 text-white drop-shadow-md" />
                )}
              </div>
              <span className="text-[9px] text-muted-foreground leading-none truncate w-full text-center">
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}