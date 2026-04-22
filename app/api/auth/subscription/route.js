import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/_lib/auth';
import prisma from '@/app/_lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
  }

  const now = new Date();
  let isActive = false;
  let isTrialing = false;
  let daysLeft = 0;

  if (subscription.status === 'trial') {
    isTrialing = now < new Date(subscription.trialEnd);
    isActive = isTrialing;
    daysLeft = isTrialing
      ? Math.ceil((new Date(subscription.trialEnd) - now) / (1000 * 60 * 60 * 24))
      : 0;
  } else if (subscription.status === 'active') {
    isActive = subscription.currentPeriodEnd ? now < new Date(subscription.currentPeriodEnd) : true;
    daysLeft = subscription.currentPeriodEnd
      ? Math.ceil((new Date(subscription.currentPeriodEnd) - now) / (1000 * 60 * 60 * 24))
      : 30;
  }

  return NextResponse.json({
    status: subscription.status,
    isActive,
    isTrialing,
    daysLeft,
    trialEnd: subscription.trialEnd,
    currentPeriodEnd: subscription.currentPeriodEnd,
  });
}
