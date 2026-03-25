import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { successUrl, cancelUrl } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'SketchForge — Correzione Design',
            description: 'Rigenera lo sketch con le tue correzioni specifiche',
          },
          unit_amount: 99, // €0,99
        },
        quantity: 1,
      }],
      customer_email: user.email,
      success_url: successUrl || 'https://app.base44.com',
      cancel_url: cancelUrl || 'https://app.base44.com',
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_email: user.email,
        type: 'correction',
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('createCorrectionCheckout error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
});