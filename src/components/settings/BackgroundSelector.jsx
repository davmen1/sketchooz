import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { PANTONE_PALETTES } from './PantoneSelector';

// High-contrast design background presets
const PRESET_BACKGROUNDS = [
  { value: 'white', label: 'White', hex: '#FFFFFF' },
  { value: 'off_white', label: 'Off-White', hex: '#F5F2EE' },
  { value: 'cream', label: 'Cream', hex: '#F5F0E0' },
  { value: 'kraft', label: 'Kraft', hex: '#C8A882' },
  { value: 'light_gray', label: 'Lt. Gray', hex: '#D8D8D8' },
  { value: 'mid_gray', label: 'Mid Gray', hex: '#888888' },
  { value: 'charcoal', label: 'Charcoal', hex: '#2A2A2A' },
  { value: 'black', label: 'Black', hex: '#111111' },
  { value: 'navy', label: 'Navy', hex: '#0D1B2A' },
  { value: 'deep_blue', label: 'Deep Blue', hex: '#1A237E' },
  { value: 'forest', label: 'Forest', hex: '#1B3A2A' },
  { value: 'deep_red', label: 'Deep Red', hex: '#4A0E0E' },
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

function cmykToRgb(c, m, y, k) {
  const r = Math.round(255 * (1 - c / 100) * (1 - k / 100));
  const g = Math.round(255 * (1 - m / 100) * (1 - k / 100));
  const b = Math.round(255 * (1 - y / 100) * (1 - k / 100));
  return { r, g, b };
}

function rgbToCmyk(r, g, b) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = Math.round((1 - rn - k) / (1 - k) * 100);
  const m = Math.round((1 - gn - k) / (1 - k) * 100);
  const y = Math.round((1 - bn - k) / (1 - k) * 100);
  return { c, m, y, k: Math.round(k * 100) };
}

const PALETTE_COLORS = [
  '#FFFFFF','#F5F5F5','#E0E0E0','#BDBDBD','#9E9E9E','#757575','#616161','#424242','#212121','#000000',
  '#FFEBEE','#FFCDD2','#EF9A9A','#E57373','#EF5350','#F44336','#E53935','#D32F2F','#C62828','#B71C1C',
  '#FCE4EC','#F8BBD9','#F48FB1','#F06292','#EC407A','#E91E63','#D81B60','#C2185B','#AD1457','#880E4F',
  '#F3E5F5','#E1BEE7','#CE93D8','#BA68C8','#AB47BC','#9C27B0','#8E24AA','#7B1FA2','#6A1B9A','#4A148C',
  '#E8EAF6','#C5CAE9','#9FA8DA','#7986CB','#5C6BC0','#3F51B5','#3949AB','#303F9F','#283593','#1A237E',
  '#E3F2FD','#BBDEFB','#90CAF9','#64B5F6','#42A5F5','#2196F3','#1E88E5','#1976D2','#1565C0','#0D47A1',
  '#E0F7FA','#B2EBF2','#80DEEA','#4DD0E1','#26C6DA','#00BCD4','#00ACC1','#0097A7','#00838F','#006064',
  '#E8F5E9','#C8E6C9','#A5D6A7','#81C784','#66BB6A','#4CAF50','#43A047','#388E3C','#2E7D32','#1B5E20',
  '#FFFDE7','#FFF9C4','#FFF59D','#FFF176','#FFEE58','#FFEB3B','#FDD835','#F9A825','#F57F17','#FF6F00',
  '#FFF3E0','#FFE0B2','#FFCC80','#FFB74D','#FFA726','#FF9800','#FB8C00','#F57C00','#E65100','#BF360C',
];

export default function BackgroundSelector({ selected, onChange, pantoneColors }) {
  const [showCustom, setShowCustom] = useState(false);
  const [colorMode, setColorMode] = useState('palette'); // 'palette' | 'rgb' | 'cmyk' | 'hex'
  const [rgb, setRgb] = useState({ r: 255, g: 255, b: 255 });
  const [cmyk, setCmyk] = useState({ c: 0, m: 0, y: 0, k: 0 });

  // Derive 2 palette-matched colors from selected Pantone colors
  const allColors = PANTONE_PALETTES.flatMap(p => p.colors);
  const paletteSwatches = pantoneColors
    .slice(0, 2)
    .map(name => allColors.find(c => c.name === name))
    .filter(Boolean);

  const selectPreset = (value) => onChange({ type: 'preset', value });
  const selectPantone = (hex, name) => onChange({ type: 'pantone', hex, label: `PANTONE ${name}` });
  const selectCustom = (hex) => onChange({ type: 'custom', hex, label: `Custom ${hex.toUpperCase()}` });

  const currentHex = selected?.type === 'custom'
    ? selected.hex
    : selected?.type === 'pantone'
      ? selected.hex
      : PRESET_BACKGROUNDS.find(b => b.value === selected?.value)?.hex || '#FFFFFF';

  const handleRgbChange = (key, val) => {
    const newRgb = { ...rgb, [key]: parseInt(val) || 0 };
    setRgb(newRgb);
    setCmyk(rgbToCmyk(newRgb.r, newRgb.g, newRgb.b));
    selectCustom(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleCmykChange = (key, val) => {
    const newCmyk = { ...cmyk, [key]: parseInt(val) || 0 };
    setCmyk(newCmyk);
    const newRgb = cmykToRgb(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
    setRgb(newRgb);
    selectCustom(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHexInput = (val) => {
    const hex = val.startsWith('#') ? val : '#' + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const { r, g, b } = hexToRgb(hex);
      setRgb({ r, g, b });
      setCmyk(rgbToCmyk(r, g, b));
      selectCustom(hex);
    }
  };

  const isSelected = (type, value) => {
    if (!selected) return false;
    if (type === 'preset') return selected.type === 'preset' && selected.value === value;
    if (type === 'pantone') return selected.type === 'pantone' && selected.hex === value;
    if (type === 'custom') return selected.type === 'custom';
    return false;
  };

  return (
    <div className="space-y-3">
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Background
      </Label>

      {/* Pantone-derived colors from sketch palette */}
      {paletteSwatches.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">From sketch palette</p>
          <div className="flex gap-2">
            {paletteSwatches.map((color) => (
              <button
                key={color.name}
                onClick={() => selectPantone(color.hex, color.name)}
                title={`PANTONE ${color.name}`}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-10 h-10 rounded-xl border-2 transition-all flex items-center justify-center ${
                    isSelected('pantone', color.hex)
                      ? 'border-foreground scale-110 shadow-md'
                      : 'border-border hover:border-muted-foreground/60'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected('pantone', color.hex) && (
                    <Check className="w-4 h-4 drop-shadow" style={{ color: parseInt(color.hex.slice(1), 16) > 0x888888 ? '#000' : '#fff' }} />
                  )}
                </div>
                <span className="text-[8px] text-muted-foreground leading-none truncate max-w-[44px] text-center">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* High-contrast presets */}
      <div className="space-y-1.5">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">High contrast presets</p>
        <div className="grid grid-cols-6 gap-1.5">
          {PRESET_BACKGROUNDS.map((bg) => (
            <button
              key={bg.value}
              onClick={() => selectPreset(bg.value)}
              title={bg.label}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${
                  isSelected('preset', bg.value)
                    ? 'border-foreground scale-110 shadow-md'
                    : 'border-border hover:border-muted-foreground/60'
                }`}
                style={{ backgroundColor: bg.hex }}
              >
                {isSelected('preset', bg.value) && (
                  <Check className="w-3 h-3 drop-shadow" style={{ color: parseInt(bg.hex.slice(1), 16) > 0x888888 ? '#000' : '#fff' }} />
                )}
              </div>
              <span className="text-[8px] text-muted-foreground leading-none truncate w-full text-center">{bg.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom color */}
      <div className="border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="w-full flex items-center justify-between px-3 py-2 bg-secondary/50 hover:bg-secondary transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded border border-border"
              style={{ backgroundColor: selected?.type === 'custom' ? selected.hex : '#FFFFFF' }}
            />
            <span className="text-xs font-medium">Custom Color</span>
            {selected?.type === 'custom' && (
              <span className="text-[10px] font-mono text-muted-foreground">{selected.hex?.toUpperCase()}</span>
            )}
          </div>
          {showCustom ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
        {showCustom && (
          <div className="p-3 bg-card space-y-3">
            {/* Mode tabs */}
            <div className="flex gap-1 flex-wrap">
              {['palette', 'rgb', 'cmyk', 'hex'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setColorMode(mode)}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase transition-all ${
                    colorMode === mode ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {colorMode === 'palette' && (
              <div className="space-y-2">
                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
                  {PALETTE_COLORS.map((hex) => (
                    <button
                      key={hex}
                      title={hex}
                      onClick={() => {
                        const { r, g, b } = hexToRgb(hex);
                        setRgb({ r, g, b });
                        setCmyk(rgbToCmyk(r, g, b));
                        selectCustom(hex);
                      }}
                      className={`aspect-square rounded transition-all border-2 ${
                        selected?.type === 'custom' && selected.hex?.toLowerCase() === hex.toLowerCase()
                          ? 'border-foreground scale-110 shadow-md'
                          : 'border-transparent hover:border-muted-foreground/50'
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                {/* Native color picker for precision */}
                <div className="flex items-center gap-2">
                  <label className="text-[9px] uppercase font-semibold text-muted-foreground">Scegli</label>
                  <input
                    type="color"
                    value={selected?.type === 'custom' ? selected.hex : '#FFFFFF'}
                    onChange={e => {
                      const hex = e.target.value;
                      const { r, g, b } = hexToRgb(hex);
                      setRgb({ r, g, b });
                      setCmyk(rgbToCmyk(r, g, b));
                      selectCustom(hex);
                    }}
                    className="w-8 h-8 rounded cursor-pointer border border-border bg-transparent p-0.5"
                  />
                  {selected?.type === 'custom' && (
                    <span className="text-[10px] font-mono text-muted-foreground">{selected.hex?.toUpperCase()}</span>
                  )}
                </div>
              </div>
            )}

            {colorMode === 'rgb' && (
              <div className="grid grid-cols-3 gap-2">
                {['r', 'g', 'b'].map(ch => (
                  <div key={ch} className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-muted-foreground">{ch}</label>
                    <input
                      type="number"
                      min={0} max={255}
                      value={rgb[ch]}
                      onChange={e => handleRgbChange(ch, e.target.value)}
                      className="w-full text-xs px-2 py-1.5 bg-background border border-border rounded-lg font-mono"
                    />
                  </div>
                ))}
              </div>
            )}

            {colorMode === 'cmyk' && (
              <div className="grid grid-cols-4 gap-1.5">
                {['c', 'm', 'y', 'k'].map(ch => (
                  <div key={ch} className="space-y-1">
                    <label className="text-[9px] uppercase font-semibold text-muted-foreground">{ch}</label>
                    <input
                      type="number"
                      min={0} max={100}
                      value={cmyk[ch]}
                      onChange={e => handleCmykChange(ch, e.target.value)}
                      className="w-full text-xs px-2 py-1.5 bg-background border border-border rounded-lg font-mono"
                    />
                  </div>
                ))}
              </div>
            )}

            {colorMode === 'hex' && (
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-semibold text-muted-foreground">Hex</label>
                <input
                  type="text"
                  defaultValue={selected?.type === 'custom' ? selected.hex : '#FFFFFF'}
                  onChange={e => handleHexInput(e.target.value)}
                  maxLength={7}
                  className="w-full text-xs px-2 py-1.5 bg-background border border-border rounded-lg font-mono uppercase"
                />
              </div>
            )}

            {/* Preview */}
            <div
              className="w-full h-8 rounded-lg border border-border"
              style={{ backgroundColor: selected?.type === 'custom' ? selected.hex : '#FFFFFF' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}