import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import MobileHeader from '@/components/MobileHeader';
import PullToRefresh from '@/components/PullToRefresh';
import { useLang } from '@/lib/LangContext';

const PLANS = [
  {
    id: 'trial',
    emoji: '🎯',
    nameIt: 'Trial',
    nameEn: 'Trial',
    priceIt: '€3,99',
    priceEn: '€3.99',
    periodIt: 'acquisto unico',
    periodEn: 'one-time',
    credits: 12,
    highlight: false,
    featuresIt: [
      { ok: true,  text: 'Accesso completo alle funzionalità base' },
      { ok: true,  text: 'Ideale per testare il servizio' },
      { ok: false, text: 'Uso commerciale NON consentito' },
      { ok: false, text: 'Output non utilizzabili a scopo di lucro' },
      { ok: false, text: 'Nessuna priorità di generazione' },
    ],
    featuresEn: [
      { ok: true,  text: 'Full access to basic features' },
      { ok: true,  text: 'Ideal for testing the service' },
      { ok: false, text: 'Commercial use NOT allowed' },
      { ok: false, text: 'Output not usable for profit' },
      { ok: false, text: 'No generation priority' },
    ],
    noteIt: 'Uso strettamente personale e valutativo',
    noteEn: 'Strictly personal and evaluation use',
    color: 'border-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    badgeColor: 'bg-amber-500',
  },
  {
    id: 'starter',
    emoji: '🟢',
    nameIt: 'Starter',
    nameEn: 'Starter',
    priceIt: '€19,99',
    priceEn: '€19.99',
    periodIt: 'acquisto unico',
    periodEn: 'one-time',
    credits: 50,
    highlight: false,
    featuresIt: [
      { ok: true,  text: 'Utilizzo standard' },
      { ok: true,  text: 'Accesso a tutte le funzionalità principali' },
      { ok: true,  text: 'Salvataggio contenuti' },
      { ok: false, text: 'Uso commerciale NON consentito' },
      { ok: false, text: 'Vietato per clienti o attività monetizzate' },
    ],
    featuresEn: [
      { ok: true,  text: 'Standard usage' },
      { ok: true,  text: 'Access to all main features' },
      { ok: true,  text: 'Content saving' },
      { ok: false, text: 'Commercial use NOT allowed' },
      { ok: false, text: 'Forbidden for clients or monetized activities' },
    ],
    noteIt: 'Pensato per uso personale continuativo',
    noteEn: 'Designed for continuous personal use',
    color: 'border-green-400',
    bg: 'bg-card',
    badgeColor: 'bg-green-500',
  },
  {
    id: 'pro',
    emoji: '🔵',
    nameIt: 'Pro',
    nameEn: 'Pro',
    priceIt: '€49,99 / mese',
    priceEn: '€49.99 / mo',
    periodIt: 'rinnovo mensile',
    periodEn: 'monthly renewal',
    credits: 180,
    highlight: true,
    badge: '🔥 PIÙ POPOLARE',
    featuresIt: [
      { ok: true,  text: 'Utilizzo intensivo' },
      { ok: true,  text: 'Generazione più veloce' },
      { ok: true,  text: 'Migliore qualità / priorità base' },
      { ok: true,  text: 'Accesso a feature avanzate' },
      { ok: false, text: 'Uso commerciale NON consentito' },
      { ok: false, text: 'Vietato uso per business o rivendita' },
    ],
    featuresEn: [
      { ok: true,  text: 'Intensive usage' },
      { ok: true,  text: 'Faster generation' },
      { ok: true,  text: 'Better quality / base priority' },
      { ok: true,  text: 'Access to advanced features' },
      { ok: false, text: 'Commercial use NOT allowed' },
      { ok: false, text: 'Forbidden for business or resale' },
    ],
    noteIt: 'Per utenti avanzati, ma NON per lavoro',
    noteEn: 'For advanced users, but NOT for work',
    color: 'border-accent',
    bg: 'bg-card',
    badgeColor: 'bg-accent',
  },
  {
    id: 'enterprise',
    emoji: '🟡',
    nameIt: 'Enterprise',
    nameEn: 'Enterprise',
    priceIt: '€120 / mese',
    priceEn: '€120 / mo',
    periodIt: 'rinnovo mensile',
    periodEn: 'monthly renewal',
    credits: 1200,
    highlight: false,
    badge: '💎 MIGLIOR VALORE',
    featuresIt: [
      { ok: true,  text: 'Utilizzo completo senza limitazioni' },
      { ok: true,  text: 'Priorità alta di generazione' },
      { ok: true,  text: 'Output senza watermark' },
      { ok: true,  text: 'Tutte le funzionalità avanzate' },
      { ok: true,  text: '✅ LICENZA COMMERCIALE INCLUSA' },
      { ok: true,  text: 'Utilizzo per clienti e contenuti monetizzati' },
      { ok: true,  text: 'Diritti di sfruttamento economico sugli output' },
      { ok: true,  text: 'Priorità server e uso professionale continuativo' },
    ],
    featuresEn: [
      { ok: true,  text: 'Full usage without limitations' },
      { ok: true,  text: 'High generation priority' },
      { ok: true,  text: 'Output without watermark' },
      { ok: true,  text: 'All advanced features' },
      { ok: true,  text: '✅ COMMERCIAL LICENSE INCLUDED' },
      { ok: true,  text: 'Use for clients and monetized content' },
      { ok: true,  text: 'Economic exploitation rights on outputs' },
      { ok: true,  text: 'Server priority and continuous professional use' },
    ],
    noteIt: 'Pensato per chi genera valore economico con la piattaforma',
    noteEn: 'Designed for those who generate economic value with the platform',
    color: 'border-yellow-400',
    bg: 'bg-card',
    badgeColor: 'bg-yellow-500',
  },
];

const isIOSWebView = () => {
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const hasWebKit = typeof window !== 'undefined' && !!(window.webkit?.messageHandlers);
  const notSafari = isIOS && !ua.includes('Safari');
  return isIOS && (hasWebKit || notSafari);
};

// Map plan IDs to checkout pack IDs
const CHECKOUT_MAP = {
  trial: 'starter',
  starter: 'monthly',
  pro: 'semestral',
  enterprise: 'yearly',
};

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [iosWebView] = useState(isIOSWebView);
  const [creditsRemaining, setCreditsRemaining] = useState(null);
  const { t, lang } = useLang();
  const it = lang === 'it';

  useEffect(() => {
    base44.entities.RenderPack.filter({}).then(packs => {
      if (packs.length > 0) {
        setCreditsRemaining(packs[0].credits_remaining || 0);
      } else {
        setCreditsRemaining(0);
      }
    }).catch(() => setCreditsRemaining(0));
  }, []);

  const handleCheckout = async (planId) => {
    if (window.self !== window.top) {
      toast.error(t('iframeAlert'));
      return;
    }
    setLoading(planId);
    const packId = CHECKOUT_MAP[planId];
    const successUrl = 'https://www.sketchooz.com/pricing?success=1';
    const cancelUrl = 'https://www.sketchooz.com/pricing';
    const res = await base44.functions.invoke('createCheckout', {
      pack: packId,
      successUrl,
      cancelUrl,
    });
    if (res.data?.url) {
      if (iosWebView) {
        window.open(res.data.url, '_blank');
      } else {
        window.location.href = res.data.url;
      }
    }
    setLoading(null);
  };

  return (
    <div className="flex flex-col flex-1">
      <MobileHeader title={t('pricingTitle')} subtitle={t('pricingSubtitle')} />

      <PullToRefresh onRefresh={() => {}}>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">

          {iosWebView && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-800 dark:text-blue-200 text-center space-y-2">
              <p className="font-semibold">🛒 {it ? 'Acquista su sketchooz.com' : 'Purchase at sketchooz.com'}</p>
              <p className="text-xs">{it ? 'Per acquistare i pack, visita il nostro sito dal browser.' : 'To purchase packs, visit our website from your browser.'}</p>
              <button onClick={() => window.open('https://www.sketchooz.com/pricing', '_blank')} className="mt-1 inline-block bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">
                {it ? 'Vai al sito →' : 'Open website →'}
              </button>
            </div>
          )}

          {creditsRemaining !== null && creditsRemaining > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-800 dark:text-green-200 text-center">
              ✅ {it ? 'Crediti disponibili' : 'Available credits'}: <strong>{creditsRemaining}</strong>
              <span className="ml-2">· {Math.floor(creditsRemaining / 3)} render {it ? 'rimasti' : 'remaining'}</span>
            </div>
          )}

          <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-xs text-center text-accent font-medium">
            🎨 {it ? 'Ogni render consuma 3 crediti. I crediti non scadono mai.' : 'Each render costs 3 credits. Credits never expire.'}
          </div>

          {/* TRIAL — Hero Card full width */}
          {(() => {
            const plan = PLANS[0];
            const features = it ? plan.featuresIt : plan.featuresEn;
            const name = it ? plan.nameIt : plan.nameEn;
            const price = it ? plan.priceIt : plan.priceEn;
            const period = it ? plan.periodIt : plan.periodEn;
            const note = it ? plan.noteIt : plan.noteEn;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                className="relative rounded-2xl border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/30 p-6 w-full shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{plan.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xl text-foreground">{name}</h3>
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">🎯 {it ? 'PROVA SUBITO' : 'TRY NOW'}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{plan.credits} {it ? 'crediti' : 'credits'} · {period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-foreground">{price}</span>
                    <Button
                      onClick={() => handleCheckout(plan.id)}
                      disabled={!!loading}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-6"
                    >
                      {loading === plan.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (it ? 'Inizia ora' : 'Start now')}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-1.5 text-xs text-foreground list-none">
                      {f.ok
                        ? <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                        : <X className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />}
                      {f.text}
                    </li>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground italic mt-3">👉 {note}</p>
              </motion.div>
            );
          })()}

          {/* Commercial use banner */}
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-400 rounded-2xl text-sm">
            <p className="font-bold text-red-700 dark:text-red-400 text-base mb-1">⚖️ {it ? 'USO COMMERCIALE' : 'COMMERCIAL USE'}</p>
            <p className="text-xs text-red-700 dark:text-red-300 font-medium">
              {it
                ? '🚫 Trial, Starter e Pro NON autorizzano l\'uso commerciale. Per clienti, agenzie o contenuti monetizzati è obbligatorio il piano Enterprise.'
                : '🚫 Trial, Starter and Pro do NOT authorize commercial use. For clients, agencies or monetized content, the Enterprise plan is required.'}
            </p>
          </div>

          {/* Other 3 plans grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.slice(1).map((plan, i) => {
              const features = it ? plan.featuresIt : plan.featuresEn;
              const name = it ? plan.nameIt : plan.nameEn;
              const price = it ? plan.priceIt : plan.priceEn;
              const period = it ? plan.periodIt : plan.periodEn;
              const note = it ? plan.noteIt : plan.noteEn;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i + 1) * 0.06 }}
                  className={`relative rounded-2xl border-2 ${plan.color} ${plan.bg} p-5 flex flex-col ${plan.highlight ? 'shadow-lg' : ''}`}
                >
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${plan.badgeColor}`}>
                      {plan.badge}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3 mt-1">
                    <span className="text-xl">{plan.emoji}</span>
                    <div>
                      <h3 className="font-bold text-base text-foreground">{name}</h3>
                      <p className="text-[10px] text-muted-foreground">{plan.credits} {it ? 'crediti' : 'credits'} · {period}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="text-xl font-bold text-foreground">{price}</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 flex-1 mb-4">
                    {features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-1.5 text-xs text-foreground">
                        {f.ok
                          ? <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                          : <X className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />}
                        {f.text}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-muted-foreground italic mb-3">👉 {note}</p>
                  <Button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={!!loading}
                    className={`w-full text-sm ${plan.highlight ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}`}
                    variant={plan.highlight ? 'default' : 'outline'}
                  >
                    {loading === plan.id ? (
                      <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    ) : (it ? 'Acquista' : 'Buy now')}
                  </Button>
                </motion.div>
              );
            })}
          </div>


          {/* Disclaimer */}
          <div className="rounded-xl border border-border bg-muted/50 p-4 space-y-2 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground text-sm">
              {it ? '⚠️ Leggi prima di acquistare' : '⚠️ Please read before purchasing'}
            </p>
            <p>
              {it
                ? 'Sketchooz utilizza intelligenza artificiale generativa. I risultati possono variare e non sono garantiti al 100%.'
                : 'Sketchooz uses generative AI. Results may vary and are not 100% guaranteed.'}
            </p>
            <p>
              {it
                ? '💳 Il rimborso è disponibile esclusivamente per i pack da €14,99 in su, entro 7 giorni dall\'acquisto, e solo in caso di errore tecnico documentato. Per richieste: treddistudio@gmail.com'
                : '💳 Refunds available only for packs from €14.99+, within 7 days of purchase, only for documented technical errors. Contact: treddistudio@gmail.com'}
            </p>
          </div>

          <div className="text-center pb-4">
            <a href="/privacy" className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">Privacy Policy</a>
          </div>

        </main>
      </PullToRefresh>
    </div>
  );
}