import React from 'react';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { PANTONE_PALETTES } from './PantoneSelector';

// Given a hex color, compute relative luminance
function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

// Derive 2 contrasting background suggestions from a hex color
function contrastColors(hex) {
  const L = luminance(hex);
  if (L > 0.5) {
    // Light color → dark contrast backgrounds
    return [
      { hex: '#111111', label: 'Black' },
      { hex: '#1A237E', label: 'Deep Blue' },
    ];
  } else {
    // Dark color → light contrast backgrounds
    return [
      { hex: '#F5F2EE', label: 'Off-White' },
      { hex: '#D0D3D4', label: 'Lt. Gray' },
    ];
  }
}

export default function BackgroundSelector({ selected, onChange, pantoneColors }) {
  const allColors = PANTONE_PALETTES.flatMap(p => p.colors);

  // Up to 2 colors from the sketch palette
  const paletteSwatches = (pantoneColors || [])
    .slice(0, 2)
    .map(name => allColors.find(c => c.name === name))
    .filter(Boolean);

  // 2 contrast suggestions based on first sketch color (or default)
  const baseHex = paletteSwatches[0]?.hex || '#888888';
  const contrastSuggestions = contrastColors(baseHex);

  const selectPantone = (hex, name) => onChange({ type: 'pantone', hex, label: `PANTONE ${name}` });
  const selectCustom = (hex) => onChange({ type: 'custom', hex, label: `Custom ${hex.toUpperCase()}` });

  const isSelected = (type, value) => {
    if (!selected) return false;
    if (type === 'pantone') return selected.type === 'pantone' && selected.hex === value;
    if (type === 'custom') return selected.type === 'custom' && selected.hex?.toLowerCase() === value.toLowerCase();
    return false;
  };

  const allSwatches = [
    ...paletteSwatches.map(c => ({ hex: c.hex, label: c.name, type: 'pantone', id: c.name })),
    ...contrastSuggestions.map(c => ({ hex: c.hex, label: c.label, type: 'contrast', id: c.hex })),
  ];

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Background
      </Label>

      <div className="flex items-end gap-3 flex-wrap">
        {/* Sketch-derived + contrast swatches */}
        {allSwatches.map((sw) => {
          const sel = sw.type === 'pantone' ? isSelected('pantone', sw.hex) : isSelected('custom', sw.hex);
          return (
            <button
              key={sw.id}
              onClick={() =>
                sw.type === 'pantone'
                  ? selectPantone(sw.hex, sw.label)
                  : selectCustom(sw.hex)
              }
              title={sw.label}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
                  sel
                    ? 'border-foreground scale-110 shadow-md'
                    : 'border-border hover:border-muted-foreground/60'
                }`}
                style={{ backgroundColor: sw.hex }}
              >
                {sel && (
                  <Check
                    className="w-4 h-4 drop-shadow"
                    style={{ color: luminance(sw.hex) > 0.5 ? '#000' : '#fff' }}
                  />
                )}
              </div>
              <span className="text-[8px] text-muted-foreground leading-none truncate max-w-[44px] text-center">
                {sw.type === 'contrast' ? '↔ ' : ''}{sw.label.length > 8 ? sw.label.slice(0, 8) + '…' : sw.label}
              </span>
            </button>
          );
        })}

        {/* Native color picker */}
        <div className="flex flex-col items-center gap-1">
          <label
            title="Custom color"
            className={`w-10 h-10 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-center overflow-hidden ${
              selected?.type === 'custom' && !allSwatches.find(s => s.hex?.toLowerCase() === selected.hex?.toLowerCase())
                ? 'border-foreground scale-110 shadow-md'
                : 'border-border hover:border-muted-foreground/60'
            }`}
            style={{
              background: selected?.type === 'custom'
                ? selected.hex
                : 'linear-gradient(135deg, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
            }}
          >
            <input
              type="color"
              value={selected?.type === 'custom' ? selected.hex : '#ffffff'}
              onChange={e => selectCustom(e.target.value)}
              className="opacity-0 absolute w-0 h-0"
            />
          </label>
          <span className="text-[8px] text-muted-foreground leading-none">Custom</span>
        </div>
      </div>

      {/* Show selected hex */}
      {selected?.hex && (
        <p className="text-[10px] font-mono text-muted-foreground">{selected.hex.toUpperCase()}</p>
      )}
    </div>
  );
}