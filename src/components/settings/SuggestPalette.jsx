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
        prompt: `You are a creative industrial design color consultant. Look at this product and generate a CREATIVE, HARMONIOUS color palette for a professional sketch render — not just the product's existing colors, but a curated combination that would look stunning as a rendered design.

Your task:
1. Identify the product TYPE and its aesthetic character (sleek/techy, organic/soft, rugged, luxury, etc.).
2. Create a FRESH, visually striking palette of 4-5 Pantone Solid Coated colors that:
   - Harmonize beautifully together (use color theory: analogous, complementary, or triadic schemes)
   - Suit the product's aesthetic perfectly
   - Include a range from light to dark to give depth to the render
   - Feel modern and design-forward
3. You are NOT constrained to the product's current colors — be creative and suggest what would look GREAT.
4. Return ONLY exact Pantone Solid Coated names (e.g. "485 C", "Cool Gray 11C", "200 C", "3005 C").
5. Return ONLY the Pantone color names as a JSON array of strings, nothing else.`,
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