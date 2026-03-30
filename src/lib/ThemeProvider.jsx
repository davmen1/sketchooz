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

  // Auto-update only if user hasn't manually set a preference
  useEffect(() => {
    const stored = localStorage.getItem('userTheme');
    if (stored) return;
    const interval = setInterval(() => {
      setIsDark(isNightTime());
    }, 60 * 1000);
    return () => clearInterval(interval);
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