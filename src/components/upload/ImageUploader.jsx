import React, { useCallback, useState } from 'react';
import { useLang } from '@/lib/LangContext';
import { Upload, Image as ImageIcon, X, Camera } from 'lucide-react';
import { vibrate } from '@/lib/nativeUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function ImageUploader({ onImageUploaded, uploadedUrl, onClear }) {
  const { t, lang } = useLang();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    if (!SUPPORTED_TYPES.includes(file.type)) {
      alert('Formato non supportato. Usa PNG, JPG o WEBP.');
      return;
    }
    // Optimistic: show local preview immediately
    const localUrl = URL.createObjectURL(file);
    onImageUploaded(localUrl);
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    URL.revokeObjectURL(localUrl);
    onImageUploaded(file_url);
    setIsUploading(false);
  }, [onImageUploaded]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  if (uploadedUrl) {
    return (
      <div className="relative group rounded-2xl overflow-hidden border border-border bg-card">
        <img src={uploadedUrl} alt="Uploaded" className="w-full h-72 object-contain bg-muted/50" />
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-foreground/80 text-background hover:bg-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/40 to-transparent">
          <p className="text-white/80 text-xs font-medium">{lang === 'it' ? 'Immagine caricata' : 'Image uploaded'}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      animate={{ scale: isDragging ? 1.02 : 1 }}
      className={`relative border-2 border-dashed rounded-2xl h-72 flex flex-col items-center justify-center cursor-pointer transition-colors ${
        isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-muted-foreground/40 bg-card'
      }`}
      onClick={() => {
        if (!isUploading) document.getElementById('file-input').click();
      }}
    >
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <input
        id="camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      
      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-10 h-10 border-3 border-muted-foreground/20 border-t-accent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">{lang === 'it' ? 'Caricamento...' : 'Uploading...'}</p>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex gap-3">
              <div
                className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={(e) => { e.stopPropagation(); vibrate(10); document.getElementById('file-input').click(); }}
              >
                {isDragging ? (
                  <ImageIcon className="w-6 h-6 text-accent" />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div
                className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={(e) => { e.stopPropagation(); vibrate(10); document.getElementById('camera-input').click(); }}
              >
                <Camera className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isDragging ? (lang === 'it' ? 'Rilascia qui' : 'Drop here') : (lang === 'it' ? 'Carica immagine o sketch' : 'Upload image or sketch')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {lang === 'it' ? 'PNG, JPG, WEBP (no AVIF/HEIC) — Foto, disegni, bozze' : 'PNG, JPG, WEBP (no AVIF/HEIC) — Photos, drawings, drafts'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}