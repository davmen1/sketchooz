import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

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

    const packs = await base44.asServiceRole.entities.RenderPack.filter({ user_email: user.email });

    const hasPaidPack = packs.some(p => p.watermark_only === false);

    // Check promo from request body
    const body = await req.json().catch(() => ({}));
    const promoCode = body.promo_code || null;
    const PROMO_CODES = ['WANNATRY1', 'PROVA2026'];
    const PROMO_EXPIRY = new Date('2026-04-23T23:59:59Z');
    const hasValidPromo = promoCode && PROMO_CODES.includes(promoCode) && new Date() < PROMO_EXPIRY;

    const isPremium = hasPaidPack || hasValidPromo;

    // NOTE: do NOT permanently upgrade free_trial packs — watermark_only is determined per-render

    // Find a pack with at least 3 credits
    const pack = packs.find(p => (p.credits_remaining || 0) >= 3);
    if (!pack) {
      return Response.json({ allowed: false, watermark: true });
    }

    // Decrement 3 credits per render
    await base44.asServiceRole.entities.RenderPack.update(pack.id, {
      credits_remaining: pack.credits_remaining - 3,
    });

    const watermark = !hasPaidPack; // watermark removed only for paid packs, not promo
    console.log(`Credit consumed for ${user.email}: remaining=${pack.credits_remaining - 1}, watermark=${watermark}`);
    return Response.json({ allowed: true, watermark });

  } catch (error) {
    console.error('consumeCredit error:', error.message);
    // Fail safe: block the render rather than allow free unlimited renders
    return Response.json({ error: error.message }, { status: 500 });
  }
});