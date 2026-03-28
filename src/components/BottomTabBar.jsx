import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Settings, CreditCard } from 'lucide-react';
import { useLang } from '@/lib/LangContext';

export default function BottomTabBar() {
  const location = useLocation();
  const { t } = useLang();
  const TABS = [
    { path: '/app', labelKey: 'tabHome', icon: Home },
    { path: '/app/pricing', labelKey: 'tabPlans', icon: CreditCard },
    { path: '/app/settings', labelKey: 'tabSettings', icon: Settings },
  ];

  const navigate = useNavigate();

  const handleTabClick = (path) => {
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    if (isActive) {
      // If already on this tab, reset to root (double-tap to top)
      navigate(path);
    } else {
      // Navigate without replace to preserve stack
      navigate(path);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ path, labelKey, icon: Icon }) => {
        const label = t(labelKey);
        const active = path === '/app'
          ? location.pathname === '/app'
          : location.pathname === path || location.pathname.startsWith(path + '/');
        return (
          <button
            key={path}
            onClick={() => handleTabClick(path)}
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
          </button>
        );
      })}
    </nav>
  );
}