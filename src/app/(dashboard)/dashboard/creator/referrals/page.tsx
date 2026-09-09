'use client';

import React, { useState } from 'react';
import Header from '@/components/dashboard/Header';
import {
  Percent,
  Copy,
  Check,
  Share2,
  Users,
  DollarSign,
  TrendingUp,
  Gift,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function CreatorReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://naano.com/r/umar-draz';

  function handleCopy() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-20">
      {/* Top Header Controls */}
      <Header />

      <main className="px-8 sm:px-12 max-w-7xl w-full mx-auto space-y-6">
        {/* Welcome Section */}
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Affiliate &amp; referrals
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Refer Brands &amp; Creators
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Earn 5% recurring revenue share on every campaign completed by founders or creators you refer to Naano.
          </p>
        </div>

        {/* Referral Link Hero Card */}
        <div className="bg-white border border-slate-100/80 rounded-3xl p-8 shadow-2xs space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 mb-2">
                <Gift className="w-3.5 h-3.5 text-emerald-600" />
                <span>5% Lifetime Revenue Share</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your Personal Referral Link</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Share this link with LinkedIn creators or B2B SaaS marketing heads looking to sponsor creators.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-[#0A66C2]" />
                <span>Share on LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 max-w-2xl">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs font-mono text-slate-800 select-all">
              {referralLink}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Creators Referred</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">0</div>
            <p className="mt-1 text-xs text-slate-400">Signed up with your link</p>
          </div>

          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              <span>Brands Referred</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">0</div>
            <p className="mt-1 text-xs text-slate-400">Companies booking creators</p>
          </div>

          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <span>Commissions Earned</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">€0</div>
            <p className="mt-1 text-xs text-emerald-600 font-semibold">5% rev share on volume</p>
          </div>

          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Pending In Escrow</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">€0</div>
            <p className="mt-1 text-xs text-slate-400">Released upon post approvals</p>
          </div>
        </div>

        {/* How It Works 3-Step Section */}
        <div className="bg-white border border-slate-100/80 rounded-3xl p-8 shadow-2xs space-y-6">
          <h3 className="text-lg font-bold text-slate-900">How the Naano Affiliate Program Works</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-blue-600 font-mono">01. Share your link</span>
              <h4 className="text-sm font-bold text-slate-900">Invite founders or creator peers</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Send your unique referral link to marketing teams or fellow B2B voices interested in fixed-price sponsored posts.
              </p>
            </div>

            <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-blue-600 font-mono">02. They run campaigns</span>
              <h4 className="text-sm font-bold text-slate-900">Automated tracking &amp; escrow</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Whenever your invited creators get booked, or brands fund their campaign escrow, your account is automatically credited.
              </p>
            </div>

            <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-blue-600 font-mono">03. Get paid via Stripe</span>
              <h4 className="text-sm font-bold text-slate-900">Direct monthly payouts</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Commissions are transferred directly to your connected bank account via Stripe Connect alongside your post earnings.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
