import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Splash always dark
const splash = document.getElementById('initial-splash');
if (splash) {
  splash.style.backgroundColor = '#111111';
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

// Rimuovi lo splash dopo che React ha renderizzato
setTimeout(hideSplash, 800);