import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, PenLine } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

export default function MobileHeader({ title, subtitle, right }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggle } = useLang();
  const isRoot = location.pathname === '/';


  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: back button or logo */}
        <div className="flex items-center gap-3 min-w-0">
          {!isRoot ? (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-11 h-11 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors select-none"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center shrink-0">
              <PenLine className="w-5 h-5 text-background" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-sm font-semibold leading-tight truncate">{title || 'SketchForge'}</h1>
            {subtitle && <p className="text-[11px] text-muted-foreground leading-tight truncate">{subtitle}</p>}
          </div>
        </div>

        {/* Right slot */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggle}
            className="flex items-center justify-center h-8 px-2.5 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors select-none"
            aria-label="Toggle language"
          >
            {lang === 'it' ? '🇮🇹 IT' : '🇬🇧 EN'}
          </button>
          {right}
        </div>
      </div>
    </header>
  );
}