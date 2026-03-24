import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LangContext';

export default function SuggestPalette({ imageUrl, onSuggest }) {
  const [loading, setLoading] = useState(false);
  const { t } = useLang();

  if (!imageUrl) return null;

  const handleSuggest = async () => {
    setLoading(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this product image and suggest the 2-3 most fitting Pantone colors for an industrial design sketch of this product. Choose colors that closely match the dominant colors visible in the product itself (e.g. body color, accent color, hardware). Return only real Pantone color codes with their exact names as used in Pantone color books (e.g. "Cool Gray 11C", "485 C", "7699 C"). Return a JSON array of strings only.`,
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
    if (colors.length > 0) onSuggest(colors);
    setLoading(false);
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleSuggest}
        disabled={loading}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-all disabled:opacity-50"
      >
        {loading ? (
          <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        ) : (
          <Wand2 className="w-3.5 h-3.5" />
        )}
        {loading ? t('suggestingPalette') : t('suggestPalette')}
      </button>
      <p className="text-[10px] text-muted-foreground">{t('suggestPaletteHint')}</p>
    </div>
  );
}