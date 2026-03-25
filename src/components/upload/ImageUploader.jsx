import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function ImageUploader({ onImageUploaded, uploadedUrl, onClear }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    if (!SUPPORTED_TYPES.includes(file.type)) {
      alert('Formato non supportato. Usa PNG, JPG o WEBP.');
      return;
    }
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
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
          <p className="text-white/80 text-xs font-medium">Immagine caricata</p>
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
            <p className="text-sm text-muted-foreground">Caricamento...</p>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              {isDragging ? (
                <ImageIcon className="w-6 h-6 text-accent" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isDragging ? 'Rilascia qui' : 'Carica immagine o sketch'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WEBP (no AVIF/HEIC) — Foto, disegni, bozze
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}