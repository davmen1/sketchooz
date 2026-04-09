import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role === 'admin') {
      return Response.json({ status: 'admin', created: false });
    }

    // Check if user already has any pack
    const existing = await base44.asServiceRole.entities.RenderPack.filter({ user_email: user.email });
    if (existing.length > 0) {
      return Response.json({ status: 'exists', created: false });
    }

    // Create free trial pack with 30 watermark credits
    await base44.asServiceRole.entities.RenderPack.create({
      user_email: user.email,
      credits_remaining: 30,
      pack_type: 'free_trial',
      watermark_only: true,
    });

    console.log('Free trial pack created for', user.email);
    return Response.json({ status: 'created', created: true });
  } catch (error) {
    console.error('initFreeTrial error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});