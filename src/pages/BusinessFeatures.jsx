import { motion } from 'framer-motion';
import { Zap, Shield, Award, Globe, ArrowUpRight, Layers, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileHeader from '@/components/MobileHeader';
import { useLang } from '@/lib/LangContext';

const FEATURES = {
  it: [
    {
      icon: Zap,
      title: 'Generazione prioritaria',
      desc: 'Accesso a server dedicati con elaborazione accelerata per professionisti ad alto volume.',
    },
    {
      icon: Shield,
      title: 'Output senza watermark',
      desc: 'Sketch puliti pronti per la consegna al cliente, senza sovrapposizioni di marchio.',
    },
    {
      icon: Award,
      title: 'Licenza per uso professionale',
      desc: 'Diritti di utilizzo estesi per agenzie, studi di design e contenuti destinati ai clienti.',
    },
    {
      icon: Layers,
      title: 'Volumi elevati',
      desc: 'Soluzioni pensate per chi genera grandi quantità di sketch in modo continuativo.',
    },
    {
      icon: Star,
      title: 'Qualità avanzata',
      desc: 'Accesso alle modalità di rendering più sofisticate, con controllo fine sui parametri grafici.',
    },
    {
      icon: Globe,
      title: 'Supporto dedicato',
      desc: 'Canale prioritario per assistenza tecnica e onboarding per team professionali.',
    },
  ],
  en: [
    {
      icon: Zap,
      title: 'Priority generation',
      desc: 'Access dedicated servers with accelerated processing for high-volume professionals.',
    },
    {
      icon: Shield,
      title: 'Watermark-free output',
      desc: 'Clean sketches ready for client delivery, without any brand overlays.',
    },
    {
      icon: Award,
      title: 'Professional use license',
      desc: 'Extended usage rights for agencies, design studios and client-facing content.',
    },
    {
      icon: Layers,
      title: 'High volume',
      desc: 'Solutions built for those who generate large quantities of sketches on a continuous basis.',
    },
    {
      icon: Star,
      title: 'Advanced quality',
      desc: 'Access the most sophisticated rendering modes with fine control over graphic parameters.',
    },
    {
      icon: Globe,
      title: 'Dedicated support',
      desc: 'Priority channel for technical assistance and onboarding for professional teams.',
    },
  ],
};

export default function BusinessFeatures() {
  const { lang } = useLang();
  const it = lang === 'it';
  const features = FEATURES[lang];

  return (
    <div className="flex flex-col flex-1">
      <MobileHeader
        title={it ? 'Soluzioni Professionali' : 'Professional Solutions'}
        subtitle={it ? 'Per agenzie e studi di design' : 'For agencies and design studios'}
      />

      <main className="max-w-2xl mx-auto px-4 py-6 w-full space-y-6">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-accent/10 border border-accent/20 p-6 text-center space-y-3"
        >
          <p className="text-2xl">✦</p>
          <h2 className="font-bold text-xl text-foreground">
            {it ? 'Sketchooz per i professionisti' : 'Sketchooz for professionals'}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {it
              ? 'Porta la generazione di sketch AI al livello successivo. Funzionalità avanzate studiate per chi lavora con clienti e produce contenuti di design in modo continuativo.'
              : 'Take AI sketch generation to the next level. Advanced features designed for those who work with clients and produce design content on a continuous basis.'}
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-4 flex gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-border bg-card p-6 text-center space-y-4"
        >
          <p className="font-semibold text-foreground">
            {it ? 'Vuoi saperne di più?' : 'Want to learn more?'}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {it
              ? 'Tutte le informazioni sulle soluzioni avanzate, i piani disponibili e le condizioni d\'uso sono disponibili sul nostro sito web.'
              : 'All information about advanced solutions, available plans and usage terms is available on our website.'}
          </p>
          <Button
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl w-full"
            onClick={() => window.open('https://www.sketchooz.com/pricing', '_blank')}
          >
            {it ? 'Scopri di più su sketchooz.com' : 'Learn more at sketchooz.com'}
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Note */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          {it
            ? 'Le funzionalità avanzate sono accessibili tramite il sito web sketchooz.com'
            : 'Advanced features are accessible through the sketchooz.com website'}
        </p>

      </main>
    </div>
  );
}