import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LangContext';

export default function SuggestPalette({ imageUrl, onSuggest }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { t } = useLang();

  const handleSuggest = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an industrial design color expert creating a MANDATORY color palette for product rendering.
Task: Analyze this product image and extract a strict, non-negotiable color palette that MUST be applied to the sketch design and background.

Rules (STRICT - NO EXCEPTIONS):
1. Identify EVERY distinct visible color hue in the product (reds, oranges, yellows, greens, blues, purples, blacks, whites, metallics).
2. Map EACH identified color to an exact Pantone Solid Coated name.
3. Do NOT omit any major color. If red is visible, red MUST be in the palette. If blue is visible, blue MUST be included.
4. Return exactly 4-5 Pantone colors that comprehensively cover all hues present in the product.
5. These colors are BINDING requirements for both sketch rendering AND background color selection.
6. Use ONLY exact Pantone names (e.g. "485 C", "Cool Gray 11C", "200 C", "3005 C").
7. Return ONLY the Pantone color names as a JSON array of strings, nothing else.`,
        file_urls: [imageUrl],
        add_context_from_internet: false,
        response_json_schema: {
          type: 'object',
          properties: {
            colors: { type: 'array', items: { type: 'string' } },
          },
        },
      });
      const colors = result?.colors || [];
      if (colors.length > 0) {
        onSuggest(colors);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(t('noPaletteFound'));
      }
    } catch (err) {
      setError(t('paletteError'));
      console.error('Palette suggestion error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleSuggest}
        disabled={loading}
        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg border text-xs transition-all ${
          success
            ? 'border-accent bg-accent/10 text-accent-foreground'
            : error
            ? 'border-destructive bg-destructive/10 text-destructive'
            : 'border-dashed border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 disabled:opacity-50'
        }`}
      >
        {loading ? (
          <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        ) : success ? (
          <span>✓</span>
        ) : (
          <Wand2 className="w-3.5 h-3.5" />
        )}
        {loading ? t('suggestingPalette') : success ? t('paletteApplied') : error ? t('retry') : t('suggestPalette')}
      </button>
      {error && <p className="text-[10px] text-destructive">{error}</p>}
      {!error && <p className="text-[10px] text-muted-foreground">{t('suggestPaletteHint')}</p>}
    </div>
  );
}