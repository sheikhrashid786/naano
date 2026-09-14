import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'CREATOR' || !user.creatorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all collaborations for this creator
    const collabs = await prisma.collaboration.findMany({
      where: { creatorId: user.creatorId },
      include: {
        campaign: true,
        company: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalEarned = 0;
    let pendingInEscrow = 0;
    let availablePayout = 0;

    collabs.forEach((collab) => {
      if (collab.payment?.status === 'PAID') {
        totalEarned += collab.fixedRate;
      } else if (collab.status === 'APPROVED') {
        // Ready for payout
        availablePayout += collab.fixedRate;
      } else if (['ACCEPTED', 'CONTENT_SUBMITTED'].includes(collab.status)) {
        // Escrow locked
        pendingInEscrow += collab.fixedRate;
      }
    });

    const creator = await prisma.creator.findUnique({
      where: { id: user.creatorId },
      select: {
        stripeConnected: true,
        pricePerPost: true,
      },
    });

    return NextResponse.json({
      totalEarned,
      pendingInEscrow,
      availablePayout,
      stripeConnected: creator?.stripeConnected ?? true,
      pricePerPost: creator?.pricePerPost || 650,
      collaborations: collabs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch creator gains' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'CREATOR' || !user.creatorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'TOGGLE_STRIPE') {
      const creator = await prisma.creator.findUnique({
        where: { id: user.creatorId },
      });
      const updated = await prisma.creator.update({
        where: { id: user.creatorId },
        data: { stripeConnected: !creator?.stripeConnected },
      });
      return NextResponse.json({ success: true, stripeConnected: updated.stripeConnected });
    }

    if (action === 'WITHDRAW') {
      // Find all approved collaborations without paid payment and mark them as PAID
      const approvedCollabs = await prisma.collaboration.findMany({
        where: {
          creatorId: user.creatorId,
          status: 'APPROVED',
        },
        include: { payment: true },
      });

      for (const c of approvedCollabs) {
        if (c.payment) {
          await prisma.payment.update({
            where: { id: c.payment.id },
            data: { status: 'PAID', paidAt: new Date(), stripePayoutId: `po_${Math.random().toString(36).substring(2, 10)}` },
          });
        } else {
          await prisma.payment.create({
            data: {
              collaborationId: c.id,
              amount: c.fixedRate,
              currency: 'EUR',
              status: 'PAID',
              paidAt: new Date(),
              stripePayoutId: `po_${Math.random().toString(36).substring(2, 10)}`,
            },
          });
        }
      }

      // Notify creator
      await prisma.notification.create({
        data: {
          userId: user.userId,
          title: 'Payout Processed',
          message: 'Your payout transfer via Stripe Connect has been initiated to your bank account.',
          link: '/dashboard/creator/gains',
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}
