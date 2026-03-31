import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { recordProvenance } from './provenance';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });

export async function stripeWebhookHandler(req: Request, res: Response): Promise<void> {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    res.status(400).json({ error: 'Missing stripe-signature header or STRIPE_WEBHOOK_SECRET' });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch (err) {
    console.error('[webhooks] Stripe signature verification failed:', err);
    res.status(400).json({ error: 'Webhook signature verification failed' });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { datasetId, userId } = session.metadata ?? {};

        if (!datasetId || !userId) {
          console.warn('[webhooks] checkout.session.completed: missing metadata on session', session.id);
          break;
        }

        // Idempotency: skip if purchase already recorded for this session
        const existing = await prisma.purchase.findFirst({
          where: { stripePaymentId: session.id },
        });
        if (existing) {
          console.log(`[webhooks] checkout.session.completed: purchase already exists for session ${session.id}`);
          break;
        }

        await prisma.$transaction([
          prisma.purchase.create({
            data: {
              userId,
              datasetId,
              amount: session.amount_total ?? 0,
              currency: session.currency ?? 'usd',
              stripePaymentId: session.id,
              status: 'completed',
            },
          }),
          prisma.dataset.update({
            where: { id: datasetId },
            data: { downloads: { increment: 1 } },
          }),
        ]);

        await recordProvenance(datasetId, userId, 'downloaded', {
          stripeSessionId: session.id,
          pricingTier: 'paid',
          amountTotal: session.amount_total,
        });

        console.log(`[webhooks] checkout.session.completed: purchase created for dataset ${datasetId}, user ${userId}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;

        // PaymentIntent metadata is empty — look up the Checkout Session that triggered this intent
        let datasetId: string | undefined;
        let userId: string | undefined;
        try {
          const sessions = await stripe.checkout.sessions.list({ payment_intent: intent.id, limit: 1 });
          const checkoutSession = sessions.data[0];
          datasetId = checkoutSession?.metadata?.datasetId;
          userId = checkoutSession?.metadata?.userId;
        } catch (err) {
          console.error('[webhooks] payment_intent.payment_failed: failed to look up checkout session', err);
        }

        if (!datasetId || !userId) {
          console.warn('[webhooks] payment_intent.payment_failed: missing metadata for intent', intent.id);
          break;
        }

        // Update an existing pending purchase if one exists, otherwise create a failed record
        const pendingPurchase = await prisma.purchase.findFirst({
          where: { userId, datasetId, status: 'pending' },
          orderBy: { createdAt: 'desc' },
        });

        if (pendingPurchase) {
          await prisma.purchase.update({
            where: { id: pendingPurchase.id },
            data: { status: 'failed', stripePaymentId: intent.id },
          });
        } else {
          await prisma.purchase.create({
            data: {
              userId,
              datasetId,
              amount: intent.amount,
              currency: intent.currency ?? 'usd',
              stripePaymentId: intent.id,
              status: 'failed',
            },
          });
        }

        console.log(`[webhooks] payment_intent.payment_failed for dataset ${datasetId}, user ${userId}`);
        break;
      }

      default:
        console.log(`[webhooks] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('[webhooks] Error processing webhook event:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
