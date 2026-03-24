import React, { useEffect, useRef, useState } from 'react';

/**
 * Loads an image URL onto a canvas and overlays a sophisticated repeating watermark
 * that is baked into the pixel data — making AI inpainting removal very difficult.
 * Returns a blob URL via onReady(url).
 */
export default function WatermarkCanvas({ imageUrl, onReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      // Draw base image
      ctx.drawImage(img, 0, 0);

      const w = canvas.width;
      const h = canvas.height;
      const unit = Math.max(w, h) / 12; // scale with image size

      // --- Layer 1: diagonal dot grid (subtle but dense) ---
      ctx.save();
      for (let x = 0; x < w + unit; x += unit * 0.55) {
        for (let y = 0; y < h + unit; y += unit * 0.55) {
          const angle = (x + y) * 0.003;
          const px = x + Math.sin(angle) * 4;
          const py = y + Math.cos(angle) * 4;
          ctx.beginPath();
          ctx.arc(px, py, unit * 0.04, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(80, 60, 40, 0.18)';
          ctx.fill();
        }
      }
      ctx.restore();

      // --- Layer 2: diagonal repeating text lines ---
      const texts = ['SKETCHFORGE', '© SKETCHFORGE', '⬡ SF'];
      ctx.save();
      ctx.font = `bold ${unit * 0.38}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const step = unit * 3.2;
      const rows = Math.ceil((w + h) / step) + 4;
      const cols = Math.ceil((w + h) / (unit * 8)) + 4;

      for (let row = -2; row < rows; row++) {
        for (let col = -2; col < cols; col++) {
          const tx = col * unit * 7.5 + (row % 2) * unit * 3.5;
          const ty = row * step - unit * 2;
          ctx.save();
          ctx.translate(tx, ty);
          ctx.rotate(-0.52); // ~30 degrees
          // Primary label
          ctx.globalAlpha = 0.22;
          ctx.fillStyle = '#1a1a1a';
          ctx.fillText(texts[row % texts.length], 0, 0);
          // Offset shadow for depth/noise
          ctx.globalAlpha = 0.10;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(texts[row % texts.length], 1.5, 1.5);
          ctx.restore();
        }
      }
      ctx.restore();

      // --- Layer 3: cross-hatch lines at 2 angles ---
      ctx.save();
      ctx.lineWidth = Math.max(0.5, unit * 0.018);
      // Forward slash lines
      for (let i = -h; i < w + h; i += unit * 1.1) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h, h);
        ctx.strokeStyle = 'rgba(40,40,40,0.06)';
        ctx.stroke();
      }
      // Back slash lines
      for (let i = -h; i < w + h; i += unit * 1.1) {
        ctx.beginPath();
        ctx.moveTo(i, h);
        ctx.lineTo(i + h, 0);
        ctx.strokeStyle = 'rgba(40,40,40,0.06)';
        ctx.stroke();
      }
      ctx.restore();

      // --- Layer 4: corner & center logo stamps ---
      const stamps = [
        [w * 0.5, h * 0.5],
        [w * 0.15, h * 0.15],
        [w * 0.85, h * 0.15],
        [w * 0.15, h * 0.85],
        [w * 0.85, h * 0.85],
      ];
      ctx.save();
      ctx.font = `900 ${unit * 0.55}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const [sx, sy] of stamps) {
        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(-0.52);
        // Hexagon background
        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const angle = (Math.PI / 3) * a - Math.PI / 6;
          const r = unit * 0.9;
          a === 0 ? ctx.moveTo(r * Math.cos(angle), r * Math.sin(angle)) : ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(20, 20, 20, 0.13)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = unit * 0.05;
        ctx.stroke();
        // SF monogram
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('SF', 0, 0);
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#000000';
        ctx.fillText('SF', 1, 1);
        ctx.restore();
      }
      ctx.restore();

      // Export
      canvas.toBlob((blob) => {
        if (blob) onReady(URL.createObjectURL(blob));
      }, 'image/png', 0.95);
    };
    img.onerror = () => onReady(imageUrl); // fallback: return original
    img.src = imageUrl;
  }, [imageUrl]);

  return <canvas ref={canvasRef} className="hidden" />;
}