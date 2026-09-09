import React from 'react';
import Header from '@/components/dashboard/Header';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Eye,
  FileText,
  Activity,
  Users,
  CheckCircle2,
  ChevronRight,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
  Mic,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default async function CreatorOverviewPage() {
  const session = await getCurrentUser();
  if (!session?.creatorId) return null;

  const creator = await prisma.creator.findUnique({
    where: { id: session.creatorId },
    include: {
      user: true,
      collaborations: {
        include: {
          campaign: true,
          payment: true,
        },
      },
    },
  });

  if (!creator) return null;

  const creatorName = creator.user.name || 'Creator';
  const creatorNiche = creator.niche || 'Software';
  const creatorCountry = creator.country || 'PK';
  const avatarUrl = creator.user.avatarUrl || null;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-20 relative">
      {/* Top Header Controls (Wallet, Language, Notifications, Avatar) */}
      <Header user={{ name: creatorName, avatarUrl }} />

      <main className="px-8 sm:px-12 max-w-7xl w-full mx-auto space-y-6">
        {/* Welcome Section */}
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Creator workspace
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your creator activity, at a glance.
          </p>
        </div>

        {/* 4 Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. PUBLIC POST REACH */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Post Reach</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">—</div>
            <p className="mt-1 text-xs text-slate-400">Waiting for public post data</p>
          </div>

          {/* 2. PUBLIC POSTS */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Posts</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">0</div>
            <p className="mt-1 text-xs text-slate-400">Original LinkedIn posts found</p>
          </div>

          {/* 3. PUBLIC ENGAGEMENTS */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span>Public Engagements</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">0</div>
            <p className="mt-1 text-xs text-slate-400">Reactions, comments and reposts</p>
          </div>

          {/* 4. LINKEDIN FOLLOWERS */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>LinkedIn Followers</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {creator.followersCount > 0 ? creator.followersCount.toLocaleString() : '—'}
            </div>
            <p className="mt-1 text-xs text-slate-400">Imported from the public profile</p>
          </div>
        </div>

        {/* Middle Two Panels: Creator Card & Launch Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Panel: Your creator card */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your creator card</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This is how brands discover your positioning and collaboration offer.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/dashboard/creator/profile"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Open card</span>
                </Link>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy card link</span>
                </button>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share my card</span>
                </button>
              </div>
            </div>

            {/* LinkedIn Card Preview Mockup */}
            <div className="mt-6 max-w-sm mx-auto border border-slate-200 rounded-3xl shadow-sm overflow-hidden bg-white">
              {/* Blue Gradient Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 h-24 p-4 flex items-start justify-between text-white relative">
                {/* LinkedIn Badge */}
                <div className="w-6 h-6 rounded bg-white text-[#0A66C2] flex items-center justify-center font-bold text-xs shadow-xs">
                  in
                </div>

                {/* White Naano Wordmark */}
                <div className="flex items-center gap-1 text-white font-extrabold text-sm tracking-tight">
                  <span className="text-base">naano</span>
                </div>

                {/* Country Pill & Share Button */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/30 text-white uppercase">
                    {creatorCountry}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                    <Share2 className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Creator Profile Avatar */}
              <div className="-mt-9 flex justify-center">
                <div className="w-18 h-18 rounded-full border-4 border-white shadow-md bg-slate-900 text-white font-bold flex items-center justify-center text-xl overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={creatorName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{creatorName.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
              </div>

              {/* Creator Details */}
              <div className="text-center px-4 pt-2 pb-5">
                <h4 className="text-base font-bold text-slate-900">{creatorName}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{creatorNiche}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400 leading-relaxed">
                  Your LinkedIn headline and topics will appear here once configured.
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Your launch guide */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your launch guide</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Personalized for your Marketplace status
                </p>
              </div>

              <Link
                href="/dashboard/creator/profile"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Open card
              </Link>
            </div>

            {/* Checklist Item: Card and price ready */}
            <div className="mt-5 border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900">Card and price ready</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your positioning and offer are ready to review.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Complete
                </span>
                <Link
                  href="/dashboard/creator/profile"
                  className="w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating AI Helper Search Pill at Bottom Center */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg hover:shadow-xl rounded-full px-4 py-2.5 flex items-center gap-3 w-96 max-w-[90vw] transition-all">
          <Sparkles className="w-4 h-4 text-slate-600 shrink-0" />
          <input
            type="text"
            placeholder="What can I help you find?"
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <Mic className="w-4 h-4 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0" />
        </div>
      </div>
    </div>
  );
}
