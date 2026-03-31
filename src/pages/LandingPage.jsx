import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Layers, Palette, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CTAGallery from '@/components/CTAGallery';
import { base44 } from '@/api/base44Client';

const features = [
{ icon: Sparkles, title: 'AI Sketch Generation', desc: 'Trasforma qualsiasi foto di prodotto in uno sketch professionale di industrial design in pochi secondi.' },
{ icon: Palette, title: 'Colori Pantone', desc: 'Specifica la tua palette Pantone e l\'AI rispetterà fedelmente i tuoi colori di brand.' },
{ icon: Layers, title: 'Stili multipli', desc: 'Marker render, line drawing, pencil sketch, technical drawing, watercolor e molto altro.' },
{ icon: Download, title: 'Pronto per il portfolio', desc: 'Scarica in alta qualità e usa direttamente in presentazioni, pitch e portfolio di design.' }];


export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    base44.auth.isAuthenticated().then((auth) => {
      if (auth) navigate('/app');else
      base44.auth.redirectToLogin('/app');
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* SEO hidden heading */}
      <h1 className="sr-only">Sketchooz - Industrial Design Sketches. <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a> available here.</h1>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69c0940be94e736c4d6366a0/0c4fb1e10_Gemini_Generated_Image_p24ieqp24ieqp24i1.jpg" alt="Sketchooz" className="h-8 w-8 rounded-md object-cover" />
          <span className="font-semibold tracking-widest text-sm uppercase">Industrial Sketches</span>
        </div>
        <Button onClick={handleLogin} size="sm" className="gap-2">
          Accedi <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-6 py-20 text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Sketch di industrial design<br />
              <span className="text-accent">generati dall'AI</span>
            </h1>
            <p className="mt-5 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Carica la foto di un prodotto e ottieni in secondi uno sketch professionale con colori Pantone, diverse prospettive e stili grafici. Ideale per designer, agenzie e studenti.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <Button onClick={handleLogin} size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 rounded-xl">
              <Sparkles className="w-4 h-4" />
              Inizia subito — è gratis
            </Button>
          </motion.div>

          {/* Preview image */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-border shadow-lg bg-card">
            <img src="https://media.base44.com/images/public/69c0940be94e736c4d6366a0/f8eba66d2_Gemini_Generated_Image_vvcje0vvcje0vvcj.jpg"

            alt="Industrial design sketch example" className="w-full object-cover max-h-72" />

            
          </motion.div>
        </section>

        {/* Features */}
        <section className="max-w-4xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, title, desc }) =>
          <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          )}
        </section>

        {/* CTA bottom */}
        <CTAGallery onLogin={handleLogin} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>© 2025 Treddi Studio — sketchooz.com</span>
        <div className="flex gap-4">
          <a href="/privacy" className="hover:text-foreground underline underline-offset-2 transition-colors">Privacy Policy</a>
          <a href="/terms" className="hover:text-foreground underline underline-offset-2 transition-colors">Termini e Condizioni</a>
          <a href="/support" className="hover:text-foreground underline underline-offset-2 transition-colors">Supporto</a>
          <a href="/marketing" className="hover:text-foreground underline underline-offset-2 transition-colors">Media Kit</a>
        </div>
      </footer>
    </div>);

}