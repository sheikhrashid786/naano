export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { CollabStatus, PayoutStatus } from '@prisma/client';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const collab = await prisma.collaboration.findUnique({
      where: { id },
      include: {
        campaign: true,
        company: { include: { user: true } },
        creator: { include: { user: true } },
        payment: true,
      },
    });

    if (!collab) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    }

    let updatedStatus: CollabStatus = status as CollabStatus;

    // Creator actions: ACCEPT, DECLINE
    if (user.role === 'CREATOR') {
      if (collab.creatorId !== user.creatorId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      if (status === 'ACCEPTED') {
        updatedStatus = CollabStatus.IN_PROGRESS;
        await prisma.notification.create({
          data: {
            userId: collab.company.userId,
            title: 'Collaboration Accepted!',
            message: `${collab.creator.user.name} accepted your invitation to "${collab.campaign.title}".`,
            link: '/dashboard/company/collabs',
          },
        });
      } else if (status === 'DECLINED') {
        updatedStatus = CollabStatus.DECLINED;
      }
    }

    // Company actions: ACCEPT (for applications), APPROVE (for submitted content)
    if (user.role === 'COMPANY') {
      if (collab.companyId !== user.companyId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
      if (status === 'ACCEPTED') {
        updatedStatus = CollabStatus.IN_PROGRESS;
        await prisma.notification.create({
          data: {
            userId: collab.creator.userId,
            title: 'Application Accepted!',
            message: `${collab.company.name} accepted your application for "${collab.campaign.title}".`,
            link: '/dashboard/creator/collabs',
          },
        });
      } else if (status === 'APPROVED') {
        updatedStatus = CollabStatus.COMPLETED;

        // Update payment to PAID
        if (collab.payment) {
          await prisma.payment.update({
            where: { id: collab.payment.id },
            data: {
              status: PayoutStatus.PAID,
              paidAt: new Date(),
              stripePayoutId: `po_${Math.random().toString(36).substring(2, 12)}`,
            },
          });
        }

        await prisma.notification.create({
          data: {
            userId: collab.creator.userId,
            title: 'Post Approved & Payment Sent! 🎉',
            message: `${collab.company.name} approved your LinkedIn post. €${collab.fixedRate} has been released to your account.`,
            link: '/dashboard/creator/gains',
          },
        });
      }
    }

    const updated = await prisma.collaboration.update({
      where: { id },
      data: { status: updatedStatus },
      include: { payment: true },
    });

    return NextResponse.json({ success: true, collaboration: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update status' },
      { status: 500 }
    );
  }
}
