import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Pen, Palette, Eye, Layout, FileText, Sparkles } from 'lucide-react';
import PantoneSelector from './PantoneSelector';
import BackgroundSelector from './BackgroundSelector';
import SuggestPalette from './SuggestPalette';
import { useLang } from '@/lib/LangContext';
import { motion, AnimatePresence } from 'framer-motion';
import InstructionsPopup from '@/components/InstructionsPopup';

const SKETCH_STYLES = [
  { value: 'marker_render', label: 'Marker Colors', descKey: 'markerRenderDesc' },
  { value: 'bw_lines', label: 'BW Lines', descKey: 'bwLinesDesc' },
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

// Study Board layouts (creative/multi-angle)
const STUDY_BOARD_LAYOUTS = [
  { value: 'ideation_sheet', label: 'Ideation Sheet' },
  { value: 'multi_angle', label: 'Multi-Angle Study' },
  { value: 'detail_focus', label: 'Detail Focus' },
  { value: 'exploded', label: 'Exploded View' },
];

// Technical Sheet layouts (orthographic/engineering)
const TECH_SHEET_LAYOUTS = [
  { value: 'four_views_eu', label: '4-View EU' },
  { value: 'four_views_us', label: '4-View US' },
  { value: 'six_views', label: '6-View Ortho' },
  { value: 'cross_section', label: 'Cross Sections' },
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
  const { t, lang } = useLang();
  const textures = settings.textures || [];
  const isBW = settings.style === 'bw_lines';
  const isTechSheet = settings.outputMode === 'tech_sheet';
  const isStudyBoard = settings.outputMode === 'study_sheet';

  const update = (key, value) => onChange({ ...settings, [key]: value });

  const handleOutputMode = (mode) => {
    const patch = { outputMode: mode };
    if (mode === 'tech_sheet') {
      patch.creative = false;
      patch.studySheet = 'four_views_eu';
    } else if (mode === 'study_sheet') {
      patch.studySheet = 'ideation_sheet';
    }
    onChange({ ...settings, ...patch });
  };

  const handleStyle = (style) => {
    const patch = { style };
    if (style === 'bw_lines') patch.markerBg = false;
    onChange({ ...settings, ...patch });
  };

  return (
    <div className="space-y-6">

      {/* Output Mode */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Layout className="w-3.5 h-3.5" />
          {t('output')}
        </Label>
        <div className="flex flex-wrap gap-1.5">
          <OptionButton label="Single Sketch" selected={settings.outputMode === 'single'} onClick={() => handleOutputMode('single')} />
          <OptionButton label="Study Board" selected={settings.outputMode === 'study_sheet'} onClick={() => handleOutputMode('study_sheet')} />
          <OptionButton label="Technical Sheet" selected={settings.outputMode === 'tech_sheet'} onClick={() => handleOutputMode('tech_sheet')} />
        </div>
      </div>

      {/* View / Layout selector */}
      {settings.outputMode === 'single' && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('view')}</Label>
          <div className="flex flex-wrap gap-1.5">
            {SINGLE_VIEWS.map((v) => (
              <OptionButton key={v.value} label={v.label} selected={settings.perspective === v.value} onClick={() => update('perspective', v.value)} />
            ))}
          </div>
        </div>
      )}
      {isStudyBoard && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="w-3.5 h-3.5" /> Study Board Layout
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {STUDY_BOARD_LAYOUTS.map((s) => (
              <OptionButton key={s.value} label={s.label} selected={settings.studySheet === s.value} onClick={() => update('studySheet', s.value)} />
            ))}
          </div>
        </div>
      )}
      {isTechSheet && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="w-3.5 h-3.5" /> Technical Layout
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {TECH_SHEET_LAYOUTS.map((s) => (
              <OptionButton key={s.value} label={s.label} selected={settings.studySheet === s.value} onClick={() => update('studySheet', s.value)} />
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground">{t('techSheetNote')}</p>
        </div>
      )}

      {/* Sketch Style */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Pen className="w-3.5 h-3.5" />
          {t('style')}
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {SKETCH_STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStyle(s.value)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border text-left ${
                settings.style === s.value
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-card text-muted-foreground border-border hover:border-muted-foreground/50 hover:text-foreground'
              }`}
            >
              <div>{s.label}</div>
              <div className={`text-[9px] mt-0.5 ${settings.style === s.value ? 'opacity-70' : 'opacity-50'}`}>{t(s.descKey)}</div>
            </button>
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

      {/* Marker BG toggle — hidden for BW and tech sheet */}
      {!isBW && !isTechSheet && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs font-semibold">{t('markerBg')}</Label>
              <p className="text-[10px] text-muted-foreground mt-0.5">{t('markerBgDesc')}</p>
            </div>
            <Switch checked={!!settings.markerBg} onCheckedChange={(v) => update('markerBg', v)} />
          </div>
          {settings.markerBg && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{lang === 'it' ? 'Spessore outline' : 'Outline thickness'}</Label>
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => update('markerBgThickness', 'thin')}
                  className={`flex-1 py-2 text-xs font-semibold transition-all ${
                    settings.markerBgThickness !== 'thick' ? 'bg-foreground text-background' : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  ✏️ {lang === 'it' ? 'Sottile' : 'Thin'}
                </button>
                <button
                  onClick={() => update('markerBgThickness', 'thick')}
                  className={`flex-1 py-2 text-xs font-semibold transition-all ${
                    settings.markerBgThickness === 'thick' ? 'bg-foreground text-background' : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  🖊️ {lang === 'it' ? 'Spessa' : 'Thick'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Surface — hidden for BW */}
      {!isBW && (
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
      )}

      {/* Creative / Precise Mode — hidden for tech sheet */}
      {!isTechSheet && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            {t('detail') || 'Modalità'}
          </Label>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => update('creative', false)}
              className={`flex-1 py-2 text-xs font-semibold transition-all ${
                !settings.creative ? 'bg-foreground text-background' : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              🎯 {t('preciseMode')}
            </button>
            <button
              onClick={() => update('creative', true)}
              className={`flex-1 py-2 text-xs font-semibold transition-all ${
                settings.creative ? 'bg-accent text-accent-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              ✨ {t('creativeMode')}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {settings.creative ? t('creativeModeDesc') : t('preciseModeDesc')}
          </p>
        </div>
      )}

      {/* Texture — hidden for BW */}
      {!isBW && (
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
      )}

      {/* Pantone palette & suggestions — hidden for BW Lines */}
      {!isBW && (
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

      {/* Background Type — hidden for BW */}
      {!isBW && (
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

      {(settings.backgroundType === 'colorful' || settings.backgroundType === 'splash' || settings.markerBg) && !isBW && (
        <BackgroundSelector
          selected={settings.bgColor}
          onChange={(val) => update('bgColor', val)}
          pantoneColors={settings.pantoneColors}
        />
      )}

      {/* Tips collapsible reference */}
      <div className="pt-2 border-t border-border">
        <InstructionsPopup compact />
      </div>

      </div>
      );
      }