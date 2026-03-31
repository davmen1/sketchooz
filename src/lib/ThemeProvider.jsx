import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

function isNightTime() {
  const h = new Date().getHours();
  return h >= 21 || h < 7;
}

function getInitialDark() {
  const stored = localStorage.getItem('userTheme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  // Prefer system color scheme over time-based fallback
  if (window.matchMedia) return window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isNightTime();
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(getInitialDark);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('userTheme', next ? 'dark' : 'light');
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Listen to system color scheme changes if user hasn't manually set a preference
  useEffect(() => {
    const stored = localStorage.getItem('userTheme');
    if (stored || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}