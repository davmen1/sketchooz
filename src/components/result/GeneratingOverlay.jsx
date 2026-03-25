import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pen } from 'lucide-react';

// phase: 'analyzing' | 'generating' | null (null = auto-cycle)
const PHASE_STEPS = {
  analyzing: 0,   // Analisi prodotto
  generating: 3,  // Rendering sketch
};

const steps = [
  'Analisi del prodotto...',
  'Riconoscimento forme e dettagli...',
  'Costruzione del prompt fedele...',
  'Rendering sketch...',
  'Applicazione colori Pantone...',
  'Rifinitura finale...',
];

export default function GeneratingOverlay({ phase }) {
  const startStep = PHASE_STEPS[phase] ?? 0;
  const [currentStep, setCurrentStep] = React.useState(startStep);

  // When phase changes externally, jump to the matching step
  React.useEffect(() => {
    const step = PHASE_STEPS[phase];
    if (step !== undefined) setCurrentStep(step);
  }, [phase]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Skeleton shimmer for result image area */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-card/60 to-transparent animate-[shimmer_1.8s_ease-in-out_infinite] -translate-x-full" />
        {/* Subtle sketch-line skeleton lines */}
        <div className="absolute inset-0 flex flex-col justify-center items-center gap-3 opacity-20">
          {[40, 60, 50, 70, 45, 55].map((w, i) => (
            <div key={i} className="h-1.5 rounded-full bg-muted-foreground" style={{ width: `${w}%` }} />
          ))}
        </div>
        {/* Spinner + icon overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-2 border-muted border-t-accent"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Pen className="w-6 h-6 text-accent" />
            </div>
          </div>
          <div className="text-center space-y-1.5 px-6">
            <h3 className="text-sm font-semibold">Generazione in corso</h3>
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-muted-foreground"
            >
              {steps[currentStep]}
            </motion.p>
          </div>
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  i <= currentStep ? 'bg-accent' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}