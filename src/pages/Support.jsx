import { Link } from 'react-router-dom';
import { Mail, Clock, MessageCircle, ArrowLeft } from 'lucide-react';

export default function Support() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-6 py-4 flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="font-semibold text-sm">Supporto</span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-14 flex-1 space-y-10">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
            <MessageCircle className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-3xl font-bold">Centro Supporto</h1>
          <p className="text-muted-foreground">Siamo qui per aiutarti con qualsiasi problema tu abbia con Sketchooz.</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Contattaci via email</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Per assistenza tecnica, problemi con i crediti, contestazioni sui render o richieste di rimborso, 
            scrivi direttamente al nostro team. Garantiamo risposta entro <strong>48 ore lavorative</strong>.
          </p>
          <a
            href="mailto:treddistudio@gmail.com"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors text-accent font-semibold text-sm"
          >
            <Mail className="w-4 h-4" />
            treddistudio@gmail.com
          </a>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>Risposta garantita entro 48 ore</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Domande frequenti</h2>
          <div className="space-y-4 text-sm">
            {[
              { q: 'Come funzionano i crediti?', a: 'Ogni render consuma 1 credito. I crediti non scadono e puoi acquistarne altri dalla pagina Prezzi.' },
              { q: 'Posso richiedere un rimborso?', a: 'Sì, entro 7 giorni dall\'acquisto se il servizio non ha funzionato correttamente. Scrivici con la tua email e il pack acquistato.' },
              { q: 'Posso usare le immagini generate commercialmente?', a: 'L\'uso commerciale è disponibile con i pack a pagamento. Consulta i nostri Termini e Condizioni per i dettagli.' },
              { q: 'Il render non corrisponde al mio prodotto, cosa faccio?', a: 'Usa la funzione "Correzioni" per specificare cosa migliorare, oppure contattaci e valuteremo crediti aggiuntivi.' },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <p className="font-semibold mb-1">{q}</p>
                <p className="text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground space-x-4">
          <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
          <Link to="/terms" className="underline hover:text-foreground">Termini e Condizioni</Link>
        </div>
      </main>
    </div>
  );
}