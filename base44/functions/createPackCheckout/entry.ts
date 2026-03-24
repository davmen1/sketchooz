import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const PACK_PRICE_ID = 'price_1TEd7wK53QlV9AaGAjMZoiBv';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { successUrl, cancelUrl } = await req.json();

    // Ensure purchasable only once: check existing packs
    const existing = await base44.entities.RenderPack.filter({ user_email: user.email });
    if (existing.length > 0) {
      return Response.json({ error: 'already_purchased' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: PACK_PRICE_ID, quantity: 1 }],
      customer_email: user.email,
      success_url: successUrl || 'https://app.base44.com',
      cancel_url: cancelUrl || 'https://app.base44.com',
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_email: user.email,
        plan: 'starter_pack',
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('createPackCheckout error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});