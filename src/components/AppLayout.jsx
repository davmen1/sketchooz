import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomTabBar from './BottomTabBar';
import Home from '../pages/Home';
import Pricing from '../pages/Pricing';
import Settings from '../pages/Settings';

const TAB_PATHS = ['/', '/pricing', '/settings'];
const TAB_COMPONENTS = { '/': Home, '/pricing': Pricing, '/settings': Settings };

export default function AppLayout() {
  const { pathname } = useLocation();
  const currentIndex = TAB_PATHS.indexOf(pathname);
  const prevIndexRef = useRef(currentIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const prev = prevIndexRef.current;
    if (prev !== currentIndex) {
      setDirection(currentIndex > prev ? 1 : -1);
      prevIndexRef.current = currentIndex;
    }
  }, [currentIndex]);

  return (
    <div className="relative flex flex-col min-h-screen bg-background overflow-hidden">
      {TAB_PATHS.map((tabPath, idx) => {
        const isActive = pathname === tabPath;
        const TabComponent = TAB_COMPONENTS[tabPath];
        return (
          <motion.div
            key={tabPath}
            animate={{
              x: isActive ? 0 : idx < currentIndex ? '-100%' : '100%',
              visibility: isActive ? 'visible' : 'hidden',
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 38, mass: 0.8 }}
            style={{
              position: isActive ? 'relative' : 'absolute',
              top: 0, left: 0, right: 0,
              flex: isActive ? 1 : undefined,
              display: 'flex',
              flexDirection: 'column',
              minHeight: isActive ? '100%' : '100dvh',
              paddingBottom: 'calc(60px + env(safe-area-inset-bottom))',
              pointerEvents: isActive ? 'auto' : 'none',
              willChange: 'transform',
            }}
          >
            <TabComponent />
          </motion.div>
        );
      })}
      <BottomTabBar />
    </div>
  );
}