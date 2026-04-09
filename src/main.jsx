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
  const text = splash.querySelector('span');
  if (text) text.style.color = isDark ? 'white' : '#1a1a1a';
  const paths = splash.querySelectorAll('rect, path');
  paths.forEach(el => {
    if (el.getAttribute('fill') === 'white') el.setAttribute('fill', isDark ? 'white' : '#1a1a1a');
    if (el.getAttribute('stroke') === 'white') el.setAttribute('stroke', isDark ? 'white' : '#1a1a1a');
    if (el.getAttribute('fill') === '#555') el.setAttribute('fill', isDark ? '#555' : '#888');
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)