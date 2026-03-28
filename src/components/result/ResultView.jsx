import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Maximize2, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LangContext';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function ResultView({ originalUrl, resultUrl, hasWatermark, freeVector, showRasterDownload, onRegenerate }) {
  const [comparePosition, setComparePosition] = useState(50);
  const [viewMode, setViewMode] = useState('result'); // 'result' | 'compare'
  const [correction, setCorrection] = useState('');

  const { t } = useLang();

  const handleDownload = async () => {
    try {
      const res = await fetch(resultUrl, { mode: 'cors' });
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Try Web Share API with files (iOS Safari 15.1+ saves to Photos)
      if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'sketchooz-render.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'sketchooz-render.png', { type: 'image/png' });
        try {
          await navigator.share({ files: [file], title: 'Sketchooz render' });
          URL.revokeObjectURL(objectUrl);
          return;
        } catch {
          // cancelled or failed, fall through
        }
      }

      // Desktop / Android: blob download
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'sketchooz-render.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(resultUrl, '_blank');
    }
  };

  const handleApplyCorrection = () => {
    if (!correction.trim()) return;
    onRegenerate(correction.trim());
    setCorrection('');
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {hasWatermark && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <span>⚠️</span>
          <span>{t('watermarkBanner')}</span>
          <a href="/pricing" className="ml-auto font-semibold underline whitespace-nowrap">{t('upgrade') || 'Upgrade'}</a>
        </div>
      )}
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'result' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('result')}
          >
            {t('result')}
          </Button>
          <Button
            variant={viewMode === 'compare' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('compare')}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 mr-1.5" />
            {t('compare')}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-2">
              <img src={resultUrl} alt="Full size result" className="w-full rounded-lg" />
            </DialogContent>
          </Dialog>
          <Button size="sm" onClick={handleDownload} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {t('download')}
          </Button>
        </div>
      </div>

      {/* Image Display */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
        <AnimatePresence mode="wait">
          {viewMode === 'result' ? (
            <motion.img
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={resultUrl}
              alt="Industrial design sketch"
              className="w-full h-auto"
            />
          ) : (
            <motion.div
              key="compare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <img src={resultUrl} alt="Result" className="w-full h-auto" />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${comparePosition}%` }}
              >
                <img
                  src={originalUrl}
                  alt="Original"
                  className="w-full h-auto"
                  style={{ width: `${10000 / comparePosition}%`, maxWidth: 'none' }}
                />
              </div>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                style={{ left: `${comparePosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4 text-foreground" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {viewMode === 'compare' && (
        <div className="px-4">
          <Slider
            value={[comparePosition]}
            onValueChange={([v]) => setComparePosition(v)}
            min={5}
            max={95}
            step={1}
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">{t('original')}</span>
            <span className="text-xs text-muted-foreground">{t('sketch')}</span>
          </div>
        </div>
      )}

      {/* Correction box */}
      {onRegenerate && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('correctionsLabel')}</p>
            <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">3 crediti</span>
          </div>
          <textarea
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            placeholder={t('correctionsPlaceholder')}
            rows={3}
            className="w-full text-sm rounded-xl border border-border bg-background px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
          />
          <Button
            disabled={!correction.trim()}
            onClick={handleApplyCorrection}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              {t('correctionsApply')}
            </div>
          </Button>
          <p className="text-[10px] text-muted-foreground text-center">{t('correctionsNote')}</p>
        </div>
      )}
    </motion.div>
  );
}