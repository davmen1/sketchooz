import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

function isNightTime() {
  const h = new Date().getHours();
  return h >= 21 || h < 7;
}

export function ThemeProvider({ children }) {
  const [forceDark, setForceDark] = useState(() => localStorage.getItem('forceDark') === 'true');
  const [isDark, setIsDark] = useState(() => localStorage.getItem('forceDark') === 'true' ? true : isNightTime());

  const setForceOverride = (val) => {
    setForceDark(val);
    localStorage.setItem('forceDark', val ? 'true' : 'false');
    setIsDark(val ? true : isNightTime());
  };

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, forceDark, setForceOverride }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}