import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import ImageUploader from '@/components/upload/ImageUploader';
import { useLang } from '@/lib/LangContext';

import SketchSettings from '@/components/settings/SketchSettings';
import MobileHeader from '@/components/MobileHeader';
import PromoDialog from '@/components/PromoDialog';
import InstructionsPopup from '@/components/InstructionsPopup';
import ResultView from '@/components/result/ResultView';
import GeneratingOverlay from '@/components/result/GeneratingOverlay';

const DEFAULT_SETTINGS = {
  style: 'marker_render',
  detail: 75,
  perspective: 'keep_original',
  surface: 'mixed',
  pantoneColors: ['Cool Gray 11C', 'Black C'],
  outputMode: 'single',
  studySheet: 'four_views_eu',
  cleanDesign: false,
  backgroundType: 'colorful',
  textures: [],
  bgColor: { type: 'preset', value: 'white' },
  bwForRaster: false,
};

const STYLE_LABELS = {
  marker_render: 'marker render with bold strokes and smooth gradients',
  bw_lines: 'clean black and white line drawing with precise confident strokes, no color fills, no shading, only black lines on white paper',
  pencil_sketch: 'detailed graphite pencil sketch with fine hatching',
  ballpoint_pen: 'ballpoint pen sketch with confident line work',
  technical_drawing: 'precise technical drawing with clean construction lines',
  watercolor_sketch: 'watercolor rendering with loose expressive washes',
};

const PERSPECTIVE_LABELS = {
  keep_original: 'maintaining the original perspective and angle',
  three_quarter: 'in a dynamic three-quarter perspective view',
  perspective: 'in a natural perspective view with vanishing points',
  isometric: 'in an isometric axonometric projection',
  front_eu: 'as a clean front elevation (European first-angle projection)',
  back_eu: 'as a clean back elevation',
  left_eu: 'as a left-side elevation',
  right_eu: 'as a right-side elevation',
  top_eu: 'as a top plan view',
  bottom_eu: 'as a bottom plan view',
};

const STUDY_SHEET_LABELS = {
  four_views_eu: 'a professional 4-view orthographic study sheet in European first-angle projection (Front elevation top-left, Side elevation top-right, Top plan bottom-left, Back elevation bottom-right) arranged on a single white sheet with thin border lines separating the views and projection labels in small caps',
  four_views_us: 'a professional 4-view orthographic study sheet in US third-angle projection (Front view top-left, Right side view top-right, Top view bottom-left, Perspective/isometric view bottom-right) arranged on a single white sheet',
  six_views: 'a complete 6-view orthographic study sheet showing Front, Back, Left, Right, Top, and Bottom elevations arranged in a cross layout on a single white sheet',
  multi_angle: 'a multi-angle study sheet showing the object from 6 different viewpoints: three-quarter front-left, three-quarter front-right, front, back, three-quarter back, and top — arranged in a 2x3 grid on a single white sheet',
  cross_section: 'a technical cross-section study sheet showing 2–3 key sectional cuts through the object, with hatching on cut surfaces, internal components visible, and section markers on a plan view — all on a single white sheet',
  exploded: 'a professional exploded-view illustration showing all components separated along their assembly axes with thin leader lines indicating assembly order, on a white sheet',
  detail_focus: 'a detail-focus study sheet with one main three-quarter view large in the center and 3–4 zoomed detail callouts around it showing joints, textures, and key features — no text labels, only visual detail circles',
  ideation_sheet: "an ideation study sheet with 6–8 quick concept sketches of the same product at different stages of refinement, arranged loosely on a white sheet like a real designer's sketchbook page",
};

const SURFACE_LABELS = {
  matte: 'matte surface finishes with subtle light diffusion',
  glossy: 'high-gloss reflective surfaces with sharp specular highlights',
  metallic: 'brushed metallic surfaces with anisotropic reflections',
  transparent: 'transparent/translucent material with refraction hints',
  mixed: 'mixed materials with contrasting surface treatments',
};

function buildPrompt(settings, productDescription) {
  const colorPart = settings.style === 'bw_lines'
    ? 'CRITICAL: This is a pure BLACK AND WHITE LINE DRAWING. Use ONLY black lines on a white background. No color, no gray fills, no shading, no tints. Pure line art only.'
    : settings.bwForRaster
    ? 'CRITICAL: Render in pure black and white ONLY — no color, no tints, no grays other than pure black lines on white background. This is a coloring book / line art style output.'
    : settings.pantoneColors.length > 0
    ? `CRITICAL COLOR RULE — NO EXCEPTIONS: You MUST use EXCLUSIVELY these exact Pantone colors and NO other colors: ${settings.pantoneColors.map(c => `PANTONE ${c}`).join(', ')}. Do NOT substitute, approximate, or replace these colors with any other hue. If a Pantone color is orange, render it as orange — not red, not brown, not yellow. Reproduce the exact hue faithfully.`
    : 'Render in monochromatic black, white, and cool grays only.';

  const detailLabel = settings.detail >= 80 ? 'highly detailed and refined' : settings.detail >= 50 ? 'moderately detailed' : 'loose, gestural, and quick';

  const cleanPart = settings.cleanDesign
    ? 'IMPORTANT: No text, no annotations, no dimension lines, no material callouts, no labels, no quotes, no numbers — pure visual sketch only.'
    : 'Include subtle construction lines and light shadow cues typical of professional ID sketches.';

  const surfaceLabel = SURFACE_LABELS[settings.surface];
  const styleLabel = STYLE_LABELS[settings.style];

  const subjectAnchor = productDescription
    ? `CRITICAL SUBJECT — reproduce with absolute fidelity, do NOT alter shape or proportions:\n${productDescription}\nThe sketch must show the EXACT SAME product: same silhouette, same proportions, same components. Do not invent, add, remove or reshape any part.`
    : '';

  const BG_PRESET_LABELS = {
    white: 'pure white background',
    off_white: 'off-white background (#F5F2EE)',
    cream: 'warm cream/ivory (#F5F0E0) background',
    kraft: 'warm kraft paper tan (#C8A882) background',
    light_gray: 'light cool gray (#D8D8D8) background',
    mid_gray: 'medium gray (#888888) background',
    charcoal: 'dark charcoal (#2A2A2A) background, sketch rendered in light lines',
    black: 'deep black (#111111) background, sketch rendered in light lines',
    navy: 'dark navy (#0D1B2A) background, sketch rendered in light lines',
    deep_blue: 'deep indigo blue (#1A237E) background, sketch rendered in light lines',
    forest: 'deep forest green (#1B3A2A) background, sketch rendered in light lines',
    deep_red: 'deep red (#4A0E0E) background, sketch rendered in light lines',
  };
  const bg = settings.bgColor || { type: 'preset', value: 'white' };
  // bgColorLabel removed—now using splashBgPart and markerBgPart directly

  const textures = settings.textures || [];
  const texturePart = textures.length === 0
    ? ''
    : textures.length === 1
      ? `MATERIAL TEXTURE: Product surfaces must clearly show a realistic ${textures[0]} texture — render the grain/weave/surface character with faithful detail in the sketch style.`
      : `MATERIAL TEXTURE COMBO: The product uses two distinct materials — ${textures[0]} and ${textures[1]}. Intelligently assign each texture to different surfaces/components (e.g. primary body in ${textures[0]}, details or panels in ${textures[1]}). Both textures must be visibly distinct and rendered with faithful surface character in the sketch style.`;

  // Compute splash color label from bgColor for splash_bg
  const splashColorLabel = (() => {
    const bg = settings.bgColor || { type: 'preset', value: 'white' };
    if (bg.type === 'custom') return `solid custom color with exact hex value ${bg.hex?.toUpperCase()}`;
    if (bg.type === 'pantone') return `solid ${bg.label} (${bg.hex?.toUpperCase()})`;
    const SPLASH_PRESET_LABELS = {
      white: 'pure white background',
      off_white: 'off-white (#F5F2EE)',
      cream: 'warm cream (#F5F0E0)',
      kraft: 'warm kraft tan (#C8A882)',
      light_gray: 'light cool gray (#D8D8D8)',
      mid_gray: 'medium gray (#888888)',
      charcoal: 'dark charcoal (#2A2A2A)',
      black: 'deep black (#111111)',
      navy: 'dark navy (#0D1B2A)',
      deep_blue: 'deep indigo blue (#1A237E)',
      forest: 'deep forest green (#1B3A2A)',
      deep_red: 'deep red (#4A0E0E)',
    };
    return SPLASH_PRESET_LABELS[bg.value] || 'pure white background';
  })();

  // Compute marker color label (raw loose marker splash)
  const markerColorLabel = (() => {
    const bg = settings.bgColor || { type: 'preset', value: 'white' };
    if (bg.type === 'custom') return `a raw loose marker splash in custom color ${bg.hex?.toUpperCase()}`;
    if (bg.type === 'pantone') return `a raw loose marker splash in ${bg.label} (${bg.hex?.toUpperCase()})`;
    const MARKER_PRESET_LABELS = {
      white: 'white',
      off_white: 'off-white (#F5F2EE)',
      cream: 'warm cream (#F5F0E0)',
      kraft: 'warm kraft tan (#C8A882)',
      light_gray: 'light cool gray (#D8D8D8)',
      mid_gray: 'medium gray (#888888)',
      charcoal: 'dark charcoal (#2A2A2A)',
      black: 'deep black (#111111)',
      navy: 'dark navy (#0D1B2A)',
      deep_blue: 'deep indigo blue (#1A237E)',
      forest: 'deep forest green (#1B3A2A)',
      deep_red: 'deep red (#4A0E0E)',
    };
    return MARKER_PRESET_LABELS[bg.value] || 'white';
  })();

  // Background logic based on backgroundType
  let bgPart = '';
  if (settings.style !== 'bw_lines') {
    if (settings.backgroundType === 'colorful') {
      bgPart = `BACKGROUND: Use a ${splashColorLabel}. The entire background is solid, no gradients, no variations.`;
    } else if (settings.backgroundType === 'splash') {
      bgPart = `FINISHING — MANDATORY: Behind the product, paint a raw loose marker color splash/patch using ${markerColorLabel}, applied in rough irregular strokes like a real Copic marker on paper. The product silhouette must have a VERY BOLD BLACK OUTLINE (3-4pt minimum) on its outer boundary, plus crisp WHITE HIGHLIGHT LINES on all key edges and curved surfaces creating a strong halo effect, making the design pop dramatically against the marker backdrop. The rest of the paper/background outside the splash MUST remain pure white. Aesthetic: professional ID marker sketch on white paper with a raw color marker backdrop, competition-style industrial design presentation.`;
    }
    // backgroundType 'none' → no background instruction
  }

  if (settings.outputMode === 'study_sheet') {
    const sheetLabel = STUDY_SHEET_LABELS[settings.studySheet];
    return `Create a professional industrial design study sheet. ${subjectAnchor}

STRICT RENDERING RULES:
- Preserve the EXACT silhouette, shape and proportions described above
- Do NOT simplify, stylize or redesign the product — only apply the rendering style on the faithful form
- The output must be recognizable as the same product as the input image

Layout: ${sheetLabel}.
Rendering style: ${styleLabel}. Surface material: ${surfaceLabel}.
${detailLabel} line quality. ${colorPart}
${texturePart}
${cleanPart}
${bgPart}
No watermarks, professional industrial design presentation quality.`;
  }

  const perspLabel = PERSPECTIVE_LABELS[settings.perspective];
  return `Create a professional industrial design sketch. ${subjectAnchor}

STRICT RENDERING RULES:
- Preserve the EXACT silhouette, shape and proportions described above
- Do NOT simplify, stylize or redesign the product — only apply the rendering style on the faithful form
- The output must be recognizable as the same product as the input image

Render it as a ${styleLabel}, ${perspLabel}, with ${surfaceLabel}.
${detailLabel} line quality. ${colorPart}
${texturePart}
${cleanPart}
${bgPart}
No watermarks, professional presentation quality.`;
}



export default function Home() {
  const { t } = useLang();
  const [imageUrl, setImageUrl] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [resultUrl, setResultUrl] = useState(null);
  const [genPhase, setGenPhase] = useState(null);
  const [hasWatermark, setHasWatermark] = useState(false);

  const [promoRendersUsed, setPromoRendersUsed] = useState(() =>
    parseInt(localStorage.getItem('promo_renders_used') || '0', 10)
  );
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [tipsRead, setTipsRead] = useState(() => !!localStorage.getItem('sketchooz_tips_read'));

  const PROMO_EXPIRY = new Date('2026-04-23T23:59:59Z');
  const hasPromo = () => {
    const code = localStorage.getItem('promo_code');
    return ['WANNATRY1'].includes(code) && new Date() < PROMO_EXPIRY;
  };

  const checkAndIncrementUsage = async () => {
    const user = await base44.auth.me();
    if (user.role === 'admin') return { allowed: true };
    if (hasPromo()) {
      const used = parseInt(localStorage.getItem('promo_renders_used') || '0', 10);
      if (used < 2) {
        localStorage.setItem('promo_renders_used', String(used + 1));
        setPromoRendersUsed(used + 1);
        return { allowed: true };
      }
      return { allowed: false };
    }
    const packs = await base44.entities.RenderPack.filter({ user_email: user.email });
    const pack = packs.find(p => (p.credits_remaining || 0) >= 3);
    if (pack) {
      await base44.entities.RenderPack.update(pack.id, { credits_remaining: pack.credits_remaining - 3 });
      return { allowed: true, watermark: !!pack.watermark_only };
    }
    return { allowed: false };
  };

  const generateMutation = useMutation({
    mutationFn: async (correctionNote) => {
      setGenPhase('analyzing');
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an industrial designer doing a precise visual analysis for sketch reproduction. Study this product image and describe it with maximum fidelity for a sketch artist who must reproduce it WITHOUT any creative interpretation.

Describe in this exact order:
1. PRODUCT TYPE: What it is
2. SILHOUETTE: Exact outer contour shape (use geometric terms: rectangular, trapezoidal, rounded corners tight/wide, etc.)
3. PROPORTIONS: Width-to-height-to-depth ratios as precisely as possible
4. MAJOR COMPONENTS: Each part, its position, size relative to whole
5. EDGES & TRANSITIONS: Sharp corners, chamfers, fillets, where they occur
6. SURFACE TOPOLOGY: Flat faces, curved surfaces, indentations, protrusions
7. HARDWARE & DETAILS: Buttons, zippers, straps, buckles, stitching, logos — exact positions
8. MATERIAL & TEXTURE: Visible surface character

Be purely descriptive and factual. NO creative additions. Max 150 words.`,
        file_urls: [imageUrl],
      });
      setGenPhase('generating');
      const basePrompt = buildPrompt(settings, analysis);
      const prompt = correctionNote
        ? `${basePrompt}\n\nUSER CORRECTION (apply this to the new render): ${correctionNote}`
        : basePrompt;
      const refImages = correctionNote && resultUrl ? [imageUrl, resultUrl] : [imageUrl];
      const { url } = await base44.integrations.Core.GenerateImage({
        prompt,
        existing_image_urls: refImages,
      });
      return url;
    },
    onMutate: async () => {
      const { allowed, watermark } = await checkAndIncrementUsage();
      setHasWatermark(watermark || false);
      if (!allowed) {
        toast.error(hasPromo() ? t('promoExhausted') : t('freeLimit'));
        throw new Error('limit_reached');
      }
      toast.info(t('generatingToast'), { duration: 4000 });
    },
    onSuccess: (url) => {
      setResultUrl(url);
      setGenPhase(null);
    },
    onError: (err) => {
      setGenPhase(null);
      if (err.message !== 'limit_reached') toast.error(err.message);
    },
  });

  const isGenerating = generateMutation.isPending;

  const handleGenerate = () => {
    if (!imageUrl) return;
    generateMutation.mutate(null);
  };

  const handleRegenerate = (note) => {
    if (!imageUrl) return;
    generateMutation.mutate(note);
  };

  const handleReset = () => {
    setImageUrl(null);
    setResultUrl(null);
    setSettings(DEFAULT_SETTINGS);
    setHasWatermark(false);
  };

  return (
    <ErrorBoundary>
      <div className="flex flex-col flex-1">
        <MobileHeader
          title="Sketchooz"
          subtitle={t('appSubtitle')}
          right={
            (imageUrl || resultUrl) ? (
              <Button variant="ghost" size="sm" onClick={handleReset} className="min-h-[44px]">
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                <span className="hidden sm:inline">Ricomincia</span>
              </Button>
            ) : null
          }
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
          {!imageUrl && !resultUrl ? (
            /* Hero + Upload */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center space-y-3">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {t('heroTitle')} <br />
                  <span className="text-accent">{t('heroTitleAccent')}</span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                  {t('heroDesc')}
                </p>
              </div>
              {!tipsRead && <InstructionsPopup onRead={() => setTipsRead(true)} />}
              <div className={`transition-opacity duration-300 ${tipsRead ? 'opacity-100 pointer-events-auto' : 'opacity-40 pointer-events-none'}`}>
                <ImageUploader
                  onImageUploaded={setImageUrl}
                  uploadedUrl={imageUrl}
                  onClear={() => setImageUrl(null)}
                />
                {!tipsRead && (
                  <p className="text-center text-xs text-muted-foreground mt-2">Read the tips above first ↑</p>
                )}
              </div>
              {tipsRead && <InstructionsPopup onRead={() => setTipsRead(true)} />}
              {!hasPromo() && (
                <div className="text-center">
                  <button
                    className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                    onClick={() => setPromoDialogOpen(true)}
                  >
                    {t('promoLink')}
                  </button>
                </div>
              )}
              <PromoDialog
                open={promoDialogOpen}
                onOpenChange={setPromoDialogOpen}
                onApply={(code) => {
                  if (['WANNATRY1'].includes(code)) {
                    localStorage.setItem('promo_code', code);
                    setPromoRendersUsed(parseInt(localStorage.getItem('promo_renders_used') || '0', 10));
                    toast.success(t('promoApplied'));
                  } else {
                    toast.error(t('promoInvalid'));
                  }
                }}
              />
            </motion.div>
          ) : (
            <>
              {/* Image preview always at top */}
              {imageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <ImageUploader
                    onImageUploaded={setImageUrl}
                    uploadedUrl={imageUrl}
                    onClear={() => { setImageUrl(null); setResultUrl(null); }}
                  />
                </motion.div>
              )}

              {/* Editor Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Settings Panel */}
                <motion.aside
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-3 space-y-6"
                >
                  <div className="bg-card rounded-2xl border border-border p-5 space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold">{t('settings')}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{t('settingsDesc')}</p>
                    </div>
                    <SketchSettings settings={settings} onChange={setSettings} imageUrl={imageUrl} />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !imageUrl}
                    className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('generating')}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {t('generate')}
                      </div>
                    )}
                  </Button>

                  {hasPromo() && (
                    <div className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">🎟️ {t('promoActive')}</span>
                        <span className="text-muted-foreground">{t('promoExpiry')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[0, 1].map(i => (
                          <div key={i} className={`h-2 flex-1 rounded-full ${
                            i < promoRendersUsed ? 'bg-muted-foreground/40' : 'bg-accent'
                          }`} />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{Math.max(0, 2 - promoRendersUsed)} {t('promoRendersLeft')}</p>
                    </div>
                  )}
                </motion.aside>

                {/* Result Area */}
                <div className="lg:col-span-9 space-y-4">
                  <AnimatePresence mode="wait">
                    {isGenerating && <GeneratingOverlay key="gen" phase={genPhase} />}
                    {resultUrl && !isGenerating && (
                      <>
                            <ResultView
                          key="result"
                          originalUrl={imageUrl}
                          resultUrl={resultUrl}
                          hasWatermark={hasWatermark}
                          freeVector={hasPromo()}
                          showRasterDownload={settings.bwForRaster}
                          onRegenerate={handleRegenerate}
                        />
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}