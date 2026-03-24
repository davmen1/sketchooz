import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const subs = await base44.entities.Subscription.filter({ user_email: user.email });
    const active = subs.find(s => s.status === 'active');
    return Response.json({ subscription: active || null });
  } catch (err) {
    console.error('getSubscription error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});