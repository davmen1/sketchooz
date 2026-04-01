import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getGallery, vibrate } from '@/lib/nativeUtils';
import MobileHeader from '@/components/MobileHeader';
import { useLang } from '@/lib/LangContext';

export default function Gallery() {
  const { lang } = useLang();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setItems(getGallery());
  }, []);

  const handleDownload = async (url) => {
    vibrate(15);
    try {
      const res = await fetch(url, { mode: 'cors' });
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      if (navigator.canShare?.({ files: [new File([blob], 'sketchooz-render.png', { type: 'image/png' })] })) {
        const file = new File([blob], 'sketchooz-render.png', { type: 'image/png' });
        try { await navigator.share({ files: [file], title: 'Sketchooz render' }); return; } catch {}
      }
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'sketchooz-render.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  const handleClear = () => {
    vibrate([10, 50, 10]);
    localStorage.removeItem('sketchooz_gallery');
    setItems([]);
    setSelected(null);
  };

  const label = (it, en) => lang === 'it' ? it : en;

  return (
    <div className="flex flex-col flex-1">
      <MobileHeader
        title={label('Galleria', 'Gallery')}
        subtitle={label(`${items.length} render salvati`, `${items.length} saved renders`)}
        right={
          items.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive min-h-[44px]">
              <Trash2 className="w-4 h-4" />
            </Button>
          ) : null
        }
      />
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
            <Images className="w-12 h-12 opacity-30" />
            <p className="text-sm">{label('Nessun render salvato', 'No saved renders')}</p>
            <p className="text-xs">{label('Genera un render per vederlo qui', 'Generate a render to see it here')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, idx) => (
              <motion.div
                key={item.timestamp}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="relative group rounded-xl overflow-hidden border border-border bg-card aspect-square cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <img src={item.url} alt="Render" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownload(item.url); }}
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-2 left-2 text-[10px] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 gap-4"
            onClick={() => setSelected(null)}
          >
            <img
              src={selected.url}
              alt="Render"
              className="max-w-full max-h-[80vh] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
              <Button onClick={() => handleDownload(selected.url)} className="bg-accent text-accent-foreground">
                <Download className="w-4 h-4 mr-2" />
                {label('Scarica', 'Download')}
              </Button>
              <Button variant="outline" className="text-white border-white/30" onClick={() => setSelected(null)}>
                {label('Chiudi', 'Close')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}