export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuth';

export async function GET() {
  const auth = await requireAdminSession();
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const caseStudies = await prisma.caseStudyItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ caseStudies });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch case studies' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      company,
      slug,
      tagline,
      industry,
      metric,
      metricLabel,
      quote,
      author,
      role,
      pipelineAdded,
      impressions,
      clicks,
      summary,
      challenge,
      strategy,
      results,
      keyTakeaways,
      published,
    } = body;

    if (!company || !slug || !metric) {
      return NextResponse.json({ error: 'Company, slug, and metric are required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const existing = await prisma.caseStudyItem.findUnique({
      where: { slug: cleanSlug },
    });
    if (existing) {
      return NextResponse.json({ error: 'A case study with this slug already exists' }, { status: 400 });
    }

    const created = await prisma.caseStudyItem.create({
      data: {
        slug: cleanSlug,
        company,
        logo: body.logo || '/lp/logo-lemlist.png',
        tagline: tagline || 'B2B Growth & Lead Acquisition',
        industry: industry || 'AI & Developer Tools',
        metric,
        metricLabel: metricLabel || 'Growth',
        quote: quote || 'Naano delivered outstanding results for our acquisition funnel.',
        author: author || 'Growth Lead',
        role: role || 'Head of Marketing',
        creatorsUsed: body.creatorsUsed || '3 Verified Creators',
        pipelineAdded: pipelineAdded || '€20,000 ARR',
        impressions: impressions || '40,000 Views',
        clicks: clicks || '500 Clicks',
        summary: summary || 'Comprehensive client case study teardown.',
        challenge: challenge || 'Traditional outbound and search ads were generating diminishing returns.',
        strategy: strategy || 'Deployed targeted LinkedIn creators sharing actionable workflows.',
        results: typeof results === 'string' ? results : JSON.stringify(results || ['Over 400+ qualified clicks', 'Generated €20k pipeline']),
        keyTakeaways: typeof keyTakeaways === 'string' ? keyTakeaways : JSON.stringify(keyTakeaways || ['Practitioner proof drives trial conversion']),
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json({ success: true, caseStudy: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create case study' }, { status: 500 });
  }
}
