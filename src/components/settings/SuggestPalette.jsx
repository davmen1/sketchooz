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
        prompt: `You are an industrial design color consultant. Analyze this product and suggest a curated palette of exactly 3 or 4 Pantone Solid Coated colors that:
1. Are coherent with the product's style, category and aesthetic (e.g. techy products get cool grays/blues, organic products get warm earthy tones, luxury items get metallics/deep tones)
2. Harmonize well together as a color scheme
3. Include at least one neutral (gray, black, white-ish) and one accent color
4. Would look great in a professional industrial design marker render

Return ONLY exact Pantone Solid Coated color names (e.g. "485 C", "Cool Gray 11C", "3005 C") as a JSON array of 3 or 4 strings. Nothing else.`,
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