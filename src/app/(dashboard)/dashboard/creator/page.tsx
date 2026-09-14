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

      <main className="w-full px-6 sm:px-8 lg:px-10 pt-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <span className="text-xs font-semibold text-[#4B5563] block mb-1">
            Creator workspace
          </span>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
            Good to see you, {firstName}
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Your creator activity, at a glance.
          </p>
        </div>

        {/* 4 Metrics Cards: Strictly 4 in a single line */}
        <div className="grid grid-cols-4 gap-3.5 sm:gap-4 w-full">
          {/* 1. PUBLIC POST REACH */}
          <div className="min-w-0 bg-white border border-[#E2E8F0] rounded-[20px] p-4 sm:p-5 flex flex-col justify-between min-h-[135px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold text-[#8C95A6] uppercase tracking-wider truncate">
              <Eye className="w-3.5 h-3.5 text-[#8C95A6] shrink-0" strokeWidth={1.8} />
              <span className="truncate">Public Post Reach</span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight leading-none">
              {publicReachDisplay}
            </div>
            <p className="mt-3 text-[11px] sm:text-xs text-[#8C95A6] font-normal leading-snug">
              Waiting for public post data
            </p>
          </div>

          {/* 2. PUBLIC POSTS */}
          <div className="min-w-0 bg-white border border-[#E2E8F0] rounded-[20px] p-4 sm:p-5 flex flex-col justify-between min-h-[135px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold text-[#8C95A6] uppercase tracking-wider truncate">
              <FileText className="w-3.5 h-3.5 text-[#8C95A6] shrink-0" strokeWidth={1.8} />
              <span className="truncate">Public Posts</span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight leading-none">
              {publicPostsCount}
            </div>
            <p className="mt-3 text-[11px] sm:text-xs text-[#8C95A6] font-normal leading-snug">
              Original LinkedIn posts found
            </p>
          </div>

          {/* 3. PUBLIC ENGAGEMENTS */}
          <div className="min-w-0 bg-white border border-[#E2E8F0] rounded-[20px] p-4 sm:p-5 flex flex-col justify-between min-h-[135px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold text-[#8C95A6] uppercase tracking-wider truncate">
              <Activity className="w-3.5 h-3.5 text-[#8C95A6] shrink-0" strokeWidth={1.8} />
              <span className="truncate">Public Engagements</span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight leading-none">
              {publicEngagementsCount}
            </div>
            <p className="mt-3 text-[11px] sm:text-xs text-[#8C95A6] font-normal leading-snug">
              Reactions, comments and reposts
            </p>
          </div>

          {/* 4. LINKEDIN FOLLOWERS */}
          <div className="min-w-0 bg-white border border-[#E2E8F0] rounded-[20px] p-4 sm:p-5 flex flex-col justify-between min-h-[135px] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold text-[#8C95A6] uppercase tracking-wider truncate">
              <Users className="w-3.5 h-3.5 text-[#8C95A6] shrink-0" strokeWidth={1.8} />
              <span className="truncate">LinkedIn Followers</span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight leading-none">
              {followersDisplay}
            </div>
            <p className="mt-3 text-[11px] sm:text-xs text-[#8C95A6] font-normal leading-snug">
              Imported from the public profile
            </p>
          </div>
        </div>

        {/* Middle Two Panels: Creator Card & Launch Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Your creator card (Column 1: 5 cols out of 12) */}
          <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Your creator card</h3>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed max-w-[180px]">
                  This is how brands discover your positioning and collaboration offer.
                </p>
              </div>

              {/* Action Buttons Stack (Client Component: 3 vertically stacked buttons) */}
              <CreatorCardActions creatorId={creator?.id} />
            </div>

            {/* LinkedIn Card Preview Mockup */}
            <div className="mt-6 w-full border border-[#E2E8F0] rounded-[28px] shadow-[0_16px_40px_rgba(28,78,178,0.08)] bg-white relative pb-3">
              {/* Blue Gradient Header */}
              <div className="bg-gradient-to-r from-[#215fea] via-[#2864ea] to-[#3b82f6] h-24 p-3.5 flex items-start justify-between text-white relative rounded-t-[28px]">
                {/* LinkedIn Badge (White box with blue in logo) */}
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#0A66C2] font-bold text-xs shadow-xs">
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
                    <circle cx="317" cy="242" r="17" fill="#60A5FA" />
                  </svg>
                  <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                    naano
                  </span>
                </div>

                {/* Country Pill & Share Button */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-white/30 text-white uppercase">
                    {creatorCountry}
                  </span>
                  <CardShareIcon />
                </div>
              </div>

              {/* Creator Profile Avatar */}
              <div className="-mt-10 flex justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] text-white font-bold flex items-center justify-center text-xl overflow-hidden relative">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Creator Details */}
              <div className="text-center px-4 pt-2 pb-3">
                <h4 className="text-xl font-extrabold text-[#111827]">{fullName}</h4>
                <p className="text-xs text-[#64748B] mt-0.5 font-medium">{creatorNiche}</p>

                <p className="mt-2.5 text-xs text-[#4B5563] leading-relaxed px-3 line-clamp-2">
                  {headline}
                </p>

                {/* Post status pill */}
                <div className="flex justify-center mt-3.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-medium text-[#4B5563]">
                    <Calendar className="w-3.5 h-3.5 text-[#2864EA]" />
                    <span>{hasPostData ? `${publicPostsCount} posts synced` : 'No post data available'}</span>
                  </div>
                </div>
              </div>

              {/* Data Progress Track */}
              <div className="px-6 py-2.5 flex items-center justify-between text-xs text-[#9CA3AF] border-t border-[#F1F5F9]">
                <span className="font-semibold text-[10px]">Data</span>
                <div className="flex-1 mx-3 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div className={`h-full bg-[#2864EA] rounded-full ${hasPostData ? 'w-full' : 'w-0'}`} />
                </div>
                <span className="font-semibold text-[10px]">{hasPostData ? 'Synced' : 'Pending'}</span>
              </div>

              {/* Bottom 3 Stats Grid */}
              <div className="grid grid-cols-3 border-t border-[#F1F5F9] py-3.5 px-2 text-center bg-white rounded-b-[28px]">
                <div className="px-2">
                  <div className="text-xl font-bold text-[#111827] tracking-tight">
                    {followersDisplay}
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5 font-medium">Followers</div>
                </div>
                <div className="px-2 border-x border-[#F1F5F9]">
                  <div className="text-xl font-bold text-[#111827] tracking-tight">
                    {publicReachTotal > 0 ? publicReachDisplay : '—'}
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5 font-medium">Est. impressions</div>
                </div>
                <div className="px-2">
                  <div className="text-xl font-bold text-[#111827] tracking-tight">
                    €{pricePerPost}
                  </div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5 font-medium">Chosen cost</div>
                </div>
              </div>

              {/* Floating "More details" Pill Button overlapping bottom */}
              <div className="flex justify-center -mb-7 relative z-20">
                <Link
                  href="/dashboard/creator/profile"
                  className="inline-flex items-center gap-2 pl-4 pr-1.5 py-1.5 bg-white rounded-full border border-[#E2E8F0] shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all cursor-pointer group"
                >
                  <span className="text-xs font-bold text-[#111827]">More details</span>
                  <div className="w-6 h-6 rounded-full bg-[#2864EA] group-hover:bg-[#1e52c8] text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Panel: Your launch guide (Column 2: 7 cols out of 12) */}
          <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-[24px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] min-h-[420px]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Your launch guide</h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {completedSteps} of {totalSteps} steps complete
                </p>
              </div>

              <Link
                href="/dashboard/creator/profile"
                className="text-xs font-semibold text-[#2864EA] hover:underline"
              >
                Open card
              </Link>
            </div>

            {/* Checklist Item: Card and price ready */}
            <div className="mt-5 border border-[#E2E8F0]/80 bg-white rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center shrink-0 ${isProfileReady ? 'bg-[#10B981]' : 'bg-slate-300'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#111827]">Card and price ready</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Your positioning and offer are ready to review.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${
                  isProfileReady
                    ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {isProfileReady ? 'Complete' : 'In progress'}
                </span>
                <Link
                  href="/dashboard/creator/profile"
                  className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-white hover:bg-slate-50 flex items-center justify-center text-[#94A3B8] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chat Bubble Widget in bottom right matching screenshot */}
      <button
        type="button"
        aria-label="Support chat"
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#64748B] hover:bg-[#475569] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer z-50 hover:scale-105 active:scale-95"
      >
        <ChatBubbleIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
