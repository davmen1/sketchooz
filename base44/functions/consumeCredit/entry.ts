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

    // Find a pack with at least 3 credits
    const pack = packs.find(p => (p.credits_remaining || 0) >= 3);
    if (!pack) {
      return Response.json({ allowed: false, watermark: true });
    }

    // Decrement 3 credits per render
    await base44.asServiceRole.entities.RenderPack.update(pack.id, {
      credits_remaining: pack.credits_remaining - 3,
    });

    // Watermark is determined solely by the pack's watermark_only field — no frontend bypass possible
    const watermark = pack.watermark_only === true;
    console.log(`Credit consumed for ${user.email}: remaining=${pack.credits_remaining - 3}, watermark=${watermark}`);
    return Response.json({ allowed: true, watermark });

  } catch (error) {
    console.error('consumeCredit error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});