import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Pen, Palette, Eye, Layout, FileText, Sparkles } from 'lucide-react';
import PantoneSelector from './PantoneSelector';
import BackgroundSelector from './BackgroundSelector';
import SuggestPalette from './SuggestPalette';
import { useLang } from '@/lib/LangContext';

const SKETCH_STYLES = [
  { value: 'marker_render', label: 'Marker Render' },
  { value: 'bw_lines', label: 'BW Lines' },
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



const TEXTURES = [
  { value: 'wood', label: 'Wood' },
  { value: 'stone', label: 'Stone' },
  { value: 'leather', label: 'Leather' },
  { value: 'fabric', label: 'Fabric' },
  { value: 'metal', label: 'Metal' },
  { value: 'carbon', label: 'Carbon' },
  { value: 'ceramic', label: 'Ceramic' },
  { value: 'glass', label: 'Glass' },
];

const METAL_PALETTES = [
  { label: 'Silver', colors: ['877C', 'Cool Gray 11C'] },
  { label: 'Gold', colors: ['871C', '1235C'] },
  { label: 'Bronze', colors: ['876C', '7519C'] },
  { label: 'Titanium', colors: ['Cool Gray 9C', '432C'] },
  { label: 'Chrome', colors: ['877C', 'Cool Gray 1C'] },
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

function toggleTexture(textures, value) {
  if (textures.includes(value)) return textures.filter(t => t !== value);
  if (textures.length >= 2) return [textures[1], value]; // slide window, max 2
  return [...textures, value];
}

export default function SketchSettings({ settings, onChange, imageUrl }) {
  const update = (key, value) => onChange({ ...settings, [key]: value });
  const textures = settings.textures || [];
  const { t } = useLang();

  const isStudySheet = settings.outputMode === 'study_sheet';

  return (
    <div className="space-y-6">

      {/* Output Mode */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Layout className="w-3.5 h-3.5" />
        {t('output')}
        </Label>
        <div className="flex gap-2">
          <OptionButton
            label={t('singleView')}
            selected={settings.outputMode === 'single'}
            onClick={() => update('outputMode', 'single')}
          />
          <OptionButton
            label={t('studySheet')}
            selected={settings.outputMode === 'study_sheet'}
            onClick={() => update('outputMode', 'study_sheet')}
          />
        </div>
      </div>

      {/* View / Layout selector */}
      {!isStudySheet ? (
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('view')}</Label>
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
            {t('board')}
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

      {/* Sketch Style — Marker Render only */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Pen className="w-3.5 h-3.5" />
          {t('style')}
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

      {/* Clean Design toggle */}
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-xs font-semibold">{t('cleanDesign')}</Label>
          <p className="text-[10px] text-muted-foreground mt-0.5">{t('cleanDesignDesc')}</p>
        </div>
        <Switch
          checked={!!settings.cleanDesign}
          onCheckedChange={(v) => update('cleanDesign', v)}
        />
      </div>

      {/* Surface */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Palette className="w-3.5 h-3.5" />
          {t('surface')}
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
            {t('detail')}
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

      {/* Texture (max 2 combo) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t('texture')}
          </Label>
          <span className="text-[10px] text-muted-foreground">{textures.length}/2 {t('selected')}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TEXTURES.map((t) => (
            <OptionButton
              key={t.value}
              label={t.label}
              selected={textures.includes(t.value)}
              onClick={() => update('textures', toggleTexture(textures, t.value))}
            />
          ))}
        </div>
        {textures.length === 2 && (
          <p className="text-[10px] text-muted-foreground">
            {t('textureComboNote').replace('{t1}', textures[0]).replace('{t2}', textures[1])}
          </p>
        )}
      </div>

      {/* Pantone palette & suggestions — hidden for BW Lines */}
      {settings.style !== 'bw_lines' && (
        <>
          <SuggestPalette
            imageUrl={imageUrl}
            onSuggest={(colors) => update('pantoneColors', colors)}
          />
          <PantoneSelector
            selected={settings.pantoneColors}
            onChange={(colors) => update('pantoneColors', colors)}
          />
        </>
      )}

      {/* Background Type: Colorful vs Splash vs None */}
      {settings.style !== 'bw_lines' && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5" />
            {t('background')}
          </Label>
          <div className="flex flex-wrap gap-2">
            <OptionButton
              label={t('colorful')}
              selected={settings.backgroundType === 'colorful'}
              onClick={() => update('backgroundType', 'colorful')}
            />
            <OptionButton
              label={t('splash')}
              selected={settings.backgroundType === 'splash'}
              onClick={() => update('backgroundType', 'splash')}
            />
            <OptionButton
              label={t('noBackground')}
              selected={settings.backgroundType === 'none'}
              onClick={() => update('backgroundType', 'none')}
            />
          </div>
        </div>
      )}

      {/* Background Color Selector — shown for Colorful mode */}
      {settings.backgroundType === 'colorful' && settings.style !== 'bw_lines' && (
        <BackgroundSelector
          selected={settings.bgColor}
          onChange={(val) => update('bgColor', val)}
          pantoneColors={settings.pantoneColors}
        />
      )}
      </div>
      );
      }