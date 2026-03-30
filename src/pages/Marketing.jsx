import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, Palette, Layers } from 'lucide-react';

export default function Marketing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-6 py-4 flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-semibold text-sm">Media Kit & Marketing</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-14 flex-1 space-y-10">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
            <Palette className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-3xl font-bold">Media Kit</h1>
          <p className="text-muted-foreground">Risorse per creator, agenzie e stampa che vogliono parlare di Sketchooz.</p>
        </div>

        {/* Brand */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Brand Identity</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-foreground flex items-center justify-center h-24">
              <span className="text-background font-bold tracking-widest text-sm uppercase">Sketchooz</span>
            </div>
            <div className="rounded-xl border border-border bg-background flex items-center justify-center h-24">
              <span className="text-foreground font-bold tracking-widest text-sm uppercase">Sketchooz</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Logo su sfondo scuro e chiaro. Colore accent: <code className="bg-muted px-1 rounded">#4ade80</code> (green-400)</p>
        </div>

        {/* About */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">Chi siamo</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Sketchooz</strong> è uno strumento AI per designer industriali, agenzie di prodotto e studenti di design. 
            Permette di trasformare foto di prodotti in sketch professionali in pochi secondi, con supporto per colori Pantone, 
            stili multipli (marker render, line drawing, pencil sketch, watercolor) e diverse prospettive.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sviluppato da <strong>Treddi Studio</strong> con sede in Italia. Lanciato nel 2024.
          </p>
        </div>

        {/* Stats */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2"><Layers className="w-4 h-4" /> Funzionalità chiave</h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            {[
              'Generazione AI di sketch professionali da foto',
              'Supporto palette Pantone personalizzata',
              'Stili: marker render, line drawing, pencil, watercolor, technical',
              'Output singolo o scheda study sheet multi-vista',
              'Correzioni iterative con prompt testuale',
              'Download in alta qualità per portfolio e presentazioni',
            ].map(f => (
              <li key={f} className="flex items-start gap-2">
                <span className="text-accent mt-0.5">✦</span> {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">Contatti Press & Partnership</h2>
          <p className="text-sm text-muted-foreground">Per collaborazioni, partnership, articoli o recensioni contattaci a:</p>
          <a
            href="mailto:treddistudio@gmail.com"
            className="flex items-center gap-2 text-accent text-sm font-semibold hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            treddistudio@gmail.com
          </a>
        </div>

        <div className="text-center text-xs text-muted-foreground space-x-4">
          <Link to="/" className="underline hover:text-foreground">Home</Link>
          <Link to="/support" className="underline hover:text-foreground">Supporto</Link>
          <Link to="/privacy" className="underline hover:text-foreground">Privacy</Link>
        </div>
      </main>
    </div>
  );
}