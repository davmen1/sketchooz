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

  if (hasPromo()) {
    const used = parseInt(localStorage.getItem('promo_renders_used') || '0', 10);
    const code = localStorage.getItem('promo_code');
    const limit = PROMO_LIMITS[code] || 2;
    if (used < limit) {
      localStorage.setItem('promo_renders_used', String(used + 1));
      if (setPromoRendersUsed) setPromoRendersUsed(used + 1);
      return { allowed: true };
    }
    return { allowed: false };
  }

  const packs = await base44.entities.RenderPack.filter({ user_email: user.email });
  // Prefer non-watermark packs first so paid credits are used before free trial
  const sorted = [...packs].sort((a, b) => (a.watermark_only ? 1 : 0) - (b.watermark_only ? 1 : 0));
  const pack = sorted.find(p => (p.credits_remaining || 0) > 0);
  if (pack) {
    await base44.entities.RenderPack.update(pack.id, { credits_remaining: pack.credits_remaining - 1 });
    return { allowed: true, watermark: !!pack.watermark_only };
  }
  return { allowed: false };
}