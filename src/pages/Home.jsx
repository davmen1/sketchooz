import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import ImageUploader from '@/components/upload/ImageUploader';
import { useLang } from '@/lib/LangContext';
import { Link } from 'react-router-dom';
import SketchSettings from '@/components/settings/SketchSettings';
import MobileHeader from '@/components/MobileHeader';
import PromoDialog from '@/components/PromoDialog';
import PullToRefresh from '@/components/PullToRefresh';
import InstructionsPopup from '@/components/InstructionsPopup';
import ResultView from '@/components/result/ResultView';
import GeneratingDisclaimer from '@/components/GeneratingDisclaimer';
import GeneratingOverlay from '@/components/result/GeneratingOverlay';
import { buildPrompt } from '@/lib/buildPrompt';

const DEFAULT_SETTINGS = {
  style: 'marker_render',
  creative: false,
  perspective: 'keep_original',
  surface: 'mixed',
  pantoneColors: ['Cool Gray 11C', 'Black C'],
  outputMode: 'single',
  studySheet: 'four_views_eu',
  cleanDesign: false,
  backgroundType: 'colorful',
  markerBg: false,
  textures: [],
  bgColor: { type: 'preset', value: 'white' },
  bwForRaster: false,
};

export default function Home() {
  const { t } = useLang();
  const [imageUrl, setImageUrl] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [resultUrl, setResultUrl] = useState(null);
  const [genPhase, setGenPhase] = useState(null);
  const [hasWatermark, setHasWatermark] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [promoDialogOpen, setPromoDialogOpen] = useState(false);
  const [tipsRead, setTipsRead] = useState(() => !!localStorage.getItem('sketchooz_tips_read'));

  const isEnterprise = currentUser?.role === 'enterprise' || currentUser?.role === 'admin';

  useEffect(() => {
    base44.auth.me().then(u => {
      setCurrentUser(u);
      base44.functions.invoke('initFreeTrial', {}).catch(() => {});
    }).catch(() => {});
  }, []);

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
9. COLORS: List ALL distinct colors present on the product. Be specific (e.g. "light gray body, dark charcoal trim, soft pink panel"). Do NOT omit any color, even minor ones.

Be purely descriptive and factual. NO creative additions. Max 180 words.`,
        file_urls: [imageUrl],
      });
      setGenPhase('generating');
      const basePrompt = buildPrompt(settings, analysis);
      const prompt = correctionNote
        ? `${basePrompt}\n\nUSER CORRECTION (apply this to the new render): ${correctionNote}`
        : basePrompt;
      const STYLE_REFS = [
        'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/63d94a161_d40ba72e-1709-4adf-9609-5ce4c6df16dd.jpg',
        'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/4e3840955_1743086351196.jpg',
        'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/ccd36380c_b4db17f7a_generated_image1.png',
        'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/e9bb99d21_images.jpg',
        'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/12833b668_images.jpeg',
      ];
      const refImages = correctionNote && resultUrl
        ? [imageUrl, resultUrl, ...STYLE_REFS]
        : [imageUrl, ...STYLE_REFS];
      const { url } = await base44.integrations.Core.GenerateImage({
        prompt,
        existing_image_urls: refImages,
      });
      return url;
    },
    onMutate: async () => {
      let allowed, watermark;
      try {
        const res = await base44.functions.invoke('consumeCredit', {});
        allowed = res.data.allowed;
        watermark = res.data.watermark;
      } catch (e) {
        toast.error('Errore nel controllo crediti. Riprova.');
        throw new Error('credit_check_failed');
      }
      setHasWatermark(watermark || false);
      if (!allowed) {
        toast.error(t('freeLimit'));
        throw new Error('limit_reached');
      }
      toast.info(t('generatingToast'), { duration: 4000 });
      setShowDisclaimer(true);
    },
    onSuccess: (url) => {
      setResultUrl(url);
      setGenPhase(null);
      setShowDisclaimer(false);
    },
    onError: (err) => {
      setGenPhase(null);
      setShowDisclaimer(false);
      if (err.message !== 'limit_reached' && err.message !== 'credit_check_failed') toast.error(err.message);
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

  const handleApplyPromo = async (code) => {
    try {
      const res = await base44.functions.invoke('applyPromoCode', { promo_code: code });
      if (res.data.success) {
        toast.success(t('promoApplied'));
      } else {
        toast.error(res.data.error || t('promoInvalid'));
      }
    } catch {
      toast.error(t('promoInvalid'));
    }
    setPromoDialogOpen(false);
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

        <PullToRefresh onRefresh={() => {}}>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
          {!imageUrl && !resultUrl ? (
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
              </div>
              <div className="text-center">
                <button
                  className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                  onClick={() => setPromoDialogOpen(true)}
                >
                  {t('promoLink')}
                </button>
              </div>
              <PromoDialog
                open={promoDialogOpen}
                onOpenChange={setPromoDialogOpen}
                onApply={handleApplyPromo}
              />
              <div className="flex items-center justify-center gap-4 pt-2">
                <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">Privacy Policy</Link>
                <span className="text-muted-foreground/40 text-xs">·</span>
                <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">Termini e Condizioni</Link>
              </div>
            </motion.div>
          ) : (
            <>
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

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                </motion.aside>

                <div className="lg:col-span-9 space-y-4">
                  {showDisclaimer && isGenerating && (
                    <GeneratingDisclaimer visible={showDisclaimer} onClose={() => setShowDisclaimer(false)} />
                  )}
                  <AnimatePresence mode="wait">
                    {isGenerating && <GeneratingOverlay key="gen" phase={genPhase} />}
                    {resultUrl && !isGenerating && (
                      <ResultView
                        key="result"
                        originalUrl={imageUrl}
                        resultUrl={resultUrl}
                        hasWatermark={hasWatermark}
                        freeVector={false}
                        showRasterDownload={settings.bwForRaster}
                        isEnterprise={isEnterprise}
                        onRegenerate={handleRegenerate}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
          </main>
        </PullToRefresh>
      </div>
    </ErrorBoundary>
  );
}