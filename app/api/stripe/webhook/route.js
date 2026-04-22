import { NextResponse } from 'next/server';
import stripe from '@/app/_lib/stripe';
import prisma from '@/app/_lib/prisma';

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const customerId = session.customer;

        if (userId) {
          // Extend from existing period end if active, otherwise from now
          const existing = await prisma.subscription.findUnique({ where: { userId } });
          const base = existing?.currentPeriodEnd && new Date(existing.currentPeriodEnd) > new Date()
            ? new Date(existing.currentPeriodEnd)
            : new Date();
          const periodEnd = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000);

          await prisma.subscription.update({
            where: { userId },
            data: {
              status: 'active',
              stripeCustomerId: customerId,
              currentPeriodEnd: periodEnd,
            },
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const customerId = invoice.customer;

        const sub = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (sub) {
          const periodEnd = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
          await prisma.subscription.update({
            where: { id: sub.id },
            data: {
              status: 'active',
              currentPeriodEnd: periodEnd,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const deleted = event.data.object;
        const customerId = deleted.customer;

        const sub = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (sub) {
          await prisma.subscription.update({
            where: { id: sub.id },
            data: { status: 'cancelled' },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
