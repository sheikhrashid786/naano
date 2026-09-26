export const dynamic = 'force-dynamic';

import React from 'react';
import Header from '@/components/dashboard/Header';
import CreatorCardActions from '@/components/dashboard/CreatorCardActions';
import CardShareIcon from '@/components/dashboard/CardShareIcon';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Eye,
  FileText,
  Activity,
  Users,
  CheckCircle2,
  ChevronRight,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import CreatorSyncButton from '@/components/dashboard/CreatorSyncButton';
import EscrowMilestoneStepper from '@/components/dashboard/EscrowMilestoneStepper';

function ChatBubbleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.94 2 11.8c0 2.76 1.44 5.22 3.7 6.8-.24 1.42-.98 2.68-1.02 2.75-.12.22-.05.49.16.63.1.07.22.1.34.1.1 0 .2-.03.29-.08 2.1-1.22 3.8-2.22 4.34-2.54.71.16 1.45.24 2.19.24 5.523 0 10-3.94 10-8.8S17.523 3 12 3z" />
    </svg>
  );
}

function optimizeAvatarUrl(url?: string | null): string {
  if (!url) return '/lp/avatar-umar.jpg';
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('crop', 'faces');
      parsed.searchParams.set('fit', 'crop');
      parsed.searchParams.set('w', '300');
      parsed.searchParams.set('h', '300');
      return parsed.toString();
    } catch {
      return url;
    }
  }
  return url;
}

function formatFollowers(count: number): string {
  if (!count || count <= 0) return '0';
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1);
    return formatted.endsWith('.0') ? `${(count / 1000).toFixed(0)}K` : `${formatted}K`;
  }
  return count.toLocaleString();
}

export default async function CreatorOverviewPage() {
  const session = await getCurrentUser();

  // Find creator for current user session, or fallback to first creator
  let creator = session?.creatorId
    ? await prisma.creator.findUnique({
        where: { id: session.creatorId },
        include: {
          user: true,
          collaborations: {
            include: {
              campaign: true,
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
            campaign: true,
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
            campaign: true,
            payment: true,
          },
        },
        analytics: true,
      },
    });
  }

  // Dynamic values directly from DB
  const rawName = creator?.user?.name || 'Umar Draz';
  const firstName = rawName.split(' ')[0] || 'Umar';
  const fullName = rawName;
  const creatorNiche = creator?.niche || 'Software';
  const creatorCountry = creator?.country || 'FR';
  const rawAvatar = creator?.user?.avatarUrl || creator?.avatarUrl || '/lp/avatar-umar.jpg';
  const avatarUrl = optimizeAvatarUrl(rawAvatar);
  const headline =
    creator?.headline ||
    'Full-Stack Developer | Technical Lead & Business Growth Manager | React.js | Next.js | Node.js | Laravel...';
  
  const followersCount = creator?.followersCount || 5400;
  const followersDisplay = formatFollowers(followersCount);
  const pricePerPost = creator?.pricePerPost || 240;

  // Dynamic calculations from collaborations & analytics
  const collaborations = creator?.collaborations || [];
  const analytics = creator?.analytics || [];

  const publicReachTotal = analytics.reduce((acc, a) => acc + (a.impressions || 0), 0);
  const publicReachDisplay = publicReachTotal > 0 ? formatFollowers(publicReachTotal) : '—';

  const publicPostsCount = collaborations.filter(
    (c) => c.status === 'COMPLETED' || c.status === 'CONTENT_SUBMITTED' || c.submittedPostUrl
  ).length;

  const publicEngagementsCount = collaborations.reduce(
    (acc, c) => acc + (c.clicksCount || 0) + (c.leadsCount || 0),
    0
  );

  const walletEarnings = collaborations.reduce((acc, c) => {
    if (c.payment?.status === 'PAID') {
      return acc + (c.payment.amount || 0);
    }
    return acc;
  }, 0);

  const isProfileReady = Boolean(creator?.headline && (creator?.pricePerPost ?? 0) > 0);
  const totalSteps = 1;
  const completedSteps = isProfileReady ? 1 : 0;
  const hasPostData = publicPostsCount > 0 || publicReachTotal > 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-16 relative font-sans">
      {/* Top Header: Sticky at the top with dynamic wallet balance and user data */}
      <Header
        balance={walletEarnings}
        user={{ name: fullName, avatarUrl }}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 pt-6 space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Creator Workspace & Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Good to see you, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Track your audience reach, public creator profile, and verified brand sponsorship pipeline in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/creator/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-bold text-slate-800 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
            >
              <span>Edit Card & Rates</span>
            </Link>
            <Link
              href="/dashboard/creator/collaborations"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer"
            >
              <span>View Collaborations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Forecaster Luxury Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
          {/* 1. PUBLIC POST REACH */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between group">
            <div className="border-l-2 border-blue-500 pl-3.5 py-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Public Post Reach
                </span>
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono mt-2">
                {publicReachDisplay}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>Audience impressions</span>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Live</span>
            </div>
          </div>

          {/* 2. PUBLIC POSTS */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between group">
            <div className="border-l-2 border-indigo-500 pl-3.5 py-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Public Posts
                </span>
                <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono mt-2">
                {publicPostsCount}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>Original posts found</span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Synced</span>
            </div>
          </div>

          {/* 3. PUBLIC ENGAGEMENTS */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between group">
            <div className="border-l-2 border-violet-500 pl-3.5 py-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Public Engagements
                </span>
                <div className="w-7 h-7 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono mt-2">
                {publicEngagementsCount}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>Reactions & comments</span>
              <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">Indexed</span>
            </div>
          </div>

          {/* 4. LINKEDIN FOLLOWERS */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between group">
            <div className="border-l-2 border-emerald-500 pl-3.5 py-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  LinkedIn Followers
                </span>
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono mt-2">
                {followersDisplay}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>Public profile verified</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Active</span>
            </div>
          </div>
        </div>

        {/* Middle Two Panels: Creator Card & Launch Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Your creator card (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/80 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Public Media Kit</span>
                </div>
                <h3 className="text-base font-black text-slate-900">Your Creator Card</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  How verified brands view your audience & pricing.
                </p>
              </div>

              {/* Action Buttons Stack */}
              <CreatorCardActions creatorId={creator?.id} />
            </div>

            {/* LinkedIn Card Preview Mockup */}
            <div className="mt-6 w-full border border-slate-200/90 rounded-3xl shadow-[0_12px_36px_-6px_rgba(5,150,105,0.08)] bg-white relative pb-3 overflow-hidden">
              {/* Luxury Obsidian Forest Header */}
              <div className="bg-gradient-to-r from-[#070D0A] via-[#064E3B] to-[#070D0A] h-24 p-3.5 flex items-start justify-between text-white relative">
                {/* LinkedIn Badge */}
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#0A66C2] font-bold text-xs shadow-sm">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z" />
                  </svg>
                </div>

                {/* White Naano Logo */}
                <div className="flex items-center gap-1.5 text-white">
                  <svg width="18" height="18" viewBox="0 0 334 259" fill="none">
                    <path
                      d="M0 45C0 20.1472 20.1472 0 45 0H144.5C209.947 0 263 53.0533 263 118.5C263 133.964 250.464 146.5 235 146.5H135.5C70.0533 146.5 17 93.4467 17 28"
                      fill="white"
                    />
                    <path
                      d="M334 214C334 238.853 313.853 259 289 259H189.5C124.053 259 71 205.947 71 140.5C71 125.036 83.536 112.5 99 112.5H198.5C263.947 112.5 317 165.553 317 231"
                      fill="white"
                    />
                    <circle cx="317" cy="242" r="17" fill="#10B981" />
                  </svg>
                  <span className="font-extrabold text-base tracking-tight text-white font-sans">
                    naano
                  </span>
                </div>

                {/* Country Pill & Share Button */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/30 text-white uppercase tracking-wider">
                    {creatorCountry}
                  </span>
                  <CardShareIcon />
                </div>
              </div>

              {/* Creator Profile Avatar */}
              <div className="-mt-10 flex justify-center">
                <div className="w-20 h-20 rounded-full ring-4 ring-white shadow-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-xl overflow-hidden relative">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Creator Details */}
              <div className="text-center px-5 pt-2 pb-3">
                <h4 className="text-lg font-black text-slate-900">{fullName}</h4>
                <div className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                  {creatorNiche}
                </div>

                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed px-2 line-clamp-2">
                  {headline}
                </p>

                {/* Post status pill & manual sync trigger */}
                <div className="flex items-center justify-center gap-2 mt-3.5 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{hasPostData ? `${publicPostsCount} verified posts synced` : 'No post data available'}</span>
                  </div>
                  <CreatorSyncButton />
                </div>
              </div>

              {/* Data Progress Track */}
              <div className="px-6 py-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                <span className="font-semibold text-[10px] uppercase tracking-wider">Profile Sync</span>
                <div className="flex-1 mx-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-emerald-600 rounded-full transition-all ${hasPostData ? 'w-full' : 'w-1/3'}`} />
                </div>
                <span className="font-semibold text-[10px] text-emerald-700">{hasPostData ? '100% Synced' : 'Ready'}</span>
              </div>

              {/* Bottom 3 Stats Grid */}
              <div className="grid grid-cols-3 border-t border-slate-100 py-3 px-2 text-center bg-slate-50/50">
                <div className="px-2">
                  <div className="text-lg font-black text-slate-900 font-mono tracking-tight">
                    {followersDisplay}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Followers</div>
                </div>
                <div className="px-2 border-x border-slate-200/80">
                  <div className="text-lg font-black text-slate-900 font-mono tracking-tight">
                    {publicReachTotal > 0 ? publicReachDisplay : '—'}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Est. Reach</div>
                </div>
                <div className="px-2">
                  <div className="text-lg font-black text-slate-900 font-mono tracking-tight">
                    €{pricePerPost}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Rate / Post</div>
                </div>
              </div>

              {/* Floating "More details" Pill Button overlapping bottom */}
              <div className="flex justify-center -mb-5 mt-2 relative z-20">
                <Link
                  href="/dashboard/creator/profile"
                  className="inline-flex items-center gap-2 pl-4 pr-1.5 py-1.5 bg-white rounded-full border border-slate-200 shadow-md hover:shadow-lg transition-all cursor-pointer group text-xs font-bold text-slate-800"
                >
                  <span>Edit profile details</span>
                  <div className="w-6 h-6 rounded-full bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Panel: Your launch guide & collaborations pipeline (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Checklist & Launch Guide */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 mb-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Profile Readiness Checklist</span>
                  </div>
                  <h3 className="text-base font-black text-slate-900">Your Launch Guide</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete these key milestones to maximize sponsor match rates.
                  </p>
                </div>

                <Link
                  href="/dashboard/creator/profile"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Manage Profile
                </Link>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-700">Setup Progress</span>
                  <span className="font-mono font-bold text-emerald-600">{isProfileReady ? '100%' : '50%'} Complete</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-emerald-500 rounded-full transition-all duration-500 ${
                      isProfileReady ? 'w-full' : 'w-1/2'
                    }`}
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="mt-5 space-y-3">
                {/* 1. Card & Price Ready */}
                <div className="border border-slate-200/80 bg-slate-50/50 hover:bg-white rounded-2xl p-4 flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-8 h-8 rounded-xl text-white flex items-center justify-center shrink-0 ${isProfileReady ? 'bg-emerald-500 shadow-xs' : 'bg-slate-300'}`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Card & Sponsorship Rate Ready</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Your positioning, bio, and chosen post pricing (€{pricePerPost}) are set.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                      isProfileReady
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {isProfileReady ? 'Completed' : 'Action needed'}
                    </span>
                    <Link
                      href="/dashboard/creator/profile"
                      className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* 2. LinkedIn Feed Sync */}
                <div className="border border-slate-200/80 bg-slate-50/50 hover:bg-white rounded-2xl p-4 flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">LinkedIn Post Insights Synced</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {publicPostsCount > 0 ? `${publicPostsCount} posts indexed to estimate impression velocity.` : 'Automated sync pending recent LinkedIn publications.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full border bg-teal-50 text-teal-800 border-teal-200">
                      {publicPostsCount > 0 ? 'Active' : 'Standby'}
                    </span>
                    <Link
                      href="/dashboard/creator/profile"
                      className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* 3. Escrow Payout Wallet */}
                <div className="border border-slate-200/80 bg-slate-50/50 hover:bg-white rounded-2xl p-4 flex items-center justify-between gap-4 transition-all">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Naano Escrow Guarantee Protection</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Payments are funded into escrow upfront before posts go live.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200">
                      Protected
                    </span>
                    <Link
                      href="/dashboard/creator/collaborations"
                      className="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Collaborations Overview Box */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Active Brand Pipeline</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct collaboration requests and confirmed deliverables.
                  </p>
                </div>
                <Link
                  href="/dashboard/creator/collaborations"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  All ({collaborations.length})
                </Link>
              </div>

              {/* Escrow Guarantee 5-Stage Visual Stepper */}
              <div className="mb-5">
                <EscrowMilestoneStepper
                  status={collaborations[0]?.status || 'IN_PROGRESS'}
                  paymentStatus={collaborations[0]?.payment?.status || 'PENDING'}
                />
              </div>

              {collaborations.length > 0 ? (
                <div className="space-y-3">
                  {collaborations.slice(0, 3).map((collab) => (
                    <div
                      key={collab.id}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {(collab.campaign as any)?.title || (collab.campaign as any)?.name || 'LinkedIn Thought Leadership Post'}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Status: <span className="font-semibold text-slate-700">{collab.status}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-black text-emerald-600 font-mono">
                            €{collab.payment?.amount || pricePerPost}
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            {collab.payment?.status === 'PAID' ? 'Released' : 'Escrow secured'}
                          </span>
                        </div>
                      </div>

                      {/* Compact 5-stage progress indicator */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <EscrowMilestoneStepper
                          status={collab.status}
                          paymentStatus={collab.payment?.status}
                          compact={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center bg-slate-50/40">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center mb-2.5">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                    Your profile is active in brand discovery
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                    Companies searching for {creatorNiche} voices can invite you directly. When a brand sends an offer, you will receive an instant notification here.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <Link
                      href="/dashboard/creator/profile"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      Refine Keywords & Bio
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat Bubble Widget in bottom right */}
      <button
        type="button"
        aria-label="Support chat"
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-slate-900 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:shadow-emerald-600/25 transition-all cursor-pointer z-50 hover:scale-105 active:scale-95"
      >
        <ChatBubbleIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
