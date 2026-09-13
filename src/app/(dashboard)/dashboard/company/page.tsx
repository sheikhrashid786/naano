import React from 'react';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateFitScore } from '@/lib/matching';
import CompanyOverviewClient from './CompanyOverviewClient';

export default async function CompanyOverviewPage() {
  const session = await getCurrentUser();

  // Fetch logged in user from database
  let dbUser = null;
  if (session?.userId) {
    dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        company: {
          select: { id: true },
        },
      },
    });
  }

  // Find the company for the current session, or fallback to the user's company or first company in DB
  const targetCompanyId = session?.companyId || dbUser?.company?.id;

  let company = null;
  if (targetCompanyId) {
    company = await prisma.company.findUnique({
      where: { id: targetCompanyId },
      include: {
        campaigns: {
          include: {
            analytics: true,
          },
        },
        collaborations: {
          include: {
            campaign: true,
            creator: {
              include: {
                user: true,
              },
            },
            conversation: {
              include: {
                messages: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  }

  if (!company) {
    company = await prisma.company.findFirst({
      include: {
        campaigns: {
          include: {
            analytics: true,
          },
        },
        collaborations: {
          include: {
            campaign: true,
            creator: {
              include: {
                user: true,
              },
            },
            conversation: {
              include: {
                messages: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
  }

  // Fetch real creators dynamically from MySQL database
  const dbCreators = await prisma.creator.findMany({
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
    orderBy: [
      { featured: 'desc' },
      { followersCount: 'desc' },
    ],
    take: 12,
  });

  // Calculate dynamic ICP match score and format creators from Prisma
  const creators = dbCreators.map((creator) => {
    const fit = company
      ? calculateFitScore(
          {
            targetIndustries: company.targetIndustries,
            targetCountries: company.targetCountries,
            industry: company.industry,
            country: company.country,
          },
          {
            industry: creator.industry,
            niche: creator.niche,
            country: creator.country,
            followersCount: creator.followersCount,
            engagementRate: creator.engagementRate,
          }
        )
      : Math.min(98, Math.max(70, Math.round(creator.engagementRate * 18)));

    return {
      id: creator.id,
      name: creator.user.name,
      niche: creator.niche || creator.headline || 'B2B Creator',
      avatarUrl:
        creator.avatarUrl ||
        creator.user.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      price: creator.pricePerPost,
      icpMatch: `${fit}%`,
      rawCreator: {
        id: creator.id,
        pricePerPost: creator.pricePerPost,
        fitScore: fit,
        user: { name: creator.user.name },
      },
    };
  });

  // Calculate dynamic metrics from MySQL collaborations and campaigns
  const activatedCreatorsSet = new Set(
    company?.collaborations
      ?.filter((c) => c.status !== 'CANCELLED' && c.status !== 'DECLINED')
      ?.map((c) => c.creatorId) || []
  );
  const activatedCreatorsCount = activatedCreatorsSet.size;

  const postsPublishedCount =
    company?.collaborations?.filter(
      (c) => c.status === 'COMPLETED' || c.status === 'APPROVED'
    ).length || 0;

  const profilesEngagedCount =
    company?.collaborations?.reduce((sum, c) => sum + (c.clicksCount > 0 ? 1 : 0), 0) || 0;

  // Compute impressions dynamically from campaigns analytics and clicks
  let totalImpressions = 0;
  if (company?.campaigns) {
    for (const camp of company.campaigns) {
      if (camp.analytics && camp.analytics.length > 0) {
        totalImpressions += camp.analytics.reduce((sum, a) => sum + a.clicks * 45, 0);
      }
    }
  }
  if (totalImpressions === 0 && company?.collaborations) {
    totalImpressions = company.collaborations.reduce(
      (sum, c) => sum + (c.clicksCount > 0 ? c.clicksCount * 55 : 0),
      0
    );
  }

  // Extract real dynamic conversations for the company
  const recentConversations =
    company?.collaborations
      ?.filter((c) => c.conversation && c.conversation.messages.length > 0)
      .map((c) => ({
        id: c.conversation!.id,
        name: c.creator.user.name,
        lastMessage: c.conversation!.messages[0]?.content || '',
      })) || [];

  return (
    <CompanyOverviewClient
      initialUser={{
        name: dbUser?.name || session?.name || 'there',
        avatarUrl: dbUser?.avatarUrl,
      }}
      companyName={company?.name || 'Your Company'}
      walletBalance={0}
      stats={{
        creatorsActivated: activatedCreatorsCount,
        postsPublished: postsPublishedCount,
        profilesEngaged: profilesEngagedCount,
        impressions: totalImpressions,
      }}
      creators={creators}
      recentConversations={recentConversations}
    />
  );
}
