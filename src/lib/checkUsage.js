import { base44 } from '@/api/base44Client';

export const PROMO_CODES = ['WANNATRY1'];
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
    if (used < 2) {
      localStorage.setItem('promo_renders_used', String(used + 1));
      if (setPromoRendersUsed) setPromoRendersUsed(used + 1);
      return { allowed: true };
    }
    return { allowed: false };
  }

  const packs = await base44.entities.RenderPack.filter({ user_email: user.email });
  const pack = packs.find(p => (p.credits_remaining || 0) >= 3);
  if (pack) {
    await base44.entities.RenderPack.update(pack.id, { credits_remaining: pack.credits_remaining - 3 });
    return { allowed: true, watermark: !!pack.watermark_only };
  }
  // No pack found — give 15 free trial credits with watermark
  if (packs.length === 0) {
    const freePack = await base44.entities.RenderPack.create({
      user_email: user.email,
      credits_remaining: 15 - 3,
      pack_type: 'free_trial',
      watermark_only: true,
    });
    console.log('Created free trial pack for', user.email);
    return { allowed: true, watermark: true };
  }
  return { allowed: false };
}