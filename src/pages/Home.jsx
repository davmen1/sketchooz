import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import ImageUploader from '@/components/upload/ImageUploader';
import SketchSettings from '@/components/settings/SketchSettings';
import ResultView from '@/components/result/ResultView';
import GeneratingOverlay from '@/components/result/GeneratingOverlay';

const PANTONE_HEX_MAP = {
  'Cool Gray 11C': '#53565A',
  'Black C': '#2D2926',
  'Warm Gray 1C': '#D6D2C4',
  '185 C': '#E4002B',
  '021 C': '#FE5000',
  '116 C': '#FFCD00',
  '3005 C': '#0077C8',
  '348 C': '#00843D',
  '2685 C': '#56368A',
  '7527 C': '#D5C6B1',
  '7543 C': '#98A4AE',
  '427 C': '#D0D3D4',
  '1505 C': '#FF8200',
  '2925 C': '#009CDE',
  '375 C': '#97D700',
  '225 C': '#E0457B',
};

const DEFAULT_SETTINGS = {
  style: 'marker_render',
  detail: 75,
  perspective: 'keep_original',
  surface: 'matte',
  pantoneColors: ['Cool Gray 11C', 'Black C'],
};

const STYLE_LABELS = {
  marker_render: 'marker render with bold strokes and smooth gradients',
  pencil_sketch: 'detailed graphite pencil sketch with fine hatching',
  ballpoint_pen: 'ballpoint pen sketch with confident line work',
  technical_drawing: 'precise technical drawing with clean construction lines',
  watercolor_sketch: 'watercolor rendering with loose expressive washes',
};

const PERSPECTIVE_LABELS = {
  three_quarter: 'in a dynamic three-quarter perspective view',
  front: 'in a clean front elevation view',
  side: 'in a side profile view',
  isometric: 'in an isometric projection',
  keep_original: 'maintaining the original perspective and angle',
};

const SURFACE_LABELS = {
  matte: 'with matte surface finishes showing subtle light diffusion',
  glossy: 'with high-gloss reflective surfaces and sharp highlights',
  metallic: 'with brushed metallic surfaces and metallic reflections',
  transparent: 'with transparent/translucent material rendering',
  mixed: 'with mixed materials showing contrasting surface treatments',
};

function buildPrompt(settings) {
  const colorNames = settings.pantoneColors.map(c => `PANTONE ${c}`).join(', ');
  const detailLabel = settings.detail >= 80 ? 'highly detailed' : settings.detail >= 50 ? 'moderately detailed' : 'loose and gestural';

  return `Transform this image into a professional industrial design sketch in the style of a ${STYLE_LABELS[settings.style]}. 
Render it ${PERSPECTIVE_LABELS[settings.perspective]}, ${SURFACE_LABELS[settings.surface]}.
Use a ${detailLabel} approach. The color palette must use only these Pantone colors: ${colorNames}. 
Include subtle construction lines, material callouts, and dimensional hints typical of professional ID sketches. 
The sketch should look like it was drawn by a senior industrial designer on high-quality marker paper. 
White background, professional presentation quality.`;
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