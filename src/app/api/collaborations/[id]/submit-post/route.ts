import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { CollabStatus } from '@prisma/client';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'CREATOR' || !user.creatorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { postUrl, proofText } = await req.json();

    if (!postUrl) {
      return NextResponse.json({ error: 'Post URL is required' }, { status: 400 });
    }

    const collab = await prisma.collaboration.findUnique({
      where: { id },
      include: {
        campaign: true,
        company: true,
      },
    });

    if (!collab || collab.creatorId !== user.creatorId) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 });
    }

    const updated = await prisma.collaboration.update({
      where: { id },
      data: {
        status: CollabStatus.CONTENT_SUBMITTED,
        submittedPostUrl: postUrl,
        postProofText: proofText,
        publishedAt: new Date(),
      },
    });

    // Notify company
    await prisma.notification.create({
      data: {
        userId: collab.company.userId,
        title: 'New Content Submitted for Review',
        message: `${user.name} submitted a live LinkedIn post for "${collab.campaign.title}". Review and approve payout.`,
        link: '/dashboard/company/collabs',
      },
    });

    return NextResponse.json({ success: true, collaboration: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit post' },
      { status: 500 }
    );
  }
}
