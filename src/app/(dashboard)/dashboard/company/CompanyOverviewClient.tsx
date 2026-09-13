'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import InviteCreatorModal from '@/components/dashboard/InviteCreatorModal';
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
            <span className="text-sm font-semibold text-[#64748B] flex items-center gap-1">
              <span>Hello {firstName}</span>
              <span className="text-base">👋</span>
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#111827] tracking-tight mt-1">
              Here is what is happening for {companyName} on Naano.
            </h1>
          </div>

          <Link
            href="/dashboard/company/campaigns"
            className="self-start sm:self-auto px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center gap-2 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New campaign</span>
          </Link>
        </div>

        {/* 4 TOP METRICS CARDS */}
        {/* 4 TOP METRICS CARDS IN ONE ROW */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {/* 1. Creators activated */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xs min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-[#64748B] truncate">
              <Users className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <span className="truncate">Creators activated</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] tracking-tight mt-2 sm:mt-3">
              {stats.creatorsActivated}
            </div>
          </div>

          {/* 2. Posts published */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xs min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-[#64748B] truncate">
              <FileText className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <span className="truncate">Posts published</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] tracking-tight mt-2 sm:mt-3">
              {stats.postsPublished}
            </div>
          </div>

          {/* 3. Profiles engaged */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xs min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-[#64748B] truncate">
              <MessageSquare className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <span className="truncate">Profiles engaged</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] tracking-tight mt-2 sm:mt-3">
              {stats.profilesEngaged}
            </div>
          </div>

          {/* 4. Impressions */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xs min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-[#64748B] truncate">
              <Eye className="w-4 h-4 text-[#94A3B8] shrink-0" />
              <span className="truncate">Impressions</span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] tracking-tight mt-2 sm:mt-3">
              {stats.impressions}
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: TO DO & RECENTLY ENGAGED COMPANIES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: To do (7 columns) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-[#111827]">To do</h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Priority actions</p>
                </div>
                <Link
                  href="/dashboard/company/campaigns"
                  className="text-xs font-bold text-[#2563EB] hover:underline"
                >
                  See all
                </Link>
              </div>

              <div className="mt-5 divide-y divide-[#F1F5F9]">
                {/* 1. Top up your wallet */}
                <Link
                  href="/dashboard/company/billing"
                  className="py-4 flex items-center justify-between gap-3 group transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-slate-400 shrink-0 transition-colors" />
                    <span className="text-sm font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors truncate">
                      Top up your wallet
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold">
                      Blocked
                    </span>
                    <div className="w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 group-hover:text-slate-700 transition-colors shadow-2xs">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>

                {/* 2. Book a call for your next campaign */}
                <div
                  onClick={() => setIsCallModalOpen(true)}
                  className="py-4 flex items-center justify-between gap-3 group cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-slate-400 shrink-0 transition-colors" />
                    <span className="text-sm font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors truncate">
                      Book a call for your next campaign
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B] text-[11px] font-bold">
                      Suggested
                    </span>
                    <div className="w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 group-hover:text-slate-700 transition-colors shadow-2xs">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* 3. Find new creators for your next campaign */}
                <Link
                  href="/dashboard/company/marketplace"
                  className="py-4 flex items-center justify-between gap-3 group transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-slate-400 shrink-0 transition-colors" />
                    <span className="text-sm font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors truncate">
                      Find new creators for your next campaign
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B] text-[11px] font-bold">
                      Suggested
                    </span>
                    <div className="w-7 h-7 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 group-hover:text-slate-700 transition-colors shadow-2xs">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Recently engaged companies (5 columns) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-2xs flex flex-col">
            {/* Scenic Gradient Header */}
            <div className="bg-gradient-to-b from-[#D8EBFE] via-[#EAF4FE] to-white p-6 pb-4 border-b border-slate-100/60">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#475569] block">
                    RECENTLY ENGAGED COMPANIES
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-[#111827] mt-1">
                    ICP accounts in your target
                  </h2>
                </div>
                <Link
                  href="/dashboard/company/marketplace"
                  className="px-3.5 py-1 bg-white hover:bg-slate-50 text-[#2563EB] text-xs font-bold rounded-full shadow-2xs border border-blue-100/90 transition-colors shrink-0"
                >
                  See all
                </Link>
              </div>
            </div>

            {/* Empty State */}
            <div className="flex-1 flex items-center justify-center p-8 py-16 text-center">
              <span className="text-xs text-[#94A3B8]">
                No company has engaged yet.
              </span>
            </div>
          </div>
        </div>

        {/* THIRD ROW: MESSAGES & NEW CREATORS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Messages (4 columns) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs flex flex-col justify-between min-h-[300px]">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#111827]">Messages</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">Waiting on your reply</p>
            </div>

            {recentConversations.length === 0 ? (
              <div className="my-auto py-10">
                <span className="text-xs text-[#94A3B8]">
                  No conversation yet.
                </span>
              </div>
            ) : (
              <div className="my-auto space-y-3 py-4">
                {recentConversations.map((c) => (
                  <Link
                    key={c.id}
                    href="/dashboard/company/messages"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {c.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[#111827] truncate">{c.name}</div>
                      <div className="text-[11px] text-[#64748B] truncate">{c.lastMessage}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* New creators (8 columns) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-[#111827]">New creators</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-black text-xs">
                    {creators.length}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5">Profiles that fit your buyers</p>
              </div>

              <Link
                href="/dashboard/company/marketplace"
                className="text-xs font-bold text-[#2563EB] hover:underline"
              >
                Explore
              </Link>
            </div>

            {/* Horizontal Scroll Row of Creator Cards */}
            <div className="flex items-stretch gap-3.5 overflow-x-auto pb-3 pt-5 -mx-2 px-2 scrollbar-thin">
              {creators.map((creator, idx) => (
                <div
                  key={creator.id}
                  className="w-[168px] sm:w-[174px] shrink-0 bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
                >
                  {/* Top Subtle Gradient */}
                  <div
                    className={`h-11 w-full ${
                      idx % 4 === 0
                        ? 'bg-gradient-to-b from-[#DCEEFF] to-[#F0F7FF]'
                        : idx % 4 === 1
                        ? 'bg-gradient-to-b from-[#DCFCE7] to-[#F0FDF4]'
                        : idx % 4 === 2
                        ? 'bg-gradient-to-b from-[#E0E7FF] to-[#F5F7FF]'
                        : 'bg-gradient-to-b from-[#F3E8FF] to-[#FAF5FF]'
                    }`}
                  />

                  {/* Centered Avatar */}
                  <div className="-mt-6 mx-auto relative z-10">
                    <img
                      src={creator.avatarUrl}
                      alt={creator.name}
                      className="w-11 h-11 rounded-full border-2 border-white shadow-xs object-cover object-top bg-slate-100"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-3 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-xs font-bold text-[#111827] truncate"
                        title={creator.name}
                      >
                        {creator.name}
                      </h3>
                      <p
                        className="text-[10px] text-[#64748B] truncate mt-0.5"
                        title={creator.niche}
                      >
                        {creator.niche}
                      </p>

                      {/* ICP Badge */}
                      <div className="mt-2">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] text-[10px] font-extrabold">
                          {creator.icpMatch} ICP
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2">
                      <span className="text-[9px] text-[#94A3B8] block">from</span>
                      <span className="text-sm font-black text-[#111827] block -mt-0.5">
                        {creator.price}€
                      </span>
                      <span className="text-[9px] text-[#94A3B8] block">/post</span>

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
                        className="w-full py-1.5 mt-2.5 border border-[#CBD5E1] hover:border-[#2563EB] hover:bg-[#EFF6FF] text-[#2563EB] text-xs font-bold rounded-xl transition-all block text-center cursor-pointer active:scale-95"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM EXPERT CALL BANNER */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="Naano expert"
              className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200 shadow-2xs"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] text-[11px] font-bold mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>Naano experts available</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#111827] tracking-tight">
                Need an expert eye? Book a free call.
              </h3>
              <p className="text-xs text-[#64748B] mt-1 max-w-xl leading-relaxed">
                15 minutes with a Naano expert to frame your next campaign, sharpen your shortlist or improve the posts already running.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end">
            <button
              type="button"
              onClick={() => setIsCallModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>Book a free call</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-[#94A3B8] text-center sm:text-right mt-1.5 block">
              No commitment · Slot available today
            </span>
          </div>
        </div>
      </main>

      {/* BOOK A CALL MODAL */}
      {isCallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111827]">Book a Strategy Call</h3>
                  <p className="text-xs text-[#64748B]">15-min free walkthrough with an expert</p>
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
                <label className="text-xs font-bold text-[#111827] block mb-1.5">
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
                            ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
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
                <label className="text-xs font-bold text-[#111827] block mb-1">
                  What would you like help with?
                </label>
                <textarea
                  rows={3}
                  defaultValue={`Hi, we want to launch a B2B LinkedIn campaign for ${companyName} and would like expert help shortlisting matching creators.`}
                  className="w-full text-xs p-3 rounded-xl border border-[#CBD5E1] focus:border-[#2563EB] focus:outline-none text-[#111827]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCallModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-[#64748B] hover:text-[#111827]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
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
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
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
