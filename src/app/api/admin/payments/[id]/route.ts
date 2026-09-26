export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuth';

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: Props) {
  const auth = await requireAdminSession();
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const { status, stripePayoutId } = await req.json();

    const updateData: any = {};
    if (status && ['PENDING', 'PROCESSING', 'PAID', 'FAILED'].includes(status)) {
      updateData.status = status;
      if (status === 'PAID') {
        updateData.paidAt = new Date();
      }
    }
    if (stripePayoutId) updateData.stripePayoutId = stripePayoutId;

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        collaboration: {
          include: {
            creator: { include: { user: true } },
            company: true,
          },
        },
      },
    });

    // If paid, also mark the collaboration as COMPLETED if not already
    if (status === 'PAID' && payment.collaboration) {
      await prisma.collaboration.update({
        where: { id: payment.collaboration.id },
        data: { status: 'COMPLETED' },
      });
    }

    return NextResponse.json({ success: true, payment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update payment' }, { status: 500 });
  }
}
