import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/_lib/auth';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const paymentLink = process.env.STRIPE_PAYMENT_LINK;
  const url = `${paymentLink}?client_reference_id=${encodeURIComponent(session.user.id)}&prefilled_email=${encodeURIComponent(session.user.email)}`;

  return NextResponse.json({ url });
}
