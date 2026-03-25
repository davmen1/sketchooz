import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomTabBar from './BottomTabBar';
import Home from '../pages/Home';
import Pricing from '../pages/Pricing';
import Settings from '../pages/Settings';

const TAB_PATHS = ['/', '/pricing', '/settings'];
const TAB_COMPONENTS = { '/': Home, '/pricing': Pricing, '/settings': Settings };

const activeStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  paddingBottom: 'calc(60px + env(safe-area-inset-bottom))',
};

const hiddenStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '100dvh',
  overflow: 'hidden',
  visibility: 'hidden',
  pointerEvents: 'none',
};

export default function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      {TAB_PATHS.map((tabPath) => {
        const isActive = pathname === tabPath;
        const TabComponent = TAB_COMPONENTS[tabPath];
        return (
          <div key={tabPath} style={isActive ? activeStyle : hiddenStyle}>
            <TabComponent />
          </div>
        );
      })}
      <BottomTabBar />
    </div>
  );
}