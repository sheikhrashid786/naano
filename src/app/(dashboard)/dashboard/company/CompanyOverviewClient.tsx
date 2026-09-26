'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import InviteCreatorModal from '@/components/dashboard/InviteCreatorModal';
import EscrowMilestoneStepper from '@/components/dashboard/EscrowMilestoneStepper';
import {
  Users,
  FileText,
  MessageSquare,
  Eye,
  ChevronRight,
  Plus,
  ArrowRight,
  X,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface CreatorItem {
  id: string;
  name: string;
  niche: string;
  avatarUrl: string;
  price: number;
  icpMatch: string;
  rawCreator?: any;
}

interface CompanyOverviewClientProps {
  initialUser: {
    name: string;
    avatarUrl?: string | null;
  };
  companyName: string;
  walletBalance: number;
  stats: {
    creatorsActivated: number;
    postsPublished: number;
    profilesEngaged: number;
    impressions: number;
  };
  creators: CreatorItem[];
  recentConversations: any[];
}

export default function CompanyOverviewClient({
  initialUser,
  companyName,
  walletBalance,
  stats,
  creators,
  recentConversations,
}: CompanyOverviewClientProps) {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [selectedCreatorForInvite, setSelectedCreatorForInvite] = useState<any | null>(null);
  const [callBookedToast, setCallBookedToast] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today, 3:30 PM');

  const firstName = initialUser.name ? initialUser.name.split(' ')[0] : 'there';

  function handleBookCall(e: React.FormEvent) {
    e.preventDefault();
    setIsCallModalOpen(false);
    setCallBookedToast(true);
    setTimeout(() => setCallBookedToast(false), 4000);
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative">
      {/* Top Header */}
      <Header
        balance={walletBalance}
        user={{
          name: initialUser.name,
          avatarUrl: initialUser.avatarUrl,
        }}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* TOP TITLE ROW WITH ACTION BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1 rounded-full shadow-2xs">
                <span>Hello {firstName}</span>
                <span className="text-sm">👋</span>
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                Brand Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-950 tracking-tight leading-tight">
              Here is what is happening for <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{companyName}</span>
            </h1>
          </div>

          <Link
            href="/dashboard/company/campaigns"
            className="self-start sm:self-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Launch Campaign</span>
          </Link>
        </div>

        {/* 4 TOP METRICS CARDS - Luxury Forecaster Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. Creators activated */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider truncate">Activated Creators</span>
                </div>
              </div>
              <div className="border-l-2 border-indigo-500 pl-3.5 py-0.5">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  {stats.creatorsActivated}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Live partnership voices</div>
              </div>
            </div>
          </div>

          {/* 2. Posts published */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider truncate">Posts Published</span>
                </div>
              </div>
              <div className="border-l-2 border-blue-500 pl-3.5 py-0.5">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  {stats.postsPublished}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Live on LinkedIn feeds</div>
              </div>
            </div>
          </div>

          {/* 3. Profiles engaged */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider truncate">Profiles Engaged</span>
                </div>
              </div>
              <div className="border-l-2 border-purple-500 pl-3.5 py-0.5">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  {stats.profilesEngaged.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Qualified B2B buyers</div>
              </div>
            </div>
          </div>

          {/* 4. Impressions */}
          <div className="bg-white border border-emerald-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] bg-gradient-to-br from-white to-emerald-50/30 rounded-2xl p-5 hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider truncate">Impressions</span>
                </div>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3.5 py-0.5">
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight font-mono">
                  {stats.impressions >= 1000 ? `${(stats.impressions / 1000).toFixed(1)}k` : stats.impressions}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">Verified organic impressions</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5-STAGE ESCROW & CAMPAIGN MILESTONE GUARANTEE */}
        <EscrowMilestoneStepper
          status="IN_PROGRESS"
          paymentStatus="PENDING"
        />

        {/* MIDDLE ROW: TO DO & RECENTLY ENGAGED COMPANIES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: To do (7 columns) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">To do</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Priority campaign actions</p>
                </div>
                <Link
                  href="/dashboard/company/campaigns"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  See all
                </Link>
              </div>

              <div className="mt-5 divide-y divide-slate-100">
                {/* 1. Top up your wallet */}
                <Link
                  href="/dashboard/company/billing"
                  className="py-4 flex items-center justify-between gap-3 group transition-colors hover:bg-slate-50/50 -mx-2 px-2 rounded-2xl"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-5 h-5 rounded-full border-2 border-amber-400 group-hover:border-amber-500 shrink-0 transition-colors flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      Top up your escrow holding vault
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70 text-[11px] font-extrabold font-mono">
                      Action Needed
                    </span>
                    <div className="w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-2xs">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>

                {/* 2. Book a call for your next campaign */}
                <div
                  onClick={() => setIsCallModalOpen(true)}
                  className="py-4 flex items-center justify-between gap-3 group cursor-pointer transition-colors hover:bg-slate-50/50 -mx-2 px-2 rounded-2xl"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-300 group-hover:border-indigo-500 shrink-0 transition-colors" />
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      Book a strategy call with a B2B campaign director
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 text-[11px] font-extrabold font-mono">
                      Free Strategy
                    </span>
                    <div className="w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-2xs">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* 3. Find new creators for your next campaign */}
                <Link
                  href="/dashboard/company/marketplace"
                  className="py-4 flex items-center justify-between gap-3 group transition-colors hover:bg-slate-50/50 -mx-2 px-2 rounded-2xl"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-slate-400 shrink-0 transition-colors" />
                    <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                      Browse top verified LinkedIn voices for your ICP
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-extrabold font-mono">
                      Marketplace
                    </span>
                    <div className="w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-2xs">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Recently engaged companies (5 columns) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col">
            {/* Scenic Gradient Header */}
            <div className="bg-gradient-to-b from-indigo-50/70 via-slate-50/40 to-white p-6 pb-4 border-b border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block font-mono">
                    RECENTLY ENGAGED COMPANIES
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                    ICP accounts in your target
                  </h2>
                </div>
                <Link
                  href="/dashboard/company/marketplace"
                  className="px-3.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full shadow-2xs border border-indigo-100 transition-colors shrink-0"
                >
                  See all
                </Link>
              </div>
            </div>

            {/* Empty State */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 py-14 text-center">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 shadow-2xs">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-600">
                Live campaign views will appear here.
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Invite creators to begin tracking attributed ICP companies.</p>
            </div>
          </div>
        </div>

        {/* THIRD ROW: MESSAGES & NEW CREATORS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Messages (4 columns) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col justify-between min-h-[300px]">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Messages</h2>
              <p className="text-xs text-slate-400 mt-0.5">Waiting on creator reply</p>
            </div>

            {recentConversations.length === 0 ? (
              <div className="my-auto py-10 text-center">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-500 font-semibold block">
                  No unread conversations
                </span>
                <span className="text-[11px] text-slate-400">Brief discussions will show here</span>
              </div>
            ) : (
              <div className="my-auto space-y-2.5 py-4">
                {recentConversations.map((c) => (
                  <Link
                    key={c.id}
                    href="/dashboard/company/messages"
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                      {c.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{c.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{c.lastMessage}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* New creators (8 columns) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Verified Creators</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs border border-indigo-100 font-mono">
                    {creators.length}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Ranked by ICP match score for your buyer persona</p>
              </div>

              <Link
                href="/dashboard/company/marketplace"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Explore all →
              </Link>
            </div>

            {/* Horizontal Scroll Row of Creator Cards */}
            <div className="flex items-stretch gap-3.5 overflow-x-auto pb-3 pt-5 -mx-2 px-2 scrollbar-thin">
              {creators.map((creator, idx) => (
                <div
                  key={creator.id}
                  className="w-[172px] sm:w-[180px] shrink-0 bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  {/* Top Subtle Gradient */}
                  <div
                    className={`h-11 w-full ${
                      idx % 4 === 0
                        ? 'bg-gradient-to-b from-indigo-100/70 to-indigo-50/20'
                        : idx % 4 === 1
                        ? 'bg-gradient-to-b from-emerald-100/70 to-emerald-50/20'
                        : idx % 4 === 2
                        ? 'bg-gradient-to-b from-violet-100/70 to-violet-50/20'
                        : 'bg-gradient-to-b from-sky-100/70 to-sky-50/20'
                    }`}
                  />

                  {/* Centered Avatar */}
                  <div className="-mt-6 mx-auto relative z-10">
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="w-12 h-12 rounded-2xl border-2 border-white shadow-xs object-cover object-top bg-slate-100 group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-3.5 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-xs font-bold text-slate-900 truncate"
                        title={creator.name}
                      >
                        {creator.name}
                      </h3>
                      <p
                        className="text-[10px] text-slate-500 truncate mt-0.5"
                        title={creator.niche}
                      >
                        {creator.niche}
                      </p>

                      {/* ICP Badge */}
                      <div className="mt-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold border border-indigo-100 font-mono">
                          {creator.icpMatch} ICP
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Price / Post</span>
                      <span className="text-sm font-black text-slate-900 block font-mono">
                        €{creator.price}
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          if (creator.rawCreator) {
                            setSelectedCreatorForInvite(creator.rawCreator);
                          } else {
                            setSelectedCreatorForInvite({
                              id: creator.id,
                              pricePerPost: creator.price,
                              fitScore: 90,
                              user: { name: creator.name },
                            });
                          }
                        }}
                        className="w-full py-1.5 mt-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200/80 hover:border-indigo-600 text-xs font-bold rounded-xl transition-all block text-center cursor-pointer shadow-2xs hover:shadow-indigo-500/20 active:scale-95"
                      >
                        Invite
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM EXPERT CALL BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="Naano expert"
              className="w-12 h-12 rounded-2xl object-cover shrink-0 border-2 border-indigo-400 shadow-md"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-1.5 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Naano B2B Strategy Desk</span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Need an expert eye? Book a free 15-minute briefing review.
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Connect with our campaign director to sharpen your creator shortlist, align ICP messaging, and forecast expected ARR pipeline before booking.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCallModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-indigo-50 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer text-center"
          >
            Book Strategy Call
          </button>
        </div>
      </main>

      {/* BOOK A CALL MODAL */}
      {isCallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Book a Strategy Call</h3>
                  <p className="text-xs text-slate-500">15-min free walkthrough with an expert</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCallModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookCall} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  Available Slots Today
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Today, 2:30 PM', 'Today, 3:30 PM', 'Today, 5:00 PM', 'Tomorrow, 10:00 AM'].map(
                    (slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => setSelectedDate(slot)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                          selectedDate === slot
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {slot}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  What would you like help with?
                </label>
                <textarea
                  rows={3}
                  defaultValue={`Hi, we want to launch a B2B LinkedIn campaign for ${companyName} and would like expert help shortlisting matching creators.`}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-none text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCallModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  Confirm reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CALL BOOKED CONFIRMATION TOAST */}
      {callBookedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold block">Call confirmed!</span>
            <span className="text-slate-300">Calendar invite sent to your email for {selectedDate}.</span>
          </div>
        </div>
      )}

      {/* INVITE CREATOR MODAL */}
      {selectedCreatorForInvite && (
        <InviteCreatorModal
          creator={selectedCreatorForInvite}
          onClose={() => setSelectedCreatorForInvite(null)}
          onSuccess={() => {
            setSelectedCreatorForInvite(null);
          }}
        />
      )}
    </div>
  );
}
