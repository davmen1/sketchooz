import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/LangContext';
import { Zap } from 'lucide-react';

export default function CreditCounter() {
  const [credits, setCredits] = useState(null);
  const navigate = useNavigate();
  const { lang } = useLang();

  useEffect(() => {
    base44.entities.RenderPack.filter({}).then(packs => {
      const total = packs.reduce((sum, p) => sum + (p.credits_remaining || 0), 0);
      setCredits(total);
    }).catch(() => setCredits(0));

    const unsub = base44.entities.RenderPack.subscribe(() => {
      base44.entities.RenderPack.filter({}).then(packs => {
        const total = packs.reduce((sum, p) => sum + (p.credits_remaining || 0), 0);
        setCredits(total);
      });
    });
    return unsub;
  }, []);

  if (credits === null) return null;

  return (
    <button
      onClick={() => navigate('/pricing')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card text-xs font-semibold transition-colors hover:bg-muted"
    >
      <Zap className="w-3 h-3 text-accent" />
      <span className={credits === 0 ? 'text-destructive' : 'text-foreground'}>
        {credits} {lang === 'it' ? 'crediti' : 'credits'}
      </span>
    </button>
  );
}