import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateFitScore } from '@/lib/matching';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const creator = await prisma.creator.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
        collaborations: {
          where: { status: 'COMPLETED' },
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                industry: true,
              },
            },
          },
        },
      },
    });

    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    const currentUser = await getCurrentUser();
    let fitScore = 85;

    if (currentUser?.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: currentUser.companyId },
      });
      if (company) {
        fitScore = calculateFitScore(company, {
          industry: creator.industry,
          niche: creator.niche,
          country: creator.country,
          followersCount: creator.followersCount,
          engagementRate: creator.engagementRate,
        });
      }
    }

    return NextResponse.json({
      creator: {
        ...creator,
        fitScore,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch creator' },
      { status: 500 }
    );
  }
}
