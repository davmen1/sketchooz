import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const sections = [
  {
    emoji: '🎨',
    title: 'Dark Mode',
    body: 'Sketchooz fully supports dark mode. Users can toggle between light and dark themes directly from the Settings page. The preference is saved and restored on every app launch.',
  },
  {
    emoji: 'Aa',
    title: 'Text Size',
    body: 'Users can choose between three text sizes (Small, Normal, Large) from the Settings page. The selected size is applied globally across all screens and persisted across sessions.',
  },
  {
    emoji: '🌐',
    title: 'Language Support',
    body: 'The app is fully available in both Italian and English. Users can switch language at any time using the language toggle in the top navigation bar.',
  },
  {
    emoji: '⚡',
    title: 'Reduce Motion',
    body: 'Sketchooz includes a Reduce Motion toggle in the Settings page. When enabled, all animations and transitions are disabled across the entire app. This is designed to help users who experience dizziness, nausea or discomfort caused by visual motion effects.',
  },
  {
    emoji: '👆',
    title: 'Touch Target Sizes',
    body: 'All interactive elements (buttons, toggles, tabs) meet the minimum 44×44pt touch target size recommended by Apple\'s Human Interface Guidelines.',
  },
  {
    emoji: '📱',
    title: 'Safe Area Support',
    body: 'The app correctly handles safe area insets on all iPhone and iPad models, including those with Dynamic Island or Home Indicator, ensuring no content is obscured.',
  },
  {
    emoji: '🔒',
    title: 'No Disorienting Content',
    body: 'Sketchooz does not contain flashing content, auto-playing video, or aggressive visual effects. All motion is optional and controllable by the user.',
  },
];

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center justify-center w-9 h-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold">Accessibility</h1>
            <p className="text-[11px] text-muted-foreground">Sketchooz – Accessibility Statement</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        {/* Intro */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h2 className="text-2xl font-bold">Accessibility at Sketchooz</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sketchooz is committed to building an inclusive experience for all users. Below is a summary of the accessibility features available in the app, aligned with Apple's Human Interface Guidelines and iOS accessibility best practices.
          </p>
          <p className="text-xs text-muted-foreground">
            App: Sketchooz · Developer: Treddi Studio · Contact: <a href="mailto:treddistudio@gmail.com" className="underline">treddistudio@gmail.com</a>
          </p>
        </motion.div>

        {/* Features */}
        <div className="space-y-4">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-5 flex gap-4"
            >
              <div className="text-2xl w-10 shrink-0 flex items-start justify-center pt-0.5">{s.emoji}</div>
              <div>
                <h3 className="text-sm font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
          <p>Last updated: April 2026</p>
          <p>For accessibility-related questions or requests, contact us at <a href="mailto:treddistudio@gmail.com" className="underline">treddistudio@gmail.com</a>.</p>
          <div className="flex gap-4 pt-2">
            <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="underline hover:text-foreground">Terms of Service</Link>
            <Link to="/support" className="underline hover:text-foreground">Support</Link>
          </div>
        </div>
      </main>
    </div>
  );
}