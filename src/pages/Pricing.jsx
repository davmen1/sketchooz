import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import MobileHeader from '@/components/MobileHeader';
import { useLang } from '@/lib/LangContext';

const PLAN_CONFIGS = [
  { id: 'monthly', price: '€14,99', icon: Zap, color: 'border-border', translationKey: 'planMonthly' },
  { id: 'semestral', price: '€75', icon: Sparkles, color: 'border-accent', highlight: true, translationKey: 'planSemestral' },
  { id: 'yearly', price: '€100', icon: Crown, color: 'border-border', translationKey: 'planYearly' },
];

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [hasPack, setHasPack] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    base44.functions.invoke('getSubscription', {}).then(r => {
      setSubscription(r.data?.subscription || null);
    }).catch(() => {});
    base44.entities.RenderPack.filter({}).then(packs => {
      setHasPack(packs.length > 0);
    }).catch(() => {});
  }, []);

  const handlePackCheckout = async () => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      alert(t('iframeAlert'));
      return;
    }
    setLoading('starter_pack');
    const currentUrl = window.location.href;
    const res = await base44.functions.invoke('createPackCheckout', {
      successUrl: currentUrl + '?success=1',
      cancelUrl: currentUrl,
    });
    if (res.data?.error === 'already_purchased') {
      alert(t('alreadyPurchasedAlert'));
      setLoading(null);
      return;
    }
    const { url } = res.data;
    if (url) window.location.href = url;
    setLoading(null);
  };

  const handleCheckout = async (planId) => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      alert(t('iframeAlert'));
      return;
    }
    setLoading(planId);
    const currentUrl = window.location.href;
    const res = await base44.functions.invoke('createCheckout', {
      plan: planId,
      successUrl: currentUrl + '?success=1',
      cancelUrl: currentUrl,
    });
    const { url } = res.data;
    if (url) window.location.href = url;
    setLoading(null);
  };

  return (
    <div className="flex flex-col flex-1">
      <MobileHeader title={t('pricingTitle')} subtitle={t('pricingSubtitle')} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Free tier notice */}
        <div className="mb-8 p-4 bg-muted rounded-xl text-sm text-muted-foreground text-center">
          {t('freeTierDesc')}
        </div>

        {subscription && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 text-center">
            ✅ {t('subscriptionActive')}: <strong className="capitalize">{subscription.plan}</strong>
            {subscription.current_period_end && (
              <span className="ml-2 text-green-600">
                · {t('expiresOn')} {new Date(subscription.current_period_end).toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {/* Starter Pack promo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5"
        >
          <div className="absolute -top-3 left-6 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">{t('oneTimeOfferBadge')}</div>
          <div className="p-3 rounded-xl bg-amber-100 shrink-0">
            <Gift className="w-7 h-7 text-amber-600" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-lg text-amber-900">{t('starterPackTitle')}</h3>
            <p className="text-sm text-amber-700 mt-0.5">{t('starterPackDesc')}</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {t('starterPackFeatures').map(f => (
                <li key={f} className="flex items-center gap-1 text-xs text-amber-800">
                  <Check className="w-3.5 h-3.5 text-green-600" />{f}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <span className="text-3xl font-bold text-amber-900">€2,99</span>
            <Button
              onClick={handlePackCheckout}
              disabled={!!loading || hasPack}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6"
            >
              {loading === 'starter_pack' ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : hasPack ? t('alreadyPurchased') : t('buyNow')}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLAN_CONFIGS.map((plan, i) => {
            const Icon = plan.icon;
            const planT = t(plan.translationKey);
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-card rounded-2xl border-2 ${plan.color} p-6 flex flex-col ${plan.highlight ? 'shadow-lg' : ''}`}
              >
                {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {t('mostPopular')}
                </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${plan.highlight ? 'bg-accent/10' : 'bg-muted'}`}>
                    <Icon className={`w-5 h-5 ${plan.highlight ? 'text-accent' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{planT.name}</h3>
                    {planT.savings && (
                      <span className="text-[11px] text-green-600 font-medium">{planT.savings}</span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-1">{planT.period}</span>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {planT.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout(plan.id)}
                  disabled={!!loading || subscription?.status === 'active'}
                  className={`w-full ${plan.highlight ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}`}
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  {loading === plan.id ? (
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : subscription?.status === 'active' ? t('subscribed') : t('subscribeNow')}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}