import React from 'react';
import Header from '@/components/dashboard/Header';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Users,
  MessageSquare,
  Sparkles,
  Trophy,
  ExternalLink,
  Flame,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default async function CreatorCommunityPage() {
  const session = await getCurrentUser();
  if (!session?.creatorId) return null;

  const creator = await prisma.creator.findUnique({
    where: { id: session.creatorId },
    include: {
      user: true,
    },
  });

  const creatorName = creator?.user.name || 'Creator';
  const avatarUrl = creator?.user.avatarUrl || null;

  // Top Creators Leaderboard Mockup/Real Data
  const topCreators = [
    { rank: 1, name: 'Vincent Nguyen', niche: 'B2B Growth & Outbound', followers: '48.5K', clicks: '14,200', score: 98 },
    { rank: 2, name: 'Sarah Alverez', niche: 'AI & Automation', followers: '36.2K', clicks: '11,850', score: 96 },
    { rank: 3, name: 'David Zmirov', niche: 'Founder & Sales Tech', followers: '29.4K', clicks: '9,400', score: 95 },
    { rank: 4, name: 'Marina Geller', niche: 'Product Marketing', followers: '24.1K', clicks: '7,310', score: 92 },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-20">
      {/* Top Header Controls */}
      <Header user={{ name: creatorName, avatarUrl }} />

      <main className="px-8 sm:px-12 max-w-7xl w-full mx-auto space-y-6">
        {/* Welcome Section */}
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Community workspace
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Creator Community
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Collaborate with vetted B2B voices, tear down viral hooks, and join exclusive mastermind calls.
          </p>
        </div>

        {/* Community Channels Hero Banner */}
        <div className="bg-white border border-slate-100/80 rounded-3xl p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Private Creator Slack &amp; Discord</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Join the private Naano Circle
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Get peer feedback on your LinkedIn post drafts within 15 minutes, access weekly algorithm insights, and unlock co-posting opportunities with top-tier creators.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://slack.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Join Creator Slack</span>
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center gap-2 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Discord Mastermind</span>
            </a>
          </div>
        </div>

        {/* Channels & Activities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Weekly Hook Breakdown */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Hook Teardowns</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Every Tuesday, our team analyzes the top 10 highest-performing B2B creator posts on LinkedIn and breaks down the exact hook formula.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <span className="font-semibold text-slate-800 block">This Week&apos;s Winner:</span>
              <p className="text-slate-600 italic">
                &ldquo;90% of B2B teams do cold outbound wrong. Here is what we changed to 4x replies:&rdquo;
              </p>
            </div>
          </div>

          {/* 2. Upcoming Live Masterminds */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Q&amp;A Sessions</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Direct conversations with B2B SaaS marketing leaders on what budgets they are deploying and what creator angles convert best.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Next Session:</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Thursday, 5 PM CET</span>
              </div>
              <p className="text-slate-600 font-medium">Guest: Head of Growth at Folk.app</p>
            </div>
          </div>

          {/* 3. Peer Review & Pods */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Peer Draft Feedback</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Drop your post draft in `#post-feedback` before publishing to receive tips from creators with 20K+ followers.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="font-bold text-emerald-700">34 feedback requests</span> answered this week with an average turnaround under 12 minutes.
            </div>
          </div>
        </div>

        {/* Creator Leaderboard */}
        <div className="bg-white border border-slate-100/80 rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Creator Leaderboard</h3>
                <p className="text-xs text-slate-500 mt-0.5">Top performing voices ranked by audience engagement and attributed results</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500">Updated daily</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCFCFB] text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Creator</th>
                  <th className="py-3.5 px-6">Specialty</th>
                  <th className="py-3.5 px-6">LinkedIn Audience</th>
                  <th className="py-3.5 px-6">Attributed Clicks</th>
                  <th className="py-3.5 px-6 text-right">Match Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topCreators.map((c) => (
                  <tr key={c.rank} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {c.rank === 1 ? '🥇 #1' : c.rank === 2 ? '🥈 #2' : c.rank === 3 ? '🥉 #3' : `#${c.rank}`}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {c.name}
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {c.niche}
                    </td>
                    <td className="py-4 px-6 text-slate-900 font-semibold">
                      {c.followers}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">{c.clicks}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {c.score}% Score
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
