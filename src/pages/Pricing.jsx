import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, Crown, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import MobileHeader from '@/components/MobileHeader';
import PullToRefresh from '@/components/PullToRefresh';
import { useLang } from '@/lib/LangContext';

const PACK_CONFIGS = [
  {
    id: 'starter',
    price: '€3,99',
    credits: 12,
    icon: Gift,
    color: 'border-amber-300',
    bg: 'bg-amber-50',
    badge: '🎁 PROVA',
    highlight: false,
  },
  {
    id: 'monthly',
    price: '€14,99',
    credits: 50,
    icon: Zap,
    color: 'border-border',
    highlight: false,
  },
  {
    id: 'semestral',
    price: '€69,99',
    credits: 350,
    icon: Sparkles,
    color: 'border-accent',
    highlight: true,
    badge: '🔥 PIÙ POPOLARE',
  },
  {
    id: 'yearly',
    price: '€119,99',
    credits: 1000,
    icon: Crown,
    color: 'border-border',
    highlight: false,
    badge: '💎 MIGLIOR VALORE',
  },
];

const isIOSWebView = () => {
  const ua = navigator.userAgent || '';
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const hasWebKit = typeof window !== 'undefined' && !!(window.webkit?.messageHandlers);
  const notSafari = isIOS && !ua.includes('Safari');
  return isIOS && (hasWebKit || notSafari);
};

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [iosWebView] = useState(isIOSWebView);
  const [creditsRemaining, setCreditsRemaining] = useState(null);
  const { t, lang } = useLang();

  useEffect(() => {
    base44.entities.RenderPack.filter({}).then(packs => {
      if (packs.length > 0) {
        setCreditsRemaining(packs[0].credits_remaining || 0);
      } else {
        setCreditsRemaining(0);
      }
    }).catch(() => setCreditsRemaining(0));
  }, []);

  const handleCheckout = async (packId) => {
    if (window.self !== window.top) {
      toast.error(t('iframeAlert'));
      return;
    }
    setLoading(packId);
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

  const getCostPerRender = (credits) => `${(credits / 3).toFixed(0)} render`;
  const getPricePerRender = (price, credits) => {
    const num = parseFloat(price.replace('€', '').replace(',', '.'));
    return `€${(num / (credits / 3)).toFixed(2)}/render`;
  };

  const packLabels = {
    starter:   lang === 'it' ? { name: 'Starter',   period: 'una tantum', features: ['12 crediti = 4 render', 'Nessun watermark', 'Tutti gli stili', 'I crediti non scadono'] } : { name: 'Starter', period: 'one-time', features: ['12 credits = 4 renders', 'No watermark', 'All styles', 'Credits never expire'] },
    monthly:   lang === 'it' ? { name: 'Mese',      period: 'una tantum', features: ['50 crediti = ~16 render', 'Nessun watermark', 'Tutti gli stili', 'I crediti non scadono'] } : { name: 'Month',   period: 'one-time', features: ['50 credits = ~16 renders', 'No watermark', 'All styles', 'Credits never expire'] },
    semestral: lang === 'it' ? { name: 'Semestre',  period: 'una tantum', features: ['350 crediti = ~116 render', 'Nessun watermark', 'Tutti gli stili', 'I crediti non scadono', 'Risparmio del 40%'] } : { name: 'Semester', period: 'one-time', features: ['350 credits = ~116 renders', 'No watermark', 'All styles', 'Credits never expire', '40% savings'] },
    yearly:    lang === 'it' ? { name: 'Annuale',   period: 'una tantum', features: ['1000 crediti = ~333 render', 'Nessun watermark', 'Tutti gli stili', 'I crediti non scadono', 'Risparmio del 60%'] } : { name: 'Annual',   period: 'one-time', features: ['1000 credits = ~333 renders', 'No watermark', 'All styles', 'Credits never expire', '60% savings'] },
  };

  return (
    <div className="flex flex-col flex-1">
      <MobileHeader title={t('pricingTitle')} subtitle={t('pricingSubtitle')} />

      <PullToRefresh onRefresh={() => { /* refresh handler */ }}>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">

          {iosWebView && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 text-center space-y-2">
              <p className="font-semibold">🛒 {lang === 'it' ? 'Acquista su sketchooz.com' : 'Purchase at sketchooz.com'}</p>
              <p className="text-xs text-blue-700">{lang === 'it' ? 'Per acquistare i pack, visita il nostro sito dal browser.' : 'To purchase packs, visit our website from your browser.'}</p>
              <button
                onClick={() => window.open('https://www.sketchooz.com/pricing', '_blank')}
                className="mt-1 inline-block bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                {lang === 'it' ? 'Vai al sito →' : 'Open website →'}
              </button>
            </div>
          )}

          {creditsRemaining !== null && creditsRemaining > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 text-center">
              ✅ {lang === 'it' ? 'Crediti disponibili' : 'Available credits'}: <strong>{creditsRemaining}</strong>
              <span className="text-green-600 ml-2">· {Math.floor(creditsRemaining / 3)} render {lang === 'it' ? 'rimasti' : 'remaining'}</span>
            </div>
          )}

          {/* Cost info banner */}
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-xs text-center text-accent font-medium">
            🎨 {lang === 'it' ? 'Ogni render consuma 3 crediti. I crediti non scadono mai.' : 'Each render costs 3 credits. Credits never expire.'}
          </div>

          {/* Starter pack — featured hero */}
          {(() => {
            const pack = PACK_CONFIGS[0];
            const labels = packLabels[pack.id];
            const Icon = pack.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 sm:p-8"
              >
                <div className="absolute -top-3.5 left-6 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                  🎁 {lang === 'it' ? 'INIZIA QUI — ACQUISTO UNICO' : 'START HERE — ONE-TIME PURCHASE'}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2.5 rounded-xl bg-amber-100">
                        <Icon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{labels.name}</h3>
                        <p className="text-xs text-muted-foreground">{getPricePerRender(pack.price, pack.credits)}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-bold">{pack.price}</span>
                      <span className="text-sm text-muted-foreground font-medium">{lang === 'it' ? 'pagamento unico' : 'one-time'}</span>
                    </div>
                    <div className="text-sm text-accent font-semibold mb-4">{pack.credits} crediti · {getCostPerRender(pack.credits)}</div>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1">
                      {labels.features.map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-xs">
                          <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col items-stretch sm:items-end gap-2 sm:min-w-[160px]">
                    <Button
                      onClick={() => handleCheckout(pack.id)}
                      disabled={!!loading}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 h-auto text-base rounded-xl"
                    >
                      {loading === pack.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (lang === 'it' ? 'Acquista ora' : 'Buy now')}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground">{lang === 'it' ? 'Nessun abbonamento' : 'No subscription'}</p>
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {/* Other packs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PACK_CONFIGS.slice(1).map((pack, i) => {
              const Icon = pack.icon;
              const labels = packLabels[pack.id];
              return (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative bg-card rounded-2xl border-2 ${pack.color} p-5 flex flex-col ${pack.highlight ? 'shadow-lg' : ''}`}
                >
                  {pack.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${pack.highlight ? 'bg-accent' : 'bg-amber-500'}`}>
                      {pack.badge}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4 mt-1">
                    <div className={`p-2 rounded-lg ${pack.highlight ? 'bg-accent/10' : 'bg-muted'}`}>
                      <Icon className={`w-4 h-4 ${pack.highlight ? 'text-accent' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{labels.name}</h3>
                      <p className="text-[10px] text-muted-foreground">{getPricePerRender(pack.price, pack.credits)}</p>
                    </div>
                  </div>

                  <div className="mb-1">
                    <span className="text-2xl font-bold">{pack.price}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">{lang === 'it' ? 'acquisto unico' : 'one-time purchase'}</div>
                  <div className="text-xs text-accent font-semibold mb-4">{pack.credits} crediti · {getCostPerRender(pack.credits)}</div>

                  <ul className="space-y-1.5 flex-1 mb-4">
                    {labels.features.map(f => (
                      <li key={f} className="flex items-start gap-1.5 text-xs">
                        <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleCheckout(pack.id)}
                    disabled={!!loading}
                    className={`w-full text-sm ${pack.highlight ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}`}
                    variant={pack.highlight ? 'default' : 'outline'}
                  >
                    {loading === pack.id ? (
                      <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    ) : (lang === 'it' ? 'Acquista' : 'Buy now')}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <div className="rounded-xl border border-border bg-muted/50 p-4 space-y-2 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground text-sm">
              {lang === 'it' ? '⚠️ Leggi prima di acquistare' : '⚠️ Please read before purchasing'}
            </p>
            <p>
              {lang === 'it'
                ? 'Sketchooz utilizza intelligenza artificiale generativa. I risultati possono variare e non sono garantiti al 100%: la fedeltà al prodotto originale dipende dalla complessità dell\'oggetto e dalle impostazioni scelte.'
                : 'Sketchooz uses generative AI. Results may vary and are not 100% guaranteed — fidelity to the original product depends on object complexity and chosen settings.'}
            </p>
            <p>
              {lang === 'it'
                ? '💳 Il rimborso è disponibile esclusivamente per i pack da €14,99 in su (Mese, Semestre, Annuale), entro 7 giorni dall\'acquisto, e solo nei casi in cui il servizio non abbia funzionato correttamente (errore tecnico documentato). Il pack Starter (€3,99) non è rimborsabile. Per richieste contatta treddistudio@gmail.com.'
                : '💳 Refunds are available only for packs starting from €14.99 (Month, Semester, Annual), within 7 days of purchase, and only if the service did not work correctly (documented technical error). The Starter pack (€3.99) is non-refundable. For requests contact treddistudio@gmail.com.'}
            </p>
          </div>

          <div className="text-center pb-4">
            <a href="/privacy" className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
              {lang === 'it' ? 'Privacy Policy' : 'Privacy Policy'}
            </a>
          </div>

        </main>
      </PullToRefresh>
    </div>
  );
}