import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Detect theme before React mounts (same logic as ThemeProvider)
function getIsDark() {
  const stored = localStorage.getItem('userTheme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  if (window.matchMedia) return window.matchMedia('(prefers-color-scheme: dark)').matches;
  return false;
}

const isDark = getIsDark();
const splash = document.getElementById('initial-splash');
if (splash) {
  splash.style.backgroundColor = isDark ? '#111111' : '#f7f6f2';
  const img = splash.querySelector('img');
  const text = splash.querySelector('span');
  if (text) text.style.color = isDark ? '#f0f0f0' : '#1a1a1a';
}

function hideSplash() {
  const el = document.getElementById('initial-splash');
  if (!el) return;
  el.style.transition = 'opacity 0.5s ease';
  el.style.opacity = '0';
  setTimeout(() => el.remove(), 600);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);

setTimeout(hideSplash, 800);