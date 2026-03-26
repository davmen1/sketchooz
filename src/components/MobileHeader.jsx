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
              onClick={() => navigate('/')}
              className="flex items-center justify-center w-11 h-11 -ml-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors select-none"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
              <img src="/favicon.ico" alt="logo" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-sm font-semibold leading-tight truncate">{title || 'Sketchooz'}</h1>
            {subtitle && <p className="text-[11px] text-muted-foreground leading-tight truncate">{subtitle}</p>}
          </div>
        </div>

        {/* Right slot */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center rounded-lg border border-border bg-muted p-0.5 gap-0.5">
            {['it', 'en'].map((l) => (
              <button
                key={l}
                onClick={() => l !== lang && toggle()}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all select-none ${
                  lang === l
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {l === 'it' ? '🇮🇹 IT' : '🇬🇧 EN'}
              </button>
            ))}
          </div>
          {right}
        </div>
      </div>
    </header>
  );
}