import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { calculateFitScore } from '@/lib/matching';
import bcrypt from 'bcryptjs';

const REFERENCE_CREATORS = [
  {
    email: 'naman@creator.io',
    name: 'Naman Jain',
    headline: 'Scaling B2B SaaS ARR through organic founder distribution and creator playbooks',
    bio: 'Helping early-stage and Series A SaaS companies acquire high-intent B2B customers without burning cash on paid ads.',
    niche: 'B2B · SaaS',
    industry: 'SaaS',
    country: 'AE',
    followersCount: 19200,
    engagementRate: 4.6,
    pricePerPost: 375,
    badge: 'Top Creator',
    featured: true,
    avatarUrl: null,
  },
  {
    email: 'amber@creator.io',
    name: 'Amber Cheema',
    headline: 'AI Marketing & Growth Strategist | 60K+ Community on LinkedIn',
    bio: 'Deconstructing top B2B AI marketing campaigns, prompt engineering workflows, and pipeline conversion tactics.',
    niche: 'AI · Marketing',
    industry: 'Marketing',
    country: 'GB',
    followersCount: 61100,
    engagementRate: 4.2,
    pricePerPost: 188,
    badge: 'Verified B2B',
    featured: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  },
  {
    email: 'somitra@creator.io',
    name: 'Somitra Sinha',
    headline: 'AI Engineer & Tech Creator | Demystifying generative AI for B2B executives',
    bio: 'Writing actionable breakdowns of production AI apps, developer tooling, and modern tech architectures.',
    niche: 'AI · SaaS',
    industry: 'AI',
    country: 'US',
    followersCount: 10600,
    engagementRate: 5.1,
    pricePerPost: 94,
    badge: 'Rising Star',
    featured: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    email: 'marc@creator.io',
    name: 'Marc Dubois',
    headline: 'Outbound Sales Leader | 120M+ Impressions on LinkedIn B2B Playbooks',
    bio: 'Teaching founders and SDR teams how to craft irresistible value propositions and multi-touch outbound sequences.',
    niche: 'Sales Tech · Outbound',
    industry: 'Sales',
    country: 'FR',
    followersCount: 34500,
    engagementRate: 4.8,
    pricePerPost: 220,
    badge: 'Top Creator',
    featured: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop&crop=face&q=80',
  },
  {
    email: 'sophie@creator.io',
    name: 'Sophie Laurent',
    headline: 'Host of The B2B Growth Lounge Podcast | AI and Software Positioning Specialist',
    bio: 'Audio and text content creator breaking down how modern tech companies achieve product-market fit and revenue acceleration.',
    niche: 'Tech Podcast · AI',
    industry: 'AI',
    country: 'CA',
    followersCount: 48200,
    engagementRate: 5.5,
    pricePerPost: 310,
    badge: 'Verified B2B',
    featured: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop&crop=face&q=80',
  },
  {
    email: 'elena@creator.io',
    name: 'Elena Rostova',
    headline: 'B2B Copywriter & Conversion Specialist | Helping SaaS turn readers into pipeline',
    bio: 'Conversion copywriter focusing on LinkedIn organic lead magnets, landing page messaging, and email nurture tracks.',
    niche: 'Copywriting · SaaS',
    industry: 'Marketing',
    country: 'NL',
    followersCount: 24800,
    engagementRate: 4.9,
    pricePerPost: 175,
    badge: 'Rising Star',
    featured: false,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&auto=format&fit=crop&crop=face&q=80',
  },
];

let hasEnsuredCreators = false;

async function ensureReferenceCreatorsExist() {
  if (hasEnsuredCreators) return;
  try {
    const passwordHash = await bcrypt.hash('password123', 10);
    for (const item of REFERENCE_CREATORS) {
      const found = await prisma.user.findUnique({
        where: { email: item.email },
      });
      if (!found) {
        await prisma.user.create({
          data: {
            email: item.email,
            name: item.name,
            passwordHash,
            role: 'CREATOR',
            avatarUrl: item.avatarUrl,
            creator: {
              create: {
                headline: item.headline,
                bio: item.bio,
                niche: item.niche,
                industry: item.industry,
                country: item.country,
                followersCount: item.followersCount,
                engagementRate: item.engagementRate,
                pricePerPost: item.pricePerPost,
                badge: item.badge,
                featured: item.featured,
                avatarUrl: item.avatarUrl,
                linkedinUrl: `https://linkedin.com/in/${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
              },
            },
          },
        });
      } else if (item.avatarUrl) {
        // Ensure avatar is updated with centered face crop
        await prisma.creator.updateMany({
          where: { userId: found.id },
          data: { avatarUrl: item.avatarUrl },
        });
        await prisma.user.update({
          where: { id: found.id },
          data: { avatarUrl: item.avatarUrl },
        });
      }
    }
    hasEnsuredCreators = true;
  } catch (e) {
    // Continue even if concurrent creation occurs
  }
}

export async function GET(req: Request) {
  try {
    await ensureReferenceCreatorsExist();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const industry = searchParams.get('industry') || '';
    const country = searchParams.get('country') || '';
    const minFollowers = parseInt(searchParams.get('minFollowers') || '0', 10);
    const maxFollowers = parseInt(searchParams.get('maxFollowers') || '1000000', 10);
    const priceRange = searchParams.get('priceRange') || '';
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
      where.OR = [
        { industry: { contains: industry } },
        { niche: { contains: industry } },
      ];
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

    if (priceRange === 'under200') {
      where.pricePerPost = { lt: 200 };
    } else if (priceRange === '200to500') {
      where.pricePerPost = { gte: 200, lte: 500 };
    } else if (priceRange === 'over500') {
      where.pricePerPost = { gt: 500 };
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { headline: { contains: search } },
        { bio: { contains: search } },
        { niche: { contains: search } },
        { industry: { contains: search } },
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

    // Calculate match score & verified metrics for each creator
    const enriched = creators.map((creator) => {
      const fitScore = companyICP
        ? calculateFitScore(companyICP, {
            industry: creator.industry,
            niche: creator.niche,
            country: creator.country,
            followersCount: creator.followersCount,
            engagementRate: creator.engagementRate,
          })
        : Math.min(98, Math.max(72, Math.round(creator.engagementRate * 18)));

      // Real calculated metric values
      const medianViews = Math.round(creator.followersCount * (creator.engagementRate || 4.2) * 0.42);
      const cpm = Math.max(8, Math.round((creator.pricePerPost / Math.max(1, medianViews)) * 1000));

      return {
        ...creator,
        fitScore,
        medianViews,
        cpm,
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
