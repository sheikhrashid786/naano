export const dynamic = 'force-dynamic';

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/landing/Footer';
import { prisma } from '@/lib/prisma';
import {
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface BlogArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getArticle(slug: string) {
  try {
    const item = await prisma.blogItem.findUnique({
      where: { slug },
    });
    if (item && item.published) {
      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        topic: item.topic,
        readTime: item.readTime,
        date: item.date,
        author: item.author,
        authorRole: item.authorRole,
        authorAvatar: item.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        gradient: item.gradient,
        summary: item.summary,
        takeaways: typeof item.takeaways === 'string' ? JSON.parse(item.takeaways) : (item.takeaways || []),
        content: typeof item.contentJson === 'string' ? JSON.parse(item.contentJson) : [],
        featured: item.featured,
      };
    }
  } catch (err) {}
  return null;
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Naano',
    };
  }

  return {
    title: `${article.title} | Naano Journal`,
    description: article.summary,
  };
}

export default async function BlogArticleDetailPage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const session = await getCurrentUser();
  const dbRelated = await prisma.blogItem.findMany({
    where: { published: true, slug: { not: slug } },
    take: 4,
  });

  const relatedArticles = dbRelated.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    topic: item.topic,
    readTime: item.readTime,
    author: item.author,
    summary: item.summary,
  }));

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar initialUser={session} />

      {/* Banner Section (Section 1: Even - Tinted background) */}
      <header className="relative overflow-hidden pt-32 pb-16 banner-section bg-[#EBF1EE] border-b border-slate-200/80 section-even">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-200/40 via-teal-200/30 to-emerald-100/30 blur-3xl pointer-events-none rounded-full -z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Navigation */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          {/* Article Header Metadata */}
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-mono">
              {article.topic}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5" /> {article.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.15]">
            {article.title}
          </h1>

          {/* Author Badge */}
          <div className="mt-6 flex items-center gap-3.5 pb-8 border-b border-slate-200/80">
            <img
              src={article.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
              alt={article.author}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
            />
            <div>
              <div className="text-sm font-bold text-slate-900">{article.author}</div>
              <div className="text-xs text-slate-500">{article.authorRole}</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mt-8 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
              Executive Abstract
            </div>
            <p className="text-base text-slate-700 leading-relaxed font-medium">
              {article.summary}
            </p>
          </div>
        </div>
      </header>

      {/* Article Content (Section 2: Odd - Clean White) */}
      <main className="w-full flex-1 py-16 bg-white section-odd">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Strategic Takeaways Callout */}
          <div className="my-8 p-6 sm:p-8 rounded-3xl bg-emerald-50/70 border border-emerald-200/80">
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Key Strategic Takeaways</span>
            </h3>
            <ul className="space-y-3">
              {article.takeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Main Content Sections */}
          <div className="space-y-10 text-slate-700 text-base leading-relaxed my-12">
            {article.content.map((sec, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {sec.heading}
                </h2>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-slate-700 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Related Articles Grid */}
          <div className="mt-20 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Related Research &amp; Playbooks
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Continue reading from the Naano Journal
                </p>
              </div>

              <Link
                href="/blog"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.slice(0, 4).map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all block group"
                >
                  <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                      {rel.topic}
                    </span>
                    <span>{rel.readTime}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug mb-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {rel.summary}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>{rel.author}</span>
                    <span className="text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-bold">
                      Read →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Action CTA Card */}
          <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#070D0A] via-[#064E3B] to-[#070D0A] border border-emerald-500/20 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl font-bold">Put these creator frameworks to work</h3>
              <p className="text-xs text-emerald-100/80 mt-1 max-w-md">
                Browse verified B2B LinkedIn creators and launch your first targeted campaign in under 10 minutes.
              </p>
            </div>
            <Link
              href="/dashboard/company/campaigns"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#070D0A] font-bold text-xs sm:text-sm transition-all shrink-0 shadow-md shadow-emerald-500/20"
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
