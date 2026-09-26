export const dynamic = 'force-dynamic';

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/landing/Footer';
import CaseStudiesPageClient from './CaseStudiesPageClient';

export const metadata: Metadata = {
  title: 'Client Case Studies & Verified Results | Naano',
  description: 'Explore real case studies of B2B SaaS scaleups and agencies driving attributed pipeline and demos with LinkedIn creator campaigns.',
};

export default async function CaseStudiesIndexPage() {
  const session = await getCurrentUser();

  const dbItems = await prisma.caseStudyItem.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  const caseStudies = dbItems.map((item) => ({
    id: item.id,
    slug: item.slug,
    company: item.company,
    logo: item.logo || '/lp/logo-lemlist.png',
    tagline: item.tagline,
    industry: item.industry,
    metric: item.metric,
    metricLabel: item.metricLabel,
    quote: item.quote,
    author: item.author,
    role: item.role,
    creatorsUsed: item.creatorsUsed,
    pipelineAdded: item.pipelineAdded,
    impressions: item.impressions,
    clicks: item.clicks,
    readTime: item.readTime,
    date: item.date,
    summary: item.summary,
    challenge: item.challenge,
    strategy: item.strategy,
    results: typeof item.results === 'string' ? JSON.parse(item.results) : (item.results || []),
    keyTakeaways: typeof item.keyTakeaways === 'string' ? JSON.parse(item.keyTakeaways) : (item.keyTakeaways || []),
    creators: item.creatorsJson ? JSON.parse(item.creatorsJson) : [],
  }));

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar initialUser={session} />
      <main className="w-full flex-1">
        <CaseStudiesPageClient initialCaseStudies={caseStudies} />
      </main>
      <Footer />
    </div>
  );
}
