import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Settings, CreditCard } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

// TABS defined inside component to use translations

export default function BottomTabBar() {
  const location = useLocation();
  const { t } = useLang();
  const TABS = [
    { path: '/', labelKey: 'tabHome', icon: Home },
    { path: '/pricing', labelKey: 'tabPlans', icon: CreditCard },
    { path: '/settings', labelKey: 'tabSettings', icon: Settings },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ path, labelKey, icon: Icon }) => {
        const label = t(labelKey);
        const active = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 select-none transition-colors"
          >
            <Icon
              className={`w-5 h-5 transition-colors ${active ? 'text-accent' : 'text-muted-foreground'}`}
            />
            <span
              className={`text-[10px] font-medium transition-colors ${active ? 'text-accent' : 'text-muted-foreground'}`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}