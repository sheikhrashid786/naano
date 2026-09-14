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
  ExternalLink
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

  // Find creator for current user session, or fallback to first creator
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

  // Dynamic user data
  const rawName = creator?.user?.name || 'Umar Draz';
  const avatarUrl = creator?.user?.avatarUrl || creator?.avatarUrl || '/lp/avatar-umar.jpg';
  const followersCount = creator?.followersCount || 5359;
  const followersFormatted = Number(followersCount).toLocaleString('en-US');

  // Dynamic collaborations & analytics
  const collaborations = creator?.collaborations || [];
  const analytics = creator?.analytics || [];

  // 1. Public posts count (collaborations with submitted post URL or content submitted/completed)
  const recentPosts = collaborations.filter(
    (c) => Boolean(c.submittedPostUrl) || c.status === 'CONTENT_SUBMITTED' || c.status === 'COMPLETED'
  );
  const publicPostsCount = recentPosts.length;

  // 2. Public reach (impressions recorded in analytics or collaborations)
  const publicReachTotal = analytics.reduce((acc, a) => acc + (a.impressions || 0), 0);
  const publicReachDisplay = publicReachTotal > 0 ? formatFollowers(publicReachTotal) : 'Pending';

  // 3. Public engagements count (clicks + leads or reactions)
  const publicEngagementsCount = collaborations.reduce(
    (acc, c) => acc + (c.clicksCount || 0) + (c.leadsCount || 0),
    0
  );

  // 4. Posts with reach data
  const postsWithReachCount = analytics.filter((a) => (a.impressions || 0) > 0).length;
  const reachPercentage = publicPostsCount > 0
    ? Math.min(100, Math.round((postsWithReachCount / publicPostsCount) * 100))
    : 0;

  // 5. Dynamic wallet earnings for header
  const walletEarnings = collaborations.reduce((acc, c) => {
    if (c.payment?.status === 'PAID') {
      return acc + (c.payment.amount || 0);
    }
    return acc;
  }, 0);

  const hasPostData = publicPostsCount > 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Sticky Top Header with dynamic wallet & profile */}
      <Header
        user={{
          name: rawName,
          avatarUrl: avatarUrl,
        }}
        balance={walletEarnings}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        {/* Top Hero Cloud Banner: PUBLIC LINKEDIN SNAPSHOT */}
        <div className="bg-white border border-[#E2E8F0] rounded-[28px] p-6 sm:p-8 relative overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Cloud Background Graphic on the right half */}
          <div className="absolute right-0 top-0 w-full md:w-3/5 h-full pointer-events-none overflow-hidden">
            <img
              src="/images/hero-clouds.jpg"
              alt="Clouds background"
              className="w-full h-full object-cover object-right opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
          </div>

          {/* Left Column Content */}
          <div className="relative z-10 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                Public LinkedIn Snapshot
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mt-2.5 leading-tight">
              {hasPostData ? 'Public LinkedIn posts imported' : 'Public LinkedIn posts are being imported'}
            </h1>

            <p className="text-xs sm:text-[13px] text-[#64748B] mt-2 font-normal leading-relaxed">
              {hasPostData
                ? 'Your public LinkedIn analytics and campaign reach metrics are synced.'
                : 'The profile is ready. Post history and reach will appear after the public-data job completes.'}
            </p>
          </div>

          {/* Right Column Metric Card */}
          <div className="relative z-10 bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-xs min-w-[220px] text-left md:text-left">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight leading-none">
              {reachPercentage}%
            </div>
            <p className="text-[11px] text-[#64748B] font-normal mt-1.5 leading-tight">
              of imported posts include reach data
            </p>

            <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 rounded-full border border-[#E2E8F0] text-[11px] font-semibold text-[#334155] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span>{hasPostData ? `${publicPostsCount} public posts synced` : 'No public post found yet'}</span>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards: Strictly 4 in a single row */}
        <div className="grid grid-cols-4 gap-3.5 sm:gap-4 w-full">
          {/* 1. Public posts */}
          <div className="min-w-0 bg-white border border-[#E2E8F0] rounded-[20px] p-4 sm:p-5 flex flex-col justify-between min-h-[135px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#64748B] truncate">Public posts</span>
              <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] text-[#2864EA] flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="my-2 text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight leading-none truncate">
              {publicPostsCount}
            </div>

            <p className="text-[11px] text-[#8C95A6] font-normal truncate">
              Original LinkedIn posts found
            </p>
          </div>

          {/* 2. Public post reach */}
          <div className="min-w-0 bg-white border border-[#E2E8F0] rounded-[20px] p-4 sm:p-5 flex flex-col justify-between min-h-[135px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#64748B] truncate">Public post reach</span>
              <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] text-[#2864EA] flex items-center justify-center shrink-0 shadow-2xs">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="my-2 text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight leading-none truncate">
              {publicReachDisplay}
            </div>

            <p className="text-[11px] text-[#8C95A6] font-normal truncate">
              Waiting for public post data
            </p>
          </div>

          {/* 3. Public engagements */}
          <div className="min-w-0 bg-white border border-[#E2E8F0] rounded-[20px] p-4 sm:p-5 flex flex-col justify-between min-h-[135px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#64748B] truncate">Public engagements</span>
              <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] text-[#2864EA] flex items-center justify-center shrink-0 shadow-2xs">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="my-2 text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight leading-none truncate">
              {publicEngagementsCount}
            </div>

            <p className="text-[11px] text-[#8C95A6] font-normal truncate">
              Reactions, comments and reposts
            </p>
          </div>

          {/* 4. LinkedIn followers */}
          <div className="min-w-0 bg-white border border-[#E2E8F0] rounded-[20px] p-4 sm:p-5 flex flex-col justify-between min-h-[135px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-[#64748B] truncate">LinkedIn followers</span>
              <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] text-[#2864EA] flex items-center justify-center shrink-0 shadow-2xs">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="my-2 text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight leading-none truncate">
              {followersFormatted}
            </div>

            <p className="text-[11px] text-[#8C95A6] font-normal truncate">
              Imported from the public profile
            </p>
          </div>
        </div>

        {/* Lower 2 Panels: Recent Posts & Profile Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Recent LinkedIn Posts (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] min-h-[290px] flex flex-col justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                Recent LinkedIn posts
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Open the original post on LinkedIn.
              </p>
            </div>

            {/* Empty State or Dynamic Posts list */}
            {recentPosts.length === 0 ? (
              <div className="py-14 text-center">
                <h4 className="text-xs sm:text-sm font-bold text-[#475569]">
                  Public post import in progress
                </h4>
                <p className="text-xs text-[#8C95A6] mt-1 max-w-sm mx-auto">
                  The first public LinkedIn posts will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#111827] truncate">
                          {post.campaign?.company?.name || 'LinkedIn Post'}
                        </span>
                        <span className="text-[10px] text-[#64748B]">
                          {new Date(post.publishedAt || post.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] truncate mt-1">
                        {post.postProofText || post.campaign?.title || 'Live collaboration deliverable'}
                      </p>
                    </div>

                    {post.submittedPostUrl && (
                      <a
                        href={post.submittedPostUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#2864EA] hover:bg-blue-50 transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div />
          </div>

          {/* Right Panel: Public Profile Summary (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                Public profile summary
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5 mb-5">
                Automatically collected from public LinkedIn data.
              </p>
            </div>

            {/* Dynamic Metric Rows */}
            <div className="space-y-0">
              {/* LinkedIn followers */}
              <div className="pb-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">LinkedIn followers</span>
                  <span className="font-bold text-[#111827]">{followersFormatted}</span>
                </div>
                {/* Light Blue/Purple Progress Bar */}
                <div className="h-1 bg-[#A5B4FC]/50 rounded-full w-full mt-2" />
              </div>

              {/* Public posts */}
              <div className="border-t border-[#F1F5F9] py-3.5 flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Public posts</span>
                <span className="font-bold text-[#111827]">{publicPostsCount}</span>
              </div>

              {/* Posts with reach data */}
              <div className="border-t border-[#F1F5F9] py-3.5 flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Posts with reach data</span>
                <span className="font-bold text-[#111827]">{postsWithReachCount}</span>
              </div>

              {/* Public engagements */}
              <div className="border-t border-[#F1F5F9] py-3.5 flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Public engagements</span>
                <span className="font-bold text-[#111827]">{publicEngagementsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Bar: Public LinkedIn data is being prepared */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2864EA] flex items-center justify-center shrink-0 border border-blue-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#111827]">
              Public LinkedIn data is being prepared
            </h4>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Naano is collecting the creator&apos;s recent public posts. No personal LinkedIn connection is required.
            </p>
          </div>
        </div>
      </main>

      {/* Floating Support Chat Widget */}
      <button
        type="button"
        aria-label="Support chat"
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#64748B] hover:bg-[#475569] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer z-50 hover:scale-105 active:scale-95"
      >
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.477 3 2 6.94 2 11.8c0 2.76 1.44 5.22 3.7 6.8-.24 1.42-.98 2.68-1.02 2.75-.12.22-.05.49.16.63.1.07.22.1.34.1.1 0 .2-.03.29-.08 2.1-1.22 3.8-2.22 4.34-2.54.71.16 1.45.24 2.19.24 5.523 0 10-3.94 10-8.8S17.523 3 12 3z" />
        </svg>
      </button>
    </div>
  );
}
