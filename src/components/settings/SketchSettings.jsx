import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Pen, Palette, Eye, RotateCcw } from 'lucide-react';
import PantoneSelector from './PantoneSelector';

const SKETCH_STYLES = [
  { value: 'marker_render', label: 'Marker Render' },
  { value: 'pencil_sketch', label: 'Pencil Sketch' },
  { value: 'ballpoint_pen', label: 'Ballpoint Pen' },
  { value: 'technical_drawing', label: 'Technical Drawing' },
  { value: 'watercolor_sketch', label: 'Watercolor Sketch' },
];

const PERSPECTIVES = [
  { value: 'three_quarter', label: '3/4 View' },
  { value: 'front', label: 'Front View' },
  { value: 'side', label: 'Side View' },
  { value: 'isometric', label: 'Isometric' },
  { value: 'keep_original', label: 'Mantieni originale' },
];

const SURFACES = [
  { value: 'matte', label: 'Matte' },
  { value: 'glossy', label: 'Glossy' },
  { value: 'metallic', label: 'Metallic' },
  { value: 'transparent', label: 'Transparent' },
  { value: 'mixed', label: 'Mixed Materials' },
];

export default function SketchSettings({ settings, onChange }) {
  const update = (key, value) => onChange({ ...settings, [key]: value });

  return (
    <div className="space-y-6">
      {/* Sketch Style */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Pen className="w-3.5 h-3.5" />
          Stile Sketch
        </Label>
        <Select value={settings.style} onValueChange={(v) => update('style', v)}>
          <SelectTrigger className="bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SKETCH_STYLES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Detail Level */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            Livello Dettaglio
          </Label>
          <span className="text-xs font-mono text-muted-foreground">{settings.detail}%</span>
        </div>
        <Slider
          value={[settings.detail]}
          onValueChange={([v]) => update('detail', v)}
          min={20}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Perspective */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <RotateCcw className="w-3.5 h-3.5" />
          Prospettiva
        </Label>
        <Select value={settings.perspective} onValueChange={(v) => update('perspective', v)}>
          <SelectTrigger className="bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERSPECTIVES.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Surface */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Palette className="w-3.5 h-3.5" />
          Superficie
        </Label>
        <Select value={settings.surface} onValueChange={(v) => update('surface', v)}>
          <SelectTrigger className="bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SURFACES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pantone Colors */}
      <PantoneSelector
        selected={settings.pantoneColors}
        onChange={(colors) => update('pantoneColors', colors)}
      />
    </div>
  );
}