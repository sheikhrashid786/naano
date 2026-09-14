import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { CollabStatus, PayoutStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role === 'COMPANY' && user.companyId) {
      const collabs = await prisma.collaboration.findMany({
        where: { companyId: user.companyId },
        include: {
          campaign: {
            include: { brief: true },
          },
          creator: {
            include: {
              user: {
                select: { name: true, email: true, avatarUrl: true },
              },
            },
          },
          payment: true,
          conversation: {
            include: {
              messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
      return NextResponse.json({ collaborations: collabs });
    } else if (user.role === 'CREATOR' && user.creatorId) {
      const collabs = await prisma.collaboration.findMany({
        where: { creatorId: user.creatorId },
        include: {
          campaign: {
            include: {
              brief: true,
              company: {
                select: {
                  id: true,
                  name: true,
                  logoUrl: true,
                  website: true,
                  industry: true,
                },
              },
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              industry: true,
            },
          },
          payment: true,
          conversation: {
            include: {
              messages: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });
      return NextResponse.json({ collaborations: collabs });
    }

    return NextResponse.json({ collaborations: [] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch collaborations' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { campaignId, creatorId, pitchMessage, customRate } = body;

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId is required' }, { status: 400 });
    }

    // Case A: Company invites Creator
    if (user.role === 'COMPANY' && user.companyId) {
      if (!creatorId) {
        return NextResponse.json({ error: 'creatorId is required' }, { status: 400 });
      }

      const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
      if (!creator) {
        return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
      }

      const fixedRate = customRate ? parseInt(customRate, 10) : creator.pricePerPost;

      const collab = await prisma.collaboration.create({
        data: {
          campaignId,
          companyId: user.companyId,
          creatorId,
          status: CollabStatus.INVITED,
          fixedRate,
          pitchMessage,
          conversation: {
            create: {},
          },
          payment: {
            create: {
              amount: fixedRate,
              currency: 'EUR',
              status: PayoutStatus.PENDING,
            },
          },
        },
      });

      // Notify Creator
      await prisma.notification.create({
        data: {
          userId: creator.userId,
          title: 'New Campaign Invitation',
          message: `${user.name} invited you to collaborate with a fixed fee of €${fixedRate}.`,
          link: '/dashboard/creator/applications',
        },
      });

      return NextResponse.json({ success: true, collaboration: collab });
    }

    // Case B: Creator applies to Company Campaign
    if (user.role === 'CREATOR' && user.creatorId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: { company: true },
      });
      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }

      const creator = await prisma.creator.findUnique({ where: { id: user.creatorId } });
      const fixedRate = customRate ? parseInt(customRate, 10) : (creator?.pricePerPost || 150);

      const collab = await prisma.collaboration.create({
        data: {
          campaignId,
          companyId: campaign.companyId,
          creatorId: user.creatorId,
          status: CollabStatus.APPLIED,
          fixedRate,
          pitchMessage,
          conversation: {
            create: {},
          },
          payment: {
            create: {
              amount: fixedRate,
              currency: 'EUR',
              status: PayoutStatus.PENDING,
            },
          },
        },
      });

      // Notify Company
      await prisma.notification.create({
        data: {
          userId: campaign.company.userId,
          title: 'New Creator Application',
          message: `${user.name} applied to "${campaign.title}" with a rate of €${fixedRate}.`,
          link: '/dashboard/company/collabs',
        },
      });

      return NextResponse.json({ success: true, collaboration: collab });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to submit collaboration' },
      { status: 500 }
    );
  }
}
