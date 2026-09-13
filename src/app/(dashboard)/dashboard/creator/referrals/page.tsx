'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import {
  Building2,
  Users,
  Copy,
  Check,
  ArrowRight,
  Mail,
  Contact,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function CreatorAffiliatePage() {
  const [activeTab, setActiveTab] = useState<'brands' | 'creators'>('brands');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const creatorSlug =
    currentUser?.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'you';

  const brandReferralLink = `naano.com/invite/${creatorSlug}`;
  const creatorReferralLink = `naano.com/join/${creatorSlug}`;
  const myCardLink = `/dashboard/creator/profile`;

  function handleCopy(text: string, key: string) {
    const fullUrl = `https://${text}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(key);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  }

  const currentLink = activeTab === 'brands' ? brandReferralLink : creatorReferralLink;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#FBFBFA] min-h-screen pb-28">
      {/* Sticky Dashboard Header */}
      <Header
        balance={0}
        user={{
          name: currentUser?.name,
          avatarUrl: currentUser?.avatarUrl || currentUser?.creator?.avatarUrl,
        }}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* TOP SEGMENT SWITCHER */}
          <div className="flex justify-center">
            <div className="inline-flex items-center p-1 rounded-2xl border border-[#E7E5E0] bg-[#EFECE6]/70 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('brands')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'brands'
                    ? 'bg-white text-[#111827] shadow-xs border border-black/5'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Invite brands</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('creators')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'creators'
                    ? 'bg-white text-[#111827] shadow-xs border border-black/5'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Invite creators</span>
              </button>
            </div>
          </div>

          {/* HERO SECTION */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            {/* Centered Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-200/80 bg-white text-xs font-semibold text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
              <span>
                {activeTab === 'brands'
                  ? 'Creator affiliation · 25% for 3 months'
                  : 'Creator community · Expand the network'}
              </span>
            </div>

            {/* Hero Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#111827] tracking-tight leading-[1.12]">
              {activeTab === 'brands' ? (
                <>
                  Recommend Naano. Earn for <br /> 3 months.
                </>
              ) : (
                <>
                  Grow the Naano creator <br /> network.
                </>
              )}
            </h1>

            {/* Hero Subtitle */}
            <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mx-auto leading-relaxed pt-1">
              {activeTab === 'brands'
                ? "Share your personal link with a company. If it joins Naano and launches paid campaigns, you receive 25% of Naano's commission for three months."
                : 'Invite fellow B2B LinkedIn creators. When they join and publish sponsored brand posts, you earn revenue share rewards.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <button
                type="button"
                onClick={() => handleCopy(currentLink, 'hero')}
                className="px-6 py-3 bg-[#111827] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                {copiedLink === 'hero' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copiedLink === 'hero' ? 'Link copied!' : 'Copy my referral link'}</span>
              </button>

              <a
                href="#how-it-works"
                className="text-xs font-bold text-[#111827] hover:text-[#2864EA] flex items-center gap-1.5 transition-colors cursor-pointer py-3"
              >
                <span>See how it works</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* INTERACTIVE TRACKING FLOW BOX */}
          <div className="bg-[#EDF5FF] border border-[#DCE9F9] rounded-[32px] sm:rounded-[36px] p-6 sm:p-10 shadow-2xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
              {/* Card A: Introduce a company */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E7EB] shadow-xs flex-1 w-full space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#111827] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827] leading-tight">
                      Introduce a company to Naano
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Your link identifies you automatically
                    </p>
                  </div>
                </div>

                {/* Personal Link Box */}
                <div className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <LinkIcon className="w-4 h-4 text-[#2864EA] shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] block">
                        YOUR PERSONAL REFERRAL LINK
                      </span>
                      <span className="text-xs font-bold text-[#2864EA] truncate block">
                        {brandReferralLink}
                      </span>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Copy Link Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleCopy(brandReferralLink, 'cardA')}
                    className="text-xs font-bold text-[#64748B] hover:text-[#111827] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedLink === 'cardA' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedLink === 'cardA' ? 'Copied!' : 'Copy link'}</span>
                  </button>
                </div>
              </div>

              {/* Middle Tracking Indicator */}
              <div className="flex flex-col items-center justify-center gap-1 shrink-0 py-2">
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <span className="w-4 h-px bg-[#CBD5E1]" />
                  <ArrowRight className="w-4 h-4 text-[#2864EA]" />
                  <span className="w-4 h-px bg-[#CBD5E1]" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#2864EA]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2864EA]" />
                  <span>TRACKED</span>
                </div>
              </div>

              {/* Card B: Commission share */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E7EB] shadow-xs flex-1 w-full space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">
                      YOUR SHARE OF NAANO&apos;S COMMISSION
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2864EA] flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-4xl font-black text-[#111827] tracking-tight mt-3">
                    25%
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">Reward period</span>
                  <span className="font-bold text-[#111827]">3 months</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#64748B] text-center mt-7 font-normal">
              The three-month reward period starts after the company&apos;s first completed paid campaign.
            </p>
          </div>

          {/* 3 STATS METRIC CARDS IN SINGLE ROW CONTAINER */}
          <div className="rounded-2xl border border-[#E2E8F0] bg-white grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] shadow-2xs overflow-hidden">
            {/* Card 1: Rewards earned */}
            <div className="p-6 sm:p-8 flex flex-col justify-between min-h-[120px]">
              <span className="text-xs font-semibold text-[#64748B]">
                Rewards earned
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight mt-2">
                €0.00
              </div>
            </div>

            {/* Card 2: Brands introduced */}
            <div className="p-6 sm:p-8 flex flex-col justify-between min-h-[120px]">
              <div>
                <span className="text-xs font-semibold text-[#64748B]">
                  Brands introduced
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight mt-2">
                  0
                </div>
              </div>
              <span className="text-[11px] text-[#94A3B8] mt-3 block">
                0 have generated rewards
              </span>
            </div>

            {/* Card 3: Earning now */}
            <div className="p-6 sm:p-8 flex flex-col justify-between min-h-[120px]">
              <div>
                <span className="text-xs font-semibold text-[#64748B]">
                  Earning now
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight mt-2">
                  0
                </div>
              </div>
              <span className="text-[11px] text-[#94A3B8] mt-3 block">
                Inside the three-month window
              </span>
            </div>
          </div>

          {/* TWO WAYS TO INTRODUCE A BRAND SECTION */}
          <div id="how-it-works" className="space-y-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2864EA]">
              <span className="w-2 h-2 rounded-full bg-[#2864EA]" />
              <span>TWO WAYS TO INTRODUCE A BRAND</span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight leading-tight">
                Choose the link that fits the <br className="hidden sm:inline" /> conversation.
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-2">
                Both options are tracked and pay you 25% of Naano&apos;s commission for three months.
              </p>
            </div>

            {/* 2-Option Split Card Container */}
            <div className="rounded-3xl border border-[#DCE9F9] overflow-hidden shadow-2xs mt-6">
              {/* Option 1: Recommend Naano (Soft Sky Blue Top Half) */}
              <div className="p-6 sm:p-8 bg-[#EDF5FF]/90 border-b border-[#DCE9F9] flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-colors">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white text-[#2864EA] border border-[#D0E2FF] flex items-center justify-center shrink-0 shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                        Recommend Naano
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-white/90 border border-slate-200 text-[10px] font-extrabold uppercase text-slate-600 tracking-wider">
                        MOST COMMON
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                      Use your Naano link when a company wants to discover creators or start influencer marketing.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(brandReferralLink, 'opt1')}
                  className="px-5 py-2.5 bg-[#475569] hover:bg-[#334155] text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 shadow-xs transition-all cursor-pointer active:scale-95 self-start sm:self-auto"
                >
                  {copiedLink === 'opt1' ? (
                    <Check className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedLink === 'opt1' ? 'Copied!' : 'Copy Naano link'}</span>
                </button>
              </div>

              {/* Option 2: Share your Creator Card (Clean White Bottom Half) */}
              <div className="p-6 sm:p-8 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#F8FAFC] text-slate-600 border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                    <Contact className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                      Share your Creator Card
                    </h3>
                    <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                      Use your Deal Link when a brand already wants to collaborate with you. Your profile stays selected when it creates its account.
                    </p>
                  </div>
                </div>

                <Link
                  href={myCardLink}
                  className="px-5 py-2.5 bg-white border border-[#CBD5E1] hover:bg-slate-50 text-[#111827] rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 shadow-2xs transition-all self-start sm:self-auto"
                >
                  <span>Open My Card</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
