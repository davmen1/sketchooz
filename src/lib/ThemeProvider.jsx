import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

function isNightTime() {
  const h = new Date().getHours();
  return h >= 21 || h < 7;
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(isNightTime);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsDark(isNightTime());
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}