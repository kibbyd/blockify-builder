import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/_lib/auth';
import stripe from '@/app/_lib/stripe';
import prisma from '@/app/_lib/prisma';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  // Retrieve the Checkout Session from Stripe to verify payment
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (checkoutSession.payment_status !== 'paid') {
    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
  }

  // Verify this session belongs to the logged-in user
  const referenceId = checkoutSession.client_reference_id;
  if (referenceId && referenceId !== session.user.id) {
    return NextResponse.json({ error: 'Session does not match user' }, { status: 403 });
  }

  // Extend from existing period end if active, otherwise from now
  const existing = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  const base = existing?.currentPeriodEnd && new Date(existing.currentPeriodEnd) > new Date()
    ? new Date(existing.currentPeriodEnd)
    : new Date();
  const periodEnd = new Date(base.getTime() + 30 * 24 * 60 * 60 * 1000);

  await prisma.subscription.update({
    where: { userId: session.user.id },
    data: {
      status: 'active',
      stripeCustomerId: checkoutSession.customer,
      currentPeriodEnd: periodEnd,
    },
  });

  return NextResponse.json({ success: true, currentPeriodEnd: periodEnd });
}
