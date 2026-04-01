import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, Users, Cpu } from 'lucide-react';

const sections = [
  {
    icon: Users,
    title: 'Pubblico di riferimento',
    content:
      'Sketchooz è uno strumento semi-professionale e professionale progettato per designer industriali, studenti di design, agenzie creative e professionisti del settore. L\'app è destinata a un pubblico adulto di età pari o superiore ai 16 anni.',
  },
  {
    icon: Cpu,
    title: 'Natura dei contenuti generati dall\'AI',
    content:
      'Sketchooz utilizza tecnologia di intelligenza artificiale generativa per produrre sketch e render di design industriale. Sebbene il sistema sia ottimizzato e vincolato alla produzione di contenuti tecnici e professionali, l\'AI, per sua natura, può occasionalmente generare rappresentazioni visive inaspettate o non volute. Tali risultati non sono intenzionali e non rientrano nell\'obiettivo dell\'app, ma non possono essere garantiti con assoluta certezza.',
  },
  {
    icon: AlertTriangle,
    title: 'Avviso per i minori',
    content:
      'Pur non contenendo contenuti sensibili, violenti, espliciti o vietati ai minori di natura intenzionale, la presenza di AI generativa rende l\'app non adatta a utenti al di sotto dei 16 anni. I genitori e i tutori sono invitati a tenere in considerazione questa indicazione prima di consentire l\'utilizzo ai minori.',
  },
  {
    icon: ShieldCheck,
    title: 'Impegno per la sicurezza',
    content:
      'Non sono presenti funzionalità di condivisione social, chat con utenti esterni, navigazione web non filtrata o contenuti forniti da terzi non verificati. Tutti i contenuti generati rimangono nel dispositivo dell\'utente e non vengono condivisi pubblicamente in modo automatico.',
  },
];

export default function AgeRating() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-6 py-4 flex items-center gap-3" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <Link to="/" className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69c0940be94e736c4d6366a0/0c4fb1e10_Gemini_Generated_Image_p24ieqp24ieqp24i1.jpg" alt="Sketchooz" className="h-8 w-8 rounded-md object-cover" />
          <span className="font-bold tracking-widest text-sm uppercase">Sketchooz</span>
        </Link>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Età consigliata: 16+
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Adeguatezza dell'età e contenuti AI</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Informativa sulla natura dell'app, sul pubblico di riferimento e sull'utilizzo dell'intelligenza artificiale generativa.
            </p>
          </div>

          <div className="space-y-4">
            {sections.map(({ icon: Icon, title, content }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl p-5 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <h2 className="font-semibold text-sm">{title}</h2>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{content}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Ultimo aggiornamento: Aprile 2025 · <Link to="/" className="underline underline-offset-2 hover:text-foreground">Torna alla home</Link>
          </p>
        </motion.div>
      </main>

      <footer className="border-t border-border px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>© 2025 Treddi Studio — sketchooz.com</span>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-foreground underline underline-offset-2">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-foreground underline underline-offset-2">Termini e Condizioni</Link>
          <Link to="/age-rating" className="hover:text-foreground underline underline-offset-2">Adeguatezza dell'età</Link>
        </div>
      </footer>
    </div>
  );
}