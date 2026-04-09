import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Detect theme and style splash accordingly
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('theme');
const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
const splash = document.getElementById('initial-splash');
if (splash) {
  splash.style.backgroundColor = isDark ? '#161616' : '#f7f6f2';
  const logo = document.getElementById('splash-logo');
  if (logo && !isDark) {
    logo.src = 'https://media.base44.com/images/public/69c0940be94e736c4d6366a0/0c4fb1e10_Gemini_Generated_Image_p24ieqp24ieqp24i1.jpg';
  }
  const text = splash.querySelector('span');
  if (text) text.style.color = isDark ? 'white' : '#1a1a1a';
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