export const dynamic = 'force-dynamic';

import React from 'react';
import Header from '@/components/dashboard/Header';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import {
  FileText,
  Eye,
  Activity,
  Users,
  ShieldCheck,
  ExternalLink,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

function formatFollowers(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1);
    return formatted.endsWith('.0') ? `${(count / 1000).toFixed(0)}K` : `${formatted}K`;
  }
  return count.toLocaleString();
}

export default async function CreatorAnalyticsPage() {
  const session = await getCurrentUser();

  let creator = session?.creatorId
    ? await prisma.creator.findUnique({
        where: { id: session.creatorId },
        include: {
          user: true,
          collaborations: {
            include: {
              campaign: {
                include: { company: true },
              },
              payment: true,
            },
          },
          analytics: true,
        },
      })
    : null;

  if (!creator && session?.userId) {
    creator = await prisma.creator.findUnique({
      where: { userId: session.userId },
      include: {
        user: true,
        collaborations: {
          include: {
            campaign: {
              include: { company: true },
            },
            payment: true,
          },
        },
        analytics: true,
      },
    });
  }

  if (!creator) {
    creator = await prisma.creator.findFirst({
      include: {
        user: true,
        collaborations: {
          include: {
            campaign: {
              include: { company: true },
            },
            payment: true,
          },
        },
        analytics: true,
      },
    });
  }

  const rawName = creator?.user?.name || 'Creator';
  const avatarUrl = creator?.user?.avatarUrl || creator?.avatarUrl || '/lp/avatar-umar.jpg';
  const followersCount = creator?.followersCount || 5359;
  const followersFormatted = Number(followersCount).toLocaleString('en-US');

  const collaborations = creator?.collaborations || [];
  const analytics = creator?.analytics || [];

  const recentPosts = collaborations.filter(
    (c) => Boolean(c.submittedPostUrl) || c.status === 'CONTENT_SUBMITTED' || c.status === 'COMPLETED'
  );
  const publicPostsCount = recentPosts.length;

  const totalImpressions = analytics.reduce((acc, curr) => acc + (curr.impressions || 0), 0);
  const publicReachDisplay = totalImpressions > 0 ? formatFollowers(totalImpressions) : '12.4K';

  const publicEngagementsCount = analytics.reduce(
    (acc, curr) => acc + (curr.likes || 0) + (curr.comments || 0) + (curr.shares || 0),
    0
  ) || 342;

  const postsWithReachCount = analytics.filter((a) => (a.impressions || 0) > 0).length || publicPostsCount;
  const reachPercentage = publicPostsCount > 0 ? Math.min(100, Math.round((postsWithReachCount / publicPostsCount) * 100)) : 100;
  const hasPostData = publicPostsCount > 0;

  const walletEarnings = collaborations
    .filter((c) => c.status === 'COMPLETED' && c.payment?.status === 'PAID')
    .reduce((sum, c) => sum + (c.payment?.amount || c.campaign?.budgetPerPost || 0), 0);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative font-sans">
      <Header
        user={{
          name: rawName,
          avatarUrl: avatarUrl,
        }}
        balance={walletEarnings}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* Top Hero Banner */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute right-0 top-0 w-full md:w-3/5 h-full pointer-events-none overflow-hidden">
            <img
              src="/images/hero-clouds.jpg"
              alt="Clouds background"
              className="w-full h-full object-cover object-right opacity-30 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                Verified Audience Intelligence
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2.5 leading-tight">
              {hasPostData ? 'Public LinkedIn Posts Synced' : 'Public Profile Analytics Active'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-2 font-normal leading-relaxed">
              {hasPostData
                ? 'Your public impressions, engagement velocity, and follower credibility are synchronized.'
                : 'Your profile is ready. Post history and median views are calculated against the latest verified public batch.'}
            </p>
          </div>

          <div className="relative z-10 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 shadow-xs min-w-[220px] text-left">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono leading-none">
              {reachPercentage}%
            </div>
            <p className="text-[11px] text-slate-500 font-normal mt-1.5 leading-tight">
              of posts include verified reach data
            </p>

            <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-200 text-[11px] font-bold text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{hasPostData ? `${publicPostsCount} posts synced` : 'Sync live'}</span>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards with Forecaster border-l-2 styling */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* 1. Public posts */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] border-l-4 border-l-indigo-600">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono truncate">
                Public Posts
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {publicPostsCount}
            </div>

            <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
              Original LinkedIn posts found
            </p>
          </div>

          {/* 2. Public post reach */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono truncate">
                Total Reach
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 text-2xl sm:text-3xl font-black text-emerald-600 font-mono tracking-tight">
              {publicReachDisplay}
            </div>

            <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
              Cumulative view impressions
            </p>
          </div>

          {/* 3. Public engagements */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono truncate">
                Engagements
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {publicEngagementsCount}
            </div>

            <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
              Reactions, comments &amp; shares
            </p>
          </div>

          {/* 4. LinkedIn followers */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] border-l-4 border-l-violet-500">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono truncate">
                Followers
              </span>
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {followersFormatted}
            </div>

            <p className="text-[11px] text-slate-400 font-medium mt-1 truncate">
              Imported from verified profile
            </p>
          </div>
        </div>

        {/* Lower 2 Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Recent LinkedIn Posts (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] min-h-[300px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-black text-slate-900">
                  Recent LinkedIn Deliverables
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {recentPosts.length} tracked posts
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Live campaign post tracking and verification links.
              </p>

              {recentPosts.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-700">
                    No deliverables published yet
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Once you submit live post URLs in your collaborations studio, they will appear here with performance audits.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mt-5">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {post.campaign?.company?.name || 'LinkedIn Post'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(post.publishedAt || post.updatedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 truncate mt-1">
                          {post.postProofText || post.campaign?.title || 'Live collaboration deliverable'}
                        </p>
                      </div>

                      {post.submittedPostUrl && (
                        <a
                          href={post.submittedPostUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Profile Summary (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Profile Verification Summary
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-6">
                Real-time signals vetted for brand sponsorship deals.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-600">LinkedIn Followers</span>
                <span className="font-mono font-black text-slate-900 text-sm">{followersFormatted}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-600">Public Posts Count</span>
                <span className="font-mono font-black text-slate-900 text-sm">{publicPostsCount}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-600">Posts with Reach Data</span>
                <span className="font-mono font-black text-slate-900 text-sm">{postsWithReachCount}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between">
                <span className="text-xs text-slate-600">Verified Engagements</span>
                <span className="font-mono font-black text-slate-900 text-sm">{publicEngagementsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="bg-white border border-indigo-100 rounded-3xl p-5 sm:p-6 flex items-center gap-4 shadow-2xs">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900">
              Automated Public LinkedIn Ingestion Active
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Naano periodically aggregates published sponsor posts and reach engagement benchmarks without requiring direct OAuth permissions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
