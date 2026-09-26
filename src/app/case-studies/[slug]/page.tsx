export const dynamic = 'force-dynamic';

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/landing/Footer';
import {
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Quote,
  Clock,
  Calendar,
  Sparkles,
  ArrowLeft,
  Building2,
  Users,
} from 'lucide-react';

interface CaseStudyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

import { prisma } from '@/lib/prisma';

async function getCaseStudy(slug: string) {
  try {
    const item = await prisma.caseStudyItem.findUnique({
      where: { slug },
    });
    if (item && item.published) {
      return {
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
      };
    }
  } catch (err) {}
  return null;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);

  if (!cs) {
    return {
      title: 'Case Study Not Found | Naano',
    };
  }

  return {
    title: `Case Study: How ${cs.company} Achieved ${cs.metric} with Naano Creators`,
    description: cs.summary,
  };
}

export default async function CaseStudyDetailPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);

  if (!cs) {
    notFound();
  }

  const session = await getCurrentUser();
  const dbOthers = await prisma.caseStudyItem.findMany({
    where: { published: true, slug: { not: slug } },
    take: 4,
  });

  const otherCaseStudies = dbOthers.map((item) => ({
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
  }));

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar initialUser={session} />

      <main className="w-full flex-1 pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Case Studies</span>
          </Link>

          {/* Header Metadata */}
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            <span className="text-indigo-600">{cs.industry}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {cs.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {cs.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
            How {cs.company} Achieved {cs.metric} {cs.metricLabel} with LinkedIn Creators
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            {cs.summary}
          </p>

          {/* Key Metrics Banner */}
          <div className="my-10 p-6 sm:p-8 rounded-3xl bg-slate-950 text-white grid grid-cols-2 md:grid-cols-4 gap-6 shadow-xl">
            <div>
              <div className="text-xs font-bold uppercase text-slate-400">Primary Impact</div>
              <div className="text-3xl sm:text-4xl font-black text-indigo-400 font-mono mt-1">{cs.metric}</div>
              <div className="text-[11px] text-slate-400 mt-1">{cs.metricLabel}</div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase text-slate-400">Pipeline Added</div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">{cs.pipelineAdded}</div>
              <div className="text-[11px] text-slate-400 mt-1">Attributed ARR</div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase text-slate-400">Tracked Engagement</div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">{cs.clicks}</div>
              <div className="text-[11px] text-slate-400 mt-1">Direct Link Clicks</div>
            </div>

            <div>
              <div className="text-xs font-bold uppercase text-slate-400">Organic Reach</div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">{cs.impressions}</div>
              <div className="text-[11px] text-slate-400 mt-1">Across Posts</div>
            </div>
          </div>

          {/* Executive Quote */}
          <div className="p-8 rounded-3xl bg-indigo-50/70 border border-indigo-100 my-10 relative">
            <Quote className="w-8 h-8 text-indigo-200 mb-3 rotate-180" />
            <p className="text-base sm:text-lg text-slate-800 italic font-medium leading-relaxed">
              &quot;{cs.quote}&quot;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src={cs.logo}
                alt={cs.company}
                className="h-7 max-w-[120px] object-contain"
              />
              <div className="border-l border-indigo-200 pl-3">
                <div className="text-sm font-bold text-slate-900">{cs.author}</div>
                <div className="text-xs text-indigo-700">{cs.role}</div>
              </div>
            </div>
          </div>

          {/* Body Content Sections */}
          <div className="space-y-10 text-slate-700 leading-relaxed text-base">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
                1. The Core Challenge
              </h2>
              <p className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 leading-relaxed text-slate-700">
                {cs.challenge}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
                2. Execution &amp; Creator Strategy
              </h2>
              <p className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 leading-relaxed text-slate-700">
                {cs.strategy}
              </p>
            </div>

            {/* Creators Activated */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
                3. Creators Activated in This Campaign
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {cs.creators.map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-indigo-600 font-semibold">{c.niche}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{c.followers} Followers</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Checklist */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
                4. Key Attributed Results
              </h2>
              <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                {cs.results.map((res, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{res}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Takeaways */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
                5. Strategic Takeaways for B2B Founders
              </h2>
              <ul className="space-y-2.5 list-disc pl-5 text-sm text-slate-700">
                {cs.keyTakeaways.map((point, i) => (
                  <li key={i} className="leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* More Client Case Studies Grid */}
          <div className="mt-20 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Explore More Client Case Studies
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Discover how other fast-growing SaaS companies use Naano
                </p>
              </div>

              <Link
                href="/case-studies"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All Case Studies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherCaseStudies.slice(0, 4).map((other) => (
                <Link
                  key={other.id}
                  href={`/case-studies/${other.slug}`}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all block group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <img src={other.logo} alt={other.company} className="h-6 object-contain" />
                    <span className="text-xs font-bold text-emerald-600 font-mono">{other.pipelineAdded}</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono group-hover:text-indigo-600 transition-colors">
                    {other.metric}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase mt-0.5">{other.metricLabel}</div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed line-clamp-2">
                    {other.summary}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">{other.author}, {other.company}</span>
                    <span className="text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Read Story →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Action CTA Card */}
          <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl font-bold">Ready to duplicate these results for your B2B SaaS?</h3>
              <p className="text-xs text-indigo-100 mt-1 max-w-md">
                Browse verified B2B LinkedIn creators and launch your first targeted campaign with escrow protection.
              </p>
            </div>
            <Link
              href="/dashboard/company/campaigns"
              className="px-6 py-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs sm:text-sm transition-all shrink-0 shadow-sm"
            >
              Launch a Campaign
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
