import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PROMO_CODES = {
  'WANNATRY1': { credits: 30, watermark_only: false },
};

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const promoCode = (body.promo_code || '').toUpperCase().trim();

  const promo = PROMO_CODES[promoCode];
  if (!promo) {
    return Response.json({ success: false, error: 'Codice non valido' });
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
    credits_remaining: promo.credits,
    pack_type: `promo_${promoCode}`,
    watermark_only: promo.watermark_only,
  });

  console.log(`Promo ${promoCode} applied for ${user.email}: ${promo.credits} credits, watermark=${promo.watermark_only}`);
  return Response.json({ success: true, credits: promo.credits });
});