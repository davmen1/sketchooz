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
    const { user_email, pack, credits } = session.metadata || {};
    if (!user_email || !pack || !credits) {
      console.log('Missing metadata, skipping:', session.metadata);
      return new Response('OK');
    }

    const stripeSessionId = session.id;
    // Idempotency check
    const existing = await base44.asServiceRole.entities.RenderPack.filter({ stripe_session_id: stripeSessionId });
    if (existing.length > 0) {
      console.log('Already processed session:', stripeSessionId);
      return new Response('OK');
    }

    // Find existing pack for user and add credits, or create new
    const userPacks = await base44.asServiceRole.entities.RenderPack.filter({ user_email });
    const isStarterPack = pack === 'starter';
    if (userPacks.length > 0) {
      const existingPack = userPacks[0];
      const updateData = {
        credits_remaining: (existingPack.credits_remaining || 0) + parseInt(credits),
        stripe_session_id: stripeSessionId,
        pack_type: pack,
      };
      // Only set watermark_only if the existing pack doesn't already have paid credits
      // i.e. keep watermark_only: false if user previously bought a non-starter pack
      if (isStarterPack && existingPack.watermark_only !== false) {
        updateData.watermark_only = true;
      } else if (!isStarterPack) {
        updateData.watermark_only = false;
      }
      await base44.asServiceRole.entities.RenderPack.update(existingPack.id, updateData);
      console.log(`Added ${credits} credits to ${user_email}, total: ${(existingPack.credits_remaining || 0) + parseInt(credits)}`);
    } else {
      await base44.asServiceRole.entities.RenderPack.create({
        user_email,
        credits_remaining: parseInt(credits),
        stripe_session_id: stripeSessionId,
        pack_type: pack,
        watermark_only: isStarterPack,
      });
      console.log(`Created pack for ${user_email} with ${credits} credits, watermark_only: ${isStarterPack}`);
    }
  }

  return new Response('OK');
});