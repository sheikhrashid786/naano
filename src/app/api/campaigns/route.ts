import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { CampaignStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role === 'COMPANY' && user.companyId) {
      const campaigns = await prisma.campaign.findMany({
        where: { companyId: user.companyId },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
            },
          },
          brief: true,
          collaborations: {
            include: {
              creator: {
                include: {
                  user: {
                    select: { name: true, avatarUrl: true },
                  },
                },
              },
            },
          },
          _count: {
            select: { collaborations: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ campaigns });
    } else {
      // For creators: return active campaigns recruiting
      const campaigns = await prisma.campaign.findMany({
        where: { status: CampaignStatus.ACTIVE },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              logoUrl: true,
              industry: true,
              country: true,
            },
          },
          brief: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ campaigns });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'COMPANY' || !user.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      objective,
      description,
      deliverables,
      targetAudience,
      budgetPerPost,
      angle,
      suggestedHooks,
      keyTalkingPoints,
      dosAndDonts,
      trackingUrl,
      callToAction,
    } = body;

    if (!title || !objective || !description) {
      return NextResponse.json(
        { error: 'Title, objective, and description are required' },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.create({
      data: {
        companyId: user.companyId,
        title,
        objective,
        description,
        deliverables: deliverables || '1 Sponsored LinkedIn post + tracked link',
        targetAudience,
        budgetPerPost: parseInt(budgetPerPost || '200', 10),
        status: CampaignStatus.ACTIVE,
        brief: {
          create: {
            angle: angle || 'Authentic creator point of view',
            suggestedHooks: typeof suggestedHooks === 'string' ? suggestedHooks : JSON.stringify(suggestedHooks || []),
            keyTalkingPoints: keyTalkingPoints || 'Highlight real use-case and concrete results',
            dosAndDonts,
            trackingUrl,
            callToAction,
          },
        },
      },
      include: {
        brief: true,
      },
    });

    return NextResponse.json({ success: true, campaign });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'COMPANY' || !user.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    await prisma.campaign.delete({
      where: {
        id,
        companyId: user.companyId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
