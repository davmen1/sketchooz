import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Check, ChevronDown } from 'lucide-react';

export const PANTONE_PALETTES = [
  {
    name: 'Neutrals',
    colors: [
      { name: 'Black C', hex: '#2D2926' },
      { name: 'Cool Gray 11C', hex: '#53565A' },
      { name: 'Cool Gray 7C', hex: '#97999B' },
      { name: 'Cool Gray 3C', hex: '#C8C9C7' },
      { name: 'Warm Gray 11C', hex: '#796E65' },
      { name: 'Warm Gray 7C', hex: '#ADA89F' },
      { name: 'Warm Gray 3C', hex: '#D0CBC4' },
      { name: 'Warm Gray 1C', hex: '#D6D2C4' },
      { name: '427 C', hex: '#D0D3D4' },
      { name: '9180 C', hex: '#F2EFE8' },
    ],
  },
  {
    name: 'Reds & Pinks',
    colors: [
      { name: '485 C', hex: '#DA291C' },
      { name: '185 C', hex: '#E4002B' },
      { name: '200 C', hex: '#BA0C2F' },
      { name: '1925 C', hex: '#CE0058' },
      { name: '225 C', hex: '#E0457B' },
      { name: '218 C', hex: '#E56DB1' },
      { name: '812 C', hex: '#FF3EB5' },
      { name: 'Rhodamine Red C', hex: '#E10098' },
    ],
  },
  {
    name: 'Oranges & Yellows',
    colors: [
      { name: '021 C', hex: '#FE5000' },
      { name: '1505 C', hex: '#FF8200' },
      { name: '137 C', hex: '#FFA300' },
      { name: '116 C', hex: '#FFCD00' },
      { name: '102 C', hex: '#FEDD00' },
      { name: '7548 C', hex: '#F6BE00' },
      { name: '1235 C', hex: '#FFA526' },
      { name: '151 C', hex: '#FF8000' },
    ],
  },
  {
    name: 'Blues',
    colors: [
      { name: 'Reflex Blue C', hex: '#001489' },
      { name: '2955 C', hex: '#00315E' },
      { name: '294 C', hex: '#004B87' },
      { name: '3005 C', hex: '#0077C8' },
      { name: '299 C', hex: '#0095DA' },
      { name: '2925 C', hex: '#009CDE' },
      { name: '279 C', hex: '#418FDE' },
      { name: '2985 C', hex: '#59CBE8' },
    ],
  },
  {
    name: 'Greens',
    colors: [
      { name: '350 C', hex: '#224634' },
      { name: '349 C', hex: '#006633' },
      { name: '348 C', hex: '#00843D' },
      { name: '354 C', hex: '#00B140' },
      { name: '375 C', hex: '#97D700' },
      { name: '3278 C', hex: '#00966C' },
      { name: '3265 C', hex: '#2DCCD3' },
      { name: '3242 C', hex: '#71C5E8' },
    ],
  },
  {
    name: 'Purples',
    colors: [
      { name: '269 C', hex: '#3B1F6B' },
      { name: '2685 C', hex: '#56368A' },
      { name: '7671 C', hex: '#6B5B95' },
      { name: '527 C', hex: '#7B2F8C' },
      { name: '2592 C', hex: '#A05EB5' },
      { name: '667 C', hex: '#B59FCA' },
      { name: '2563 C', hex: '#C9A5D2' },
      { name: '9360 C', hex: '#E8D5F5' },
    ],
  },
  {
    name: 'Browns & Earths',
    colors: [
      { name: '4625 C', hex: '#3D1A00' },
      { name: '4695 C', hex: '#6B2D0F' },
      { name: '7526 C', hex: '#9E4A1E' },
      { name: '7522 C', hex: '#B5651D' },
      { name: '729 C', hex: '#C68642' },
      { name: '7510 C', hex: '#D4A05A' },
      { name: '7508 C', hex: '#E0C080' },
      { name: '9180 C', hex: '#F2E6C8' },
      { name: '4515 C', hex: '#B8A99A' },
      { name: '4665 C', hex: '#C9B99A' },
    ],
  },
  {
    name: 'Industrial',
    colors: [
      { name: '7527 C', hex: '#D5C6B1' },
      { name: '7543 C', hex: '#98A4AE' },
      { name: '7545 C', hex: '#4F6271' },
      { name: '432 C', hex: '#3D4F58' },
      { name: '444 C', hex: '#7A8B8D' },
      { name: '877 C', hex: '#8A8D8F' },
      { name: '871 C', hex: '#85754E' },
      { name: '8201 C', hex: '#7ABFBF' },
    ],
  },
];

export default function PantoneSelector({ selected, onChange }) {
  const [openPalette, setOpenPalette] = useState('Neutrals');

  const toggle = (colorName) => {
    if (selected.includes(colorName)) {
      onChange(selected.filter((c) => c !== colorName));
    } else {
      onChange([...selected, colorName]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pantone Colors
        </Label>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <button onClick={clearAll} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
              Clear
            </button>
          )}
          <span className="text-xs text-muted-foreground">{selected.length} selected</span>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {selected.map((name) => {
            const found = PANTONE_PALETTES.flatMap(p => p.colors).find(c => c.name === name);
            return found ? (
              <button
                key={name}
                onClick={() => toggle(name)}
                title={`PANTONE ${name} — click to remove`}
                className="w-6 h-6 rounded-md border-2 border-foreground/40 hover:border-destructive transition-colors flex-shrink-0"
                style={{ backgroundColor: found.hex }}
              />
            ) : null;
          })}
        </div>
      )}

      <div className="space-y-1.5">
        {PANTONE_PALETTES.map((palette) => {
          const isOpen = openPalette === palette.name;
          const selectedInPalette = palette.colors.filter(c => selected.includes(c.name)).length;
          return (
            <div key={palette.name} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenPalette(isOpen ? null : palette.name)}
                className="w-full flex items-center justify-between px-3 py-2 bg-secondary/50 hover:bg-secondary transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {palette.colors.slice(0, 5).map(c => (
                      <div key={c.name} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                  <span className="text-xs font-medium">{palette.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedInPalette > 0 && (
                    <span className="text-[10px] bg-accent text-accent-foreground rounded-full px-1.5 py-0.5 font-semibold">
                      {selectedInPalette}
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {isOpen && (
                <div className="grid grid-cols-5 gap-1.5 p-3 bg-card">
                  {palette.colors.map((color) => {
                    const isSelected = selected.includes(color.name);
                    return (
                      <button
                        key={color.name}
                        onClick={() => toggle(color.name)}
                        title={`PANTONE ${color.name}`}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`w-full aspect-square rounded-lg border-2 transition-all flex items-center justify-center ${
                            isSelected
                              ? 'border-foreground scale-105 shadow-md'
                              : 'border-transparent hover:border-muted-foreground/40'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 drop-shadow-md" style={{ color: parseInt(color.hex.slice(1), 16) > 0x888888 ? '#000' : '#fff' }} />
                          )}
                        </div>
                        <span className="text-[8px] text-muted-foreground leading-none truncate w-full text-center">
                          {color.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}