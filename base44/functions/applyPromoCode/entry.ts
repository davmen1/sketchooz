import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

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

    const body = await req.json().catch(() => ({}));
    const promoCode = (body.promo_code || '').toUpperCase();

    if (!PROMO_CODES.includes(promoCode)) {
      return Response.json({ success: false, error: 'Codice non valido' });
    }

    if (new Date() >= PROMO_EXPIRY) {
      return Response.json({ success: false, error: 'Codice scaduto' });
    }

    // Check if user already used this promo
    const existing = await base44.asServiceRole.entities.RenderPack.filter({
      user_email: user.email,
      pack_type: `promo_${promoCode}`,
    });

    if (existing.length > 0) {
      return Response.json({ success: false, error: 'Codice già utilizzato' });
    }

    await base44.asServiceRole.entities.RenderPack.create({
      user_email: user.email,
      credits_remaining: PROMO_CREDITS[promoCode],
      pack_type: `promo_${promoCode}`,
      watermark_only: false,
    });

    console.log(`Promo ${promoCode} applied for ${user.email}: ${PROMO_CREDITS[promoCode]} credits`);
    return Response.json({ success: true, credits: PROMO_CREDITS[promoCode] });

  } catch (error) {
    console.error('applyPromoCode error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});