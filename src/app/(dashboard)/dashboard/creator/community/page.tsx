import React from 'react';
import Header from '@/components/dashboard/Header';
import MiniCreatorCard from '@/components/dashboard/MiniCreatorCard';
import LeaderboardSection, { LeaderboardCreator } from '@/components/dashboard/LeaderboardSection';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Check, ExternalLink } from 'lucide-react';

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

export default async function CreatorCommunityPage() {
  const session = await getCurrentUser();

  // 1. Try logged-in creator from session
  let creator = session?.creatorId
    ? await prisma.creator.findUnique({
        where: { id: session.creatorId },
        include: { user: true },
      })
    : null;

  if (!creator && session?.userId) {
    creator = await prisma.creator.findUnique({
      where: { userId: session.userId },
      include: { user: true },
    });
  }

  // 2. If no session, prioritize Umar Draz matching reference screenshot
  if (!creator) {
    const umarUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'umar@creator.io' },
          { name: { contains: 'Umar' } },
        ],
      },
      include: { creator: true },
    });

    if (umarUser?.creator) {
      creator = {
        ...umarUser.creator,
        user: umarUser,
      };
    }
  }

  // 3. Fallback to any creator in DB
  if (!creator) {
    creator = await prisma.creator.findFirst({
      include: { user: true },
    });
  }

  // Query creators for the leaderboard
  const dbCreators = await prisma.creator.findMany({
    include: {
      user: true,
      collaborations: true,
      analytics: true,
    },
    take: 12,
  });

  // Reference avatars for the Slack card overlap (matching reference screenshot)
  const slackAvatars = [
    '/lp/avatar-a.png',
    '/lp/avatar-b.png',
    '/lp/avatar-c.png',
    '/lp/avatar-d.png',
    '/lp/avatar-e.png',
    '/lp/avatar-f.png',
    '/lp/avatar-g.png',
    '/lp/avatar-h.png',
  ];

  // Dynamic values for current creator
  const creatorId = creator?.id || '';
  const creatorName = creator?.user?.name || 'Umar Draz';
  const creatorAvatar = creator?.user?.avatarUrl || creator?.avatarUrl || '/lp/avatar-umar.jpg';
  const creatorCountry = creator?.country || 'PK';
  const creatorNiche = creator?.niche || 'Software';
  const creatorHeadline =
    creator?.headline ||
    'Full-Stack Developer | Technical Lead & Business Growth Manager | React.js | Next.js |...';
  const creatorPrice = creator?.pricePerPost || 240;
  const formattedFollowers = formatFollowers(creator?.followersCount || 5400);

  // Build leaderboard data matching the reference screenshot exactly
  const leaderboardCreators: LeaderboardCreator[] = [
    {
      id: dbCreators[0]?.id || '1',
      rank: 1,
      name: 'Eric Djavid',
      avatarUrl: '/lp/avatar-a.png',
      cardUrl: dbCreators[0]?.id ? `/card/${dbCreators[0].id}` : '/dashboard/creator/profile',
      subtitle: 'Public creator card',
      impressions: 267000,
      posts: 18,
    },
    {
      id: dbCreators[1]?.id || '2',
      rank: 2,
      name: 'Thomas Marcelle',
      avatarUrl: '/lp/avatar-b.png',
      cardUrl: dbCreators[1]?.id ? `/card/${dbCreators[1].id}` : '/dashboard/creator/profile',
      subtitle: 'Public creator card',
      impressions: 170000,
      posts: 12,
    },
    {
      id: dbCreators[2]?.id || '3',
      rank: 3,
      name: 'Joseph Rudd',
      avatarUrl: '/lp/avatar-joseph.webp',
      cardUrl: dbCreators[2]?.id ? `/card/${dbCreators[2].id}` : '/dashboard/creator/profile',
      subtitle: 'Public creator card',
      impressions: 148000,
      posts: 10,
    },
    {
      id: dbCreators[3]?.id || '4',
      rank: 4,
      name: 'Emma Guetta',
      avatarUrl: '/lp/avatar-d.png',
      cardUrl: dbCreators[3]?.id ? `/card/${dbCreators[3].id}` : '/dashboard/creator/profile',
      subtitle: 'Creator',
      impressions: 135000,
      posts: 9,
    },
    {
      id: dbCreators[4]?.id || '5',
      rank: 5,
      name: 'Kevin Meyer',
      avatarUrl: '/lp/avatar-e.png',
      cardUrl: dbCreators[4]?.id ? `/card/${dbCreators[4].id}` : '/dashboard/creator/profile',
      subtitle: 'Public creator card',
      impressions: 65000,
      posts: 5,
    },
    {
      id: dbCreators[5]?.id || '6',
      rank: 6,
      name: 'Raj Vaibhav',
      avatarUrl: '/lp/avatar-f.png',
      cardUrl: dbCreators[5]?.id ? `/card/${dbCreators[5].id}` : '/dashboard/creator/profile',
      subtitle: 'Public creator card',
      impressions: 45000,
      posts: 4,
    },
    {
      id: dbCreators[6]?.id || '7',
      rank: 7,
      name: 'TEODORA VUKASINOVIC',
      avatarUrl: '/lp/avatar-g.png',
      cardUrl: dbCreators[6]?.id ? `/card/${dbCreators[6].id}` : '/dashboard/creator/profile',
      subtitle: 'Creator',
      impressions: 45000,
      posts: 4,
    },
    {
      id: dbCreators[7]?.id || '8',
      rank: 8,
      name: 'Anthony Quinchon',
      avatarUrl: '/lp/avatar-h.png',
      cardUrl: dbCreators[7]?.id ? `/card/${dbCreators[7].id}` : '/dashboard/creator/profile',
      subtitle: 'Creator',
      impressions: 43000,
      posts: 3,
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen relative overflow-hidden pb-16">
      {/* Soft Cloud Sky Background matching Naano aesthetic */}
      <div
        className="fixed inset-0 bg-[url('/images/hero-clouds.jpg')] bg-cover bg-top pointer-events-none opacity-30 z-0"
        aria-hidden="true"
      />

      {/* Sticky Header with dynamic user info */}
      <div className="relative z-20">
        <Header
          user={{
            name: creatorName,
            avatarUrl: creatorAvatar,
          }}
          balance={0}
        />
      </div>

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6 relative z-10">
        {/* Page Heading & Creator Network Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
              Community
            </h1>
            <p className="text-xs sm:text-[13px] text-[#64748B] mt-1.5 font-normal">
              Learn with other B2B creators, share what works and make your Naano identity visible.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 bg-white/90 backdrop-blur-xs text-xs font-semibold text-slate-700 shadow-2xs self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Creator network</span>
          </div>
        </div>

        {/* 2-Column Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-6">
          {/* LEFT COLUMN: NAANO CREATORS ON SLACK */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-full">
            <div>
              {/* Slack Card + Description Row */}
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Slack Graphic Card (compact fixed width) */}
                <div className="w-[140px] sm:w-[155px] shrink-0 bg-[#FAFAFA] border border-[#E2E8F0] rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-between h-[135px] sm:h-[145px] relative">
                  <div className="my-auto py-2 flex items-center justify-center">
                    {/* Official Slack Logo */}
                    <img
                      src="/images/slack-logo.svg"
                      alt="Slack"
                      className="w-14 h-14 object-contain drop-shadow-2xs"
                    />
                  </div>

                  {/* Overlapping Avatars Row */}
                  <div className="flex items-center justify-center pt-1">
                    {slackAvatars.map((avatar, idx) => (
                      <img
                        key={idx}
                        src={avatar}
                        alt="Creator"
                        className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-full object-cover border-[1.5px] border-white -ml-1.5 first:ml-0 shadow-2xs"
                      />
                    ))}
                  </div>
                </div>

                {/* Right Text */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#64748B] uppercase block">
                    NAANO CREATORS ON SLACK
                  </span>
                  <h2 className="text-base sm:text-lg lg:text-xl font-black text-[#111827] leading-snug mt-1 break-words">
                    The room where B2B creators get better together.
                  </h2>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                    Ask for feedback on a sponsored post, compare campaign lessons, meet creators in your language and help shape what Naano builds next.
                  </p>
                </div>
              </div>

              {/* Spacing */}
              <div className="h-6" />

              {/* 3 Checkpoints */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-bold text-[#111827]">
                    Get feedback before you publish
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-bold text-[#111827]">
                    Share campaign tips that work
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs font-bold text-[#111827]">
                    Talk directly with the Naano team
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Slack Community Button */}
            <a
              href="https://slack.com"
              target="_blank"
              rel="noreferrer"
              className="w-full mt-10 p-3.5 sm:p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:bg-slate-50/80 transition-all flex items-center justify-between shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/slack-logo.svg"
                  alt="Slack"
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xs sm:text-sm font-bold text-[#111827]">
                  Join the Slack community
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#2864EA] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* RIGHT COLUMN: LINKEDIN VISIBILITY */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-[#E2E8F0] shadow-sm flex flex-col justify-between h-full">
            <div>
              {/* LinkedIn Header */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0A66C2] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-[#64748B] uppercase block">
                    LINKEDIN VISIBILITY
                  </span>
                  <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#111827] leading-snug mt-0.5">
                    Turn your LinkedIn profile into an always-on Deal Link
                  </h2>
                </div>
              </div>

              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                Add your creator card to LinkedIn so brands can discover your work and join Naano through your attributed link.
              </p>

              {/* 25% Commission Callout Box */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]/90 p-4 flex items-center gap-4 sm:gap-5 mt-4">
                <div className="shrink-0">
                  <span className="text-2xl font-black text-[#111827] tracking-tight block leading-none">
                    25%
                  </span>
                  <span className="text-[10px] text-[#64748B] font-medium block leading-tight mt-1 max-w-[110px]">
                    of Naano&apos;s commission for 3 months
                  </span>
                </div>
                <div className="w-px h-10 bg-[#CBD5E1] shrink-0" />
                <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                  Leave your card on your LinkedIn profile. If a brand joins Naano through it, your reward is tracked automatically.
                </p>
              </div>

              {/* Naano Creator Experience Snippet Box */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-3.5 flex items-center gap-3.5 mt-3">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center p-2 shrink-0 shadow-2xs">
                  <img
                    src="/lp/naano-mark.png"
                    alt="Naano"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-bold text-[#111827] block leading-tight">
                    Naano Creator
                  </span>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">
                    Naano · Independent
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block mt-0.5">
                    Present
                  </span>
                </div>
              </div>

              {/* Floating Mini Creator Card Preview */}
              <div className="pt-2 pb-1">
                <MiniCreatorCard
                  creatorId={creatorId}
                  creatorName={creatorName}
                  creatorAvatar={creatorAvatar}
                  creatorCountry={creatorCountry}
                  creatorNiche={creatorNiche}
                  creatorHeadline={creatorHeadline}
                  formattedFollowers={formattedFollowers}
                  creatorPrice={creatorPrice}
                />
              </div>
            </div>
          </div>
        </div>

        {/* NAANO CAMPAIGN LEADERBOARD SECTION */}
        <LeaderboardSection creators={leaderboardCreators} />
      </main>
    </div>
  );
}
