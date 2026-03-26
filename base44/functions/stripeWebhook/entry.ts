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
    
    try {
      if (userPacks.length > 0) {
        // Update existing pack with latest data
        const existingPack = userPacks[0];
        const creditsToAdd = parseInt(credits);
        const newTotal = (existingPack.credits_remaining || 0) + creditsToAdd;
        
        const updateData = {
          credits_remaining: newTotal,
          stripe_session_id: stripeSessionId,
          pack_type: pack,
        };
        
        if (isStarterPack && existingPack.watermark_only !== false) {
          updateData.watermark_only = true;
        } else if (!isStarterPack) {
          updateData.watermark_only = false;
        }
        
        await base44.asServiceRole.entities.RenderPack.update(existingPack.id, updateData);
        console.log(`✓ Added ${creditsToAdd} credits to ${user_email}, total: ${newTotal}`);
      } else {
        // Create new pack with unique stripe_session_id
        const newPack = await base44.asServiceRole.entities.RenderPack.create({
          user_email,
          credits_remaining: parseInt(credits),
          stripe_session_id: stripeSessionId,
          pack_type: pack,
          watermark_only: isStarterPack,
        });
        console.log(`✓ Created new pack for ${user_email}: ID=${newPack.id}, credits=${credits}`);
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