import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const PACK_CONFIGS = {
  starter:    { priceId: 'price_1TEw8kK53QlV9AaGwlQrNyXN', credits: 12 },
  monthly:    { priceId: 'price_1TEw8kK53QlV9AaG5wrJjTnu', credits: 50 },
  semestral:  { priceId: 'price_1TEw8kK53QlV9AaGeB8GFVLz', credits: 350 },
  yearly:     { priceId: 'price_1TEw8kK53QlV9AaGXRTKmi3X', credits: 1000 },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { pack, successUrl, cancelUrl } = await req.json();

    const config = PACK_CONFIGS[pack];
    if (!config) return Response.json({ error: 'Invalid pack' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: config.priceId, quantity: 1 }],
      customer_email: user.email,
      success_url: successUrl || 'https://app.base44.com',
      cancel_url: cancelUrl || 'https://app.base44.com',
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_email: user.email,
        pack,
        credits: String(config.credits),
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('createCheckout error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});