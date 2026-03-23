import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import ImageUploader from '@/components/upload/ImageUploader';
import SketchSettings from '@/components/settings/SketchSettings';
import ResultView from '@/components/result/ResultView';
import GeneratingOverlay from '@/components/result/GeneratingOverlay';

const DEFAULT_SETTINGS = {
  style: 'marker_render',
  detail: 75,
  perspective: 'keep_original',
  surface: 'matte',
  pantoneColors: ['Cool Gray 11C', 'Black C'],
  outputMode: 'single',
  studySheet: 'four_views_eu',
  cleanDesign: false,
};

const STYLE_LABELS = {
  marker_render: 'marker render with bold strokes and smooth gradients',
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
  ideation_sheet: 'an ideation study sheet with 6–8 quick concept sketches of the same product at different stages of refinement, arranged loosely on a white sheet like a real designer\'s sketchbook page',
};

const SURFACE_LABELS = {
  matte: 'matte surface finishes with subtle light diffusion',
  glossy: 'high-gloss reflective surfaces with sharp specular highlights',
  metallic: 'brushed metallic surfaces with anisotropic reflections',
  transparent: 'transparent/translucent material with refraction hints',
  mixed: 'mixed materials with contrasting surface treatments',
};

function buildPrompt(settings) {
  const colorPart = settings.pantoneColors.length > 0
    ? `The color palette must use strictly these Pantone colors: ${settings.pantoneColors.map(c => `PANTONE ${c}`).join(', ')}.`
    : 'Render in monochromatic black, white, and cool grays only.';

  const detailLabel = settings.detail >= 80 ? 'highly detailed and refined' : settings.detail >= 50 ? 'moderately detailed' : 'loose, gestural, and quick';

  const cleanPart = settings.cleanDesign
    ? 'IMPORTANT: No text, no annotations, no dimension lines, no material callouts, no labels, no quotes, no numbers — pure visual sketch only.'
    : 'Include subtle construction lines and light shadow cues typical of professional ID sketches.';

  const surfaceLabel = SURFACE_LABELS[settings.surface];
  const styleLabel = STYLE_LABELS[settings.style];

  if (settings.outputMode === 'study_sheet') {
    const sheetLabel = STUDY_SHEET_LABELS[settings.studySheet];
    return `Transform this product into ${sheetLabel}.
Rendering style: professional ${styleLabel}. Surface material: ${surfaceLabel}.
${detailLabel} line quality. ${colorPart}
${cleanPart}
White background, professional industrial design presentation quality, no watermarks.`;
  }

  const perspLabel = PERSPECTIVE_LABELS[settings.perspective];
  return `Transform this image into a professional industrial design sketch as a ${styleLabel}, rendered ${perspLabel}, with ${surfaceLabel}.
${detailLabel} line quality. ${colorPart}
${cleanPart}
White background, professional presentation quality, no watermarks.`;
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [resultUrl, setResultUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!imageUrl) return;
    setIsGenerating(true);
    setResultUrl(null);

    const prompt = buildPrompt(settings);
    const { url } = await base44.integrations.Core.GenerateImage({
      prompt,
      existing_image_urls: [imageUrl],
    });

    setResultUrl(url);
    setIsGenerating(false);
  };

  const handleReset = () => {
    setImageUrl(null);
    setResultUrl(null);
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center">
              <PenLine className="w-5 h-5 text-background" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">SketchForge</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">Industrial Design AI</p>
            </div>
          </div>

          {(imageUrl || resultUrl) && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Ricomincia
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {!imageUrl && !resultUrl ? (
          /* Hero + Upload */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Da idea a sketch <br />
                <span className="text-accent">professionale</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
                Carica una foto, un disegno o una bozza e trasformalo in uno sketch di industrial design con colori Pantone.
              </p>
            </div>
            <ImageUploader
              onImageUploaded={setImageUrl}
              uploadedUrl={imageUrl}
              onClear={() => setImageUrl(null)}
            />
          </motion.div>
        ) : (
          /* Editor Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Settings Panel */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3 space-y-6"
            >
              <div className="bg-card rounded-2xl border border-border p-5 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold">Impostazioni</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Personalizza il risultato</p>
                </div>
                <SketchSettings settings={settings} onChange={setSettings} />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !imageUrl}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generazione...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Genera Sketch
                  </div>
                )}
              </Button>
            </motion.aside>

            {/* Result Area */}
            <div className="lg:col-span-9 space-y-4">
              {/* Original Image (small) */}
              {!resultUrl && !isGenerating && (
                <ImageUploader
                  onImageUploaded={setImageUrl}
                  uploadedUrl={imageUrl}
                  onClear={() => { setImageUrl(null); setResultUrl(null); }}
                />
              )}

              <AnimatePresence mode="wait">
                {isGenerating && <GeneratingOverlay key="gen" />}
                {resultUrl && !isGenerating && (
                  <ResultView
                    key="result"
                    originalUrl={imageUrl}
                    resultUrl={resultUrl}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}