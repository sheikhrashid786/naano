import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateFitScore } from '@/lib/matching';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const industry = searchParams.get('industry') || '';
    const country = searchParams.get('country') || '';
    const minFollowers = parseInt(searchParams.get('minFollowers') || '0', 10);
    const maxFollowers = parseInt(searchParams.get('maxFollowers') || '1000000', 10);
    const sortBy = searchParams.get('sortBy') || 'fit';

    const currentUser = await getCurrentUser();
    let companyICP = null;

    if (currentUser?.companyId) {
      companyICP = await prisma.company.findUnique({
        where: { id: currentUser.companyId },
      });
    }

    // Build Prisma query
    const where: any = {};

    if (industry) {
      where.industry = { contains: industry };
    }

    if (country) {
      where.country = country;
    }

    if (minFollowers > 0 || maxFollowers < 1000000) {
      where.followersCount = {
        gte: minFollowers,
        lte: maxFollowers,
      };
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { headline: { contains: search } },
        { bio: { contains: search } },
        { niche: { contains: search } },
      ];
    }

    const creators = await prisma.creator.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Calculate match score for each creator
    const enriched = creators.map((creator) => {
      const fitScore = companyICP
        ? calculateFitScore(companyICP, {
            industry: creator.industry,
            niche: creator.niche,
            country: creator.country,
            followersCount: creator.followersCount,
            engagementRate: creator.engagementRate,
          })
        : 85;

      return {
        ...creator,
        fitScore,
      };
    });

    // Sort creators
    if (sortBy === 'followersDesc') {
      enriched.sort((a, b) => b.followersCount - a.followersCount);
    } else if (sortBy === 'followersAsc') {
      enriched.sort((a, b) => a.followersCount - b.followersCount);
    } else if (sortBy === 'priceAsc') {
      enriched.sort((a, b) => a.pricePerPost - b.pricePerPost);
    } else if (sortBy === 'nameAsc') {
      enriched.sort((a, b) => a.user.name.localeCompare(b.user.name));
    } else {
      // Default: fit score
      enriched.sort((a, b) => b.fitScore - a.fitScore);
    }

    return NextResponse.json({ creators: enriched });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch creators' },
      { status: 500 }
    );
  }
}
