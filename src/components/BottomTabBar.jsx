import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Settings, Coins, Images } from 'lucide-react';
import { isMobileOrTabletApp } from '@/utils/platformDetect';
import { vibrate } from '@/lib/nativeUtils';
import { useLang } from '@/lib/LangContext';

export default function BottomTabBar() {
  const location = useLocation();
  const { t, lang } = useLang();
  const isMobile = isMobileOrTabletApp();
  const it = lang === 'it';

  const MOBILE_TABS = [
    { path: '/app', label: it ? 'Inizio' : 'Home', icon: Home },
    { path: '/app/pricing', label: 'Info', icon: Coins },
    { path: '/app/gallery', label: it ? 'Galleria' : 'Gallery', icon: Images },
    { path: '/app/settings', label: it ? 'Impostazioni' : 'Settings', icon: Settings },
  ];

  const WEB_TABS = [
    { path: '/app', label: it ? 'Inizio' : 'Home', icon: Home },
    { path: '/app/pricing', label: 'Info', icon: Coins },
    { path: '/app/plans', label: it ? 'Piani crediti' : 'Plans', icon: Coins },
    { path: '/app/gallery', label: it ? 'Galleria' : 'Gallery', icon: Images },
    { path: '/app/settings', label: it ? 'Impostazioni' : 'Settings', icon: Settings },
  ];

  const TABS = isMobile ? MOBILE_TABS : WEB_TABS;

  const navigate = useNavigate();

  const handleTabClick = (path) => {
    vibrate(8);
    const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    if (isActive) {
      navigate(path);
    } else {
      navigate(path);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border flex"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {TABS.map(({ path, label, icon: Icon }) => {
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