import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ArrowLeftRight, Maximize2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LangContext';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export default function ResultView({ originalUrl, resultUrl }) {
  const [comparePosition, setComparePosition] = useState(50);
  const [viewMode, setViewMode] = useState('result'); // 'result' | 'compare'

  const [vectorLoading, setVectorLoading] = useState(false);
  const { t } = useLang();

  const handleDownload = async () => {
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = 'industrial-design-sketch.png';
    link.target = '_blank';
    link.click();
  };

  const handleVectorDownload = async () => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      alert('Il checkout funziona solo dall\'app pubblicata. Apri l\'app in una nuova scheda.');
      return;
    }
    setVectorLoading(true);
    const currentUrl = window.location.href;
    const res = await base44.functions.invoke('createVectorCheckout', {
      imageUrl: resultUrl,
      successUrl: currentUrl + '?vector_success=1',
      cancelUrl: currentUrl,
    });
    const { url } = res.data;
    if (url) window.location.href = url;
    setVectorLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
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
          <Button size="sm" variant="outline" onClick={handleVectorDownload} disabled={vectorLoading}>
            {vectorLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : (
              <Layers className="w-3.5 h-3.5 mr-1.5" />
            )}
            {t('vectorDownload')}
          </Button>
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
    </motion.div>
  );
}