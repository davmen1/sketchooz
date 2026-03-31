import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const PROMO_CODES = ['WANNATRY1'];
const PROMO_CREDITS = { 'WANNATRY1': 12 };
const PROMO_EXPIRY = new Date('2026-04-23T23:59:59Z');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role === 'admin') {
      return Response.json({ allowed: true, watermark: false });
    }

    const body = await req.json().catch(() => ({}));
    const promoCode = body.promo_code || null;

    // Check if promo code is valid
    const isValidPromo = promoCode && PROMO_CODES.includes(promoCode) && new Date() < PROMO_EXPIRY;

    if (isValidPromo) {
      // Check if user already used this promo code
      const existingPromoUse = await base44.asServiceRole.entities.RenderPack.filter({
        user_email: user.email,
        pack_type: `promo_${promoCode}`,
      });
      if (existingPromoUse.length > 0) {
        console.log(`Promo code ${promoCode} already used by ${user.email}`);
        return Response.json({ allowed: false, watermark: true, reason: 'promo_already_used' });
      }
      // Record promo usage
      await base44.asServiceRole.entities.RenderPack.create({
        user_email: user.email,
        credits_remaining: 0,
        pack_type: `promo_${promoCode}`,
        watermark_only: false,
      });
      console.log(`Valid promo code used: ${promoCode} by ${user.email}`);
      return Response.json({ allowed: true, watermark: false });
    }

    const packs = await base44.asServiceRole.entities.RenderPack.filter({ user_email: user.email });

    // Find a pack with at least 3 credits
    const pack = packs.find(p => (p.credits_remaining || 0) >= 3);
    if (!pack) {
      return Response.json({ allowed: false, watermark: true });
    }

    // Decrement 3 credits per render
    await base44.asServiceRole.entities.RenderPack.update(pack.id, {
      credits_remaining: pack.credits_remaining - 3,
    });

    const watermark = pack.watermark_only === true;
    console.log(`Credit consumed for ${user.email}: remaining=${pack.credits_remaining - 3}, watermark=${watermark}`);
    return Response.json({ allowed: true, watermark });

  } catch (error) {
    console.error('consumeCredit error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});