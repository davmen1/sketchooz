import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, Deno.env.get('STRIPE_WEBHOOK_SECRET'));
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return new Response('Webhook Error', { status: 400 });
  }

  const base44 = createClientFromRequest(req);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { user_email, plan } = session.metadata || {};
    if (!user_email || !plan) return new Response('OK');

    const subscriptionId = session.subscription;
    const customerId = session.customer;

    let periodEnd = null;
    if (subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      periodEnd = new Date(sub.current_period_end * 1000).toISOString();
    }

    // Upsert: delete existing then create fresh
    const existing = await base44.asServiceRole.entities.Subscription.filter({ user_email });
    for (const s of existing) {
      await base44.asServiceRole.entities.Subscription.delete(s.id);
    }

    await base44.asServiceRole.entities.Subscription.create({
      user_email,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      plan,
      status: 'active',
      current_period_end: periodEnd,
    });

    console.log(`Subscription created for ${user_email} - plan: ${plan}`);
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
    const sub = event.data.object;
    const customerId = sub.customer;
    const existing = await base44.asServiceRole.entities.Subscription.filter({ stripe_customer_id: customerId });
    for (const s of existing) {
      await base44.asServiceRole.entities.Subscription.update(s.id, {
        status: sub.status,
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      });
    }
    console.log(`Subscription updated for customer ${customerId}: ${sub.status}`);
  }

  return new Response('OK');
});