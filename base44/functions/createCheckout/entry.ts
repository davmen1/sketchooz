import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const PRICE_IDS = {
  monthly: 'price_1TEcKiGZjmfYQdyYy4RtZgSZ',
  semestral: 'price_1TEcKiGZjmfYQdyYRywEYxz1',
  yearly: 'price_1TEcKiGZjmfYQdyY94H6UIOK',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { plan, successUrl, cancelUrl } = await req.json();

    if (!PRICE_IDS[plan]) return Response.json({ error: 'Invalid plan' }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      customer_email: user.email,
      success_url: successUrl || 'https://app.base44.com',
      cancel_url: cancelUrl || 'https://app.base44.com',
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_email: user.email,
        plan,
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('createCheckout error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});