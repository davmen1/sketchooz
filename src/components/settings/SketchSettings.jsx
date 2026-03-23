import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Pen, Palette, Eye, Layout, FileText } from 'lucide-react';
import PantoneSelector from './PantoneSelector';

const SKETCH_STYLES = [
  { value: 'marker_render', label: 'Marker Render' },
  { value: 'pencil_sketch', label: 'Pencil Sketch' },
  { value: 'ballpoint_pen', label: 'Ballpoint Pen' },
  { value: 'technical_drawing', label: 'Technical Drawing' },
  { value: 'watercolor_sketch', label: 'Watercolor Sketch' },
];

// Single views
const SINGLE_VIEWS = [
  { value: 'keep_original', label: 'Original' },
  { value: 'three_quarter', label: '3/4' },
  { value: 'perspective', label: 'Perspective' },
  { value: 'isometric', label: 'Isometric' },
  { value: 'front_eu', label: 'Front' },
  { value: 'back_eu', label: 'Back' },
  { value: 'left_eu', label: 'Left' },
  { value: 'right_eu', label: 'Right' },
  { value: 'top_eu', label: 'Top' },
  { value: 'bottom_eu', label: 'Bottom' },
];

// Study sheet layouts
const STUDY_SHEETS = [
  { value: 'four_views_eu', label: '4-View EU (F/S/T/Back)' },
  { value: 'four_views_us', label: '4-View US (F/R/T/P)' },
  { value: 'six_views', label: '6-View Orthographic' },
  { value: 'multi_angle', label: 'Multi-Angle Study' },
  { value: 'cross_section', label: 'Cross Sections' },
  { value: 'exploded', label: 'Exploded View' },
  { value: 'detail_focus', label: 'Detail Focus' },
  { value: 'ideation_sheet', label: 'Ideation Sheet' },
];

const SURFACES = [
  { value: 'matte', label: 'Matte' },
  { value: 'glossy', label: 'Glossy' },
  { value: 'metallic', label: 'Metallic' },
  { value: 'transparent', label: 'Transparent' },
  { value: 'mixed', label: 'Mixed' },
];

function OptionButton({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
        selected
          ? 'bg-foreground text-background border-foreground'
          : 'bg-card text-muted-foreground border-border hover:border-muted-foreground/50 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

export default function SketchSettings({ settings, onChange }) {
  const update = (key, value) => onChange({ ...settings, [key]: value });

  const isStudySheet = settings.outputMode === 'study_sheet';

  return (
    <div className="space-y-6">

      {/* Output Mode */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Layout className="w-3.5 h-3.5" />
          Output
        </Label>
        <div className="flex gap-2">
          <OptionButton
            label="Single View"
            selected={settings.outputMode === 'single'}
            onClick={() => update('outputMode', 'single')}
          />
          <OptionButton
            label="Study Sheet"
            selected={settings.outputMode === 'study_sheet'}
            onClick={() => update('outputMode', 'study_sheet')}
          />
        </div>
      </div>

      {/* View / Layout selector */}
      {!isStudySheet ? (
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vista</Label>
          <div className="flex flex-wrap gap-1.5">
            {SINGLE_VIEWS.map((v) => (
              <OptionButton
                key={v.value}
                label={v.label}
                selected={settings.perspective === v.value}
                onClick={() => update('perspective', v.value)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="w-3.5 h-3.5" />
            Tavola
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {STUDY_SHEETS.map((s) => (
              <OptionButton
                key={s.value}
                label={s.label}
                selected={settings.studySheet === s.value}
                onClick={() => update('studySheet', s.value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sketch Style */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Pen className="w-3.5 h-3.5" />
          Stile
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {SKETCH_STYLES.map((s) => (
            <OptionButton
              key={s.value}
              label={s.label}
              selected={settings.style === s.value}
              onClick={() => update('style', s.value)}
            />
          ))}
        </div>
      </div>

      {/* Surface */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Palette className="w-3.5 h-3.5" />
          Superficie
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {SURFACES.map((s) => (
            <OptionButton
              key={s.value}
              label={s.label}
              selected={settings.surface === s.value}
              onClick={() => update('surface', s.value)}
            />
          ))}
        </div>
      </div>

      {/* Detail Level */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            Dettaglio
          </Label>
          <span className="text-xs font-mono text-muted-foreground">{settings.detail}%</span>
        </div>
        <Slider
          value={[settings.detail]}
          onValueChange={([v]) => update('detail', v)}
          min={20}
          max={100}
          step={5}
        />
      </div>

      {/* Clean Design toggle */}
      <div className="flex items-center justify-between py-2 border-t border-border">
        <div>
          <p className="text-xs font-semibold">Clean Design</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">No annotations, callouts or text</p>
        </div>
        <Switch
          checked={settings.cleanDesign}
          onCheckedChange={(v) => update('cleanDesign', v)}
        />
      </div>

      {/* Pantone Colors */}
      <PantoneSelector
        selected={settings.pantoneColors}
        onChange={(colors) => update('pantoneColors', colors)}
      />
    </div>
  );
}