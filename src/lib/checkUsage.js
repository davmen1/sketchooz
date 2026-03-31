import { base44 } from '@/api/base44Client';

export const PROMO_CODES = ['WANNATRY1', 'PROVA2026'];
const PROMO_LIMITS = { 'WANNATRY1': 55, 'PROVA2026': 2 };
export const PROMO_EXPIRY = new Date('2026-04-23T23:59:59Z');

export function hasPromo() {
  const code = localStorage.getItem('promo_code');
  return PROMO_CODES.includes(code) && new Date() < PROMO_EXPIRY;
}

export async function checkAndIncrementUsage(setPromoRendersUsed) {
  const user = await base44.auth.me();
  if (user.role === 'admin') return { allowed: true };

  const packs = await base44.entities.RenderPack.filter({ user_email: user.email });

  // User is premium if they have any paid (non-watermark) pack OR an active promo code
  const hasPaidPack = packs.some(p => !p.watermark_only);
  const isPremium = hasPaidPack || hasPromo();

  // If premium, upgrade ALL remaining watermark packs to non-watermark
  if (isPremium) {
    for (const p of packs.filter(p => p.watermark_only)) {
      await base44.entities.RenderPack.update(p.id, { watermark_only: false });
      p.watermark_only = false;
    }
  }

  // Handle promo credits first
  if (hasPromo()) {
    const used = parseInt(localStorage.getItem('promo_renders_used') || '0', 10);
    const code = localStorage.getItem('promo_code');
    const limit = PROMO_LIMITS[code] || 2;
    if (used < limit) {
      localStorage.setItem('promo_renders_used', String(used + 1));
      if (setPromoRendersUsed) setPromoRendersUsed(used + 1);
      return { allowed: true, watermark: false };
    }
  }

  const pack = packs.find(p => (p.credits_remaining || 0) > 0);
  if (pack) {
    await base44.entities.RenderPack.update(pack.id, { credits_remaining: pack.credits_remaining - 1 });
    return { allowed: true, watermark: isPremium ? false : !!pack.watermark_only };
  }

  return { allowed: false };
}