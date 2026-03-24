import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BottomTabBar from './BottomTabBar';

const slideVariants = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '-30%', opacity: 0 },
};

const transition = { type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.3 };

export default function AppLayout({ children }) {
  const location = useLocation();

  return (
    <div className="relative flex flex-col min-h-screen bg-background overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={transition}
          className="flex-1 flex flex-col min-h-screen"
          // Extra bottom padding so content clears the tab bar (~60px) + safe area
          style={{ paddingBottom: 'calc(60px + env(safe-area-inset-bottom))' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <BottomTabBar />
    </div>
  );
}