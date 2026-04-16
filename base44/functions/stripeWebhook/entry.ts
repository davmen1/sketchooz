import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
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
    // Idempotency check: try to find by stripe_session_id first
    try {
      const existing = await base44.asServiceRole.entities.RenderPack.filter({ stripe_session_id: stripeSessionId });
      if (existing.length > 0) {
        console.log('Already processed session:', stripeSessionId);
        return new Response('OK');
      }
    } catch (checkErr) {
      console.error('Idempotency check failed:', checkErr.message);
      // Continue anyway — might be a temporary error
    }

    // Fetch and refresh user packs to get latest state
    let userPacks = [];
    try {
      userPacks = await base44.asServiceRole.entities.RenderPack.filter({ user_email });
    } catch (fetchErr) {
      console.error('Failed to fetch user packs:', fetchErr.message);
      return Response.json({ error: 'Retry later' }, { status: 503 });
    }

    const isStarterPack = pack === 'starter';
    const BONUS_CREDITS = 12;
    const bonusCredits = isStarterPack ? 0 : BONUS_CREDITS;
    
    try {
      if (userPacks.length > 0) {
        const existingPack = userPacks[0];
        const creditsToAdd = parseInt(credits) + bonusCredits;
        const newTotal = (existingPack.credits_remaining || 0) + creditsToAdd;

        // Non-starter purchase → upgrade ALL existing packs to non-watermark
        if (!isStarterPack) {
          for (const p of userPacks) {
            if (p.watermark_only) {
              await base44.asServiceRole.entities.RenderPack.update(p.id, { watermark_only: false });
            }
          }
        }

        const updateData = {
          credits_remaining: newTotal,
          stripe_session_id: stripeSessionId,
          pack_type: pack,
          watermark_only: isStarterPack ? (existingPack.watermark_only !== false) : false,
        };

        await base44.asServiceRole.entities.RenderPack.update(existingPack.id, updateData);
        console.log(`✓ Added ${creditsToAdd} credits (incl. ${bonusCredits} bonus) to ${user_email}, total: ${newTotal}`);
      } else {
        // Create new pack
        const newPack = await base44.asServiceRole.entities.RenderPack.create({
          user_email,
          credits_remaining: parseInt(credits) + bonusCredits,
          stripe_session_id: stripeSessionId,
          pack_type: pack,
          watermark_only: isStarterPack,
        });
        console.log(`✓ Created new pack for ${user_email}: ID=${newPack.id}, credits=${parseInt(credits) + bonusCredits} (incl. ${bonusCredits} bonus)`);
      }
    } catch (processErr) {
      console.error(`✗ Failed to process payment for ${user_email}:`, processErr.message);
      // Log full error for debugging
      console.error('Full error:', processErr);
      return Response.json({ error: 'Processing failed' }, { status: 500 });
    }
  }

  return new Response('OK');
});