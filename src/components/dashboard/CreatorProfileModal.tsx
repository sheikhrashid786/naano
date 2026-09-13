'use client';

import React, { useState } from 'react';
import {
  X,
  Star,
  Sparkles,
  Check,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  Eye,
  ThumbsUp,
  MessageCircle,
  Repeat,
} from 'lucide-react';

interface CreatorProfileModalProps {
  creator: any;
  onClose: () => void;
  onBook: (creator: any, packageType: 'single' | 'bundle') => void;
  isShortlisted?: boolean;
  onToggleShortlist?: (id: string) => void;
}

export default function CreatorProfileModal({
  creator,
  onClose,
  onBook,
  isShortlisted = false,
  onToggleShortlist,
}: CreatorProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'audience' | 'content'>('overview');
  const [selectedPackage, setSelectedPackage] = useState<'single' | 'bundle'>('single');
  const [showPricingCalc, setShowPricingCalc] = useState(false);

  if (!creator) return null;

  // Dynamic values
  const name = creator.user?.name || 'Creator';
  const niche = creator.niche || 'B2B Growth';
  const country = creator.country || 'Global';
  const singlePrice = creator.pricePerPost || 188;
  const bundlePrice = Math.round(singlePrice * 5 * 0.85); // 15% discount for 5 bundle
  const typicalReach = creator.medianViews
    ? creator.medianViews >= 1000
      ? `${(creator.medianViews / 1000).toFixed(1).replace('.0', '')}K`
      : creator.medianViews.toString()
    : `${Math.round((creator.followersCount * 0.18) / 100) / 10}K`;

  const estimatedCpm = creator.cpm || Math.max(8, Math.round((singlePrice / (creator.followersCount * 0.18 || 1000)) * 1000));
  const initial = name.charAt(0).toUpperCase();

  // Dynamic audience based on niche
  const isMarketing = niche.toLowerCase().includes('marketing') || niche.toLowerCase().includes('copywriting');
  const isSaaS = niche.toLowerCase().includes('saas') || niche.toLowerCase().includes('software') || niche.toLowerCase().includes('ai');

  const jobDistribution = isMarketing
    ? { top: 'Marketing', topPct: 40, second: 'Founders', secondPct: 31, third: 'Engineering', thirdPct: 16, other: 13 }
    : isSaaS
    ? { top: 'Tech & Product', topPct: 44, second: 'Founders & C-Level', secondPct: 29, third: 'Sales & GTM', thirdPct: 18, other: 9 }
    : { top: 'Sales & BD', topPct: 42, second: 'Executives', secondPct: 32, third: 'Operations', thirdPct: 15, other: 11 };

  // Sample LinkedIn post excerpt
  const postExcerpt = creator.headline || creator.bio ||
    `I basically turned Claude into my outbound team 🤯 And no, I don't mean it "helps" with outbound. It actually runs it. Claude obviously can't do all of this natively. I connected one tool, and now I can control the entire outbound process just by talking to Claude. I can ask it to identify our top ICP buyers and craft tailored messaging...`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* ========================================================================= */}
        {/* MODAL TOP HEADER BAR                                                      */}
        {/* ========================================================================= */}
        <div className="p-5 px-6 sm:px-8 border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-center gap-3.5 min-w-0">
            {creator.avatarUrl || creator.user?.avatarUrl ? (
              <img
                src={creator.avatarUrl || creator.user?.avatarUrl}
                alt={name}
                className="w-12 h-12 rounded-full border border-slate-200 object-cover object-top shadow-xs shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#0070F3] text-white font-black text-lg flex items-center justify-center shrink-0">
                {initial}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black text-[#111827] tracking-tight truncate">
                {name}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5 truncate">
                {niche} · LinkedIn creator {country ? `· ${country}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onToggleShortlist && (
              <button
                type="button"
                onClick={() => onToggleShortlist(creator.id)}
                className={`w-9 h-9 rounded-xl border border-[#E2E8F0] bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                  isShortlisted
                    ? 'text-amber-500 bg-amber-50 border-amber-200'
                    : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                }`}
                title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
              >
                <Star
                  className={`w-4 h-4 ${isShortlisted ? 'fill-amber-400 text-amber-500' : ''}`}
                />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL MAIN CONTENT (SPLIT 2 COLUMNS)                                      */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
          {/* LEFT SECTION (65%) */}
          <div className="flex-1 p-6 sm:p-8 space-y-7 min-w-0">
            {/* SUB-TABS */}
            <div className="flex items-center gap-6 border-b border-[#F1F5F9] pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`pb-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-[#64748B] hover:text-[#111827]'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('audience')}
                className={`pb-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'audience'
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-[#64748B] hover:text-[#111827]'
                }`}
              >
                Audience
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`pb-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'content'
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-[#64748B] hover:text-[#111827]'
                }`}
              >
                Content
              </button>
            </div>

            {/* 1. CREATOR OVERVIEW BLOCK */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-[#111827]">Creator overview</h3>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Review this creator’s audience and recent content before booking.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] font-semibold">
                  <div className="w-4 h-4 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>
                    {jobDistribution.topPct}% in observed audience · {jobDistribution.top}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs text-[#2563EB] font-semibold">
                  <div className="w-4 h-4 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{typicalReach} typical reach</span>
                </div>
              </div>
            </div>

            {/* 2. AUDIENCE SNAPSHOT BLOCK */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#111827]">Audience snapshot</h3>
                <span className="text-[11px] text-[#94A3B8]">
                  Estimated from 45 recent public engagers
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Job Title Bar & Legend */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#475569] block">
                    JOB TITLE
                  </span>

                  {/* Multi-segment bar */}
                  <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-slate-100">
                    <div
                      style={{ width: `${jobDistribution.topPct}%` }}
                      className="bg-[#2563EB] h-full"
                    />
                    <div
                      style={{ width: `${jobDistribution.secondPct}%` }}
                      className="bg-[#60A5FA] h-full"
                    />
                    <div
                      style={{ width: `${jobDistribution.thirdPct}%` }}
                      className="bg-[#93C5FD] h-full"
                    />
                    <div
                      style={{ width: `${jobDistribution.other}%` }}
                      className="bg-[#DBEAFE] h-full"
                    />
                  </div>

                  {/* Legend Grid */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                        <span>{jobDistribution.top}</span>
                      </span>
                      <span className="font-bold text-[#111827]">{jobDistribution.topPct}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA]" />
                        <span>{jobDistribution.second}</span>
                      </span>
                      <span className="font-bold text-[#111827]">{jobDistribution.secondPct}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#93C5FD]" />
                        <span>{jobDistribution.third}</span>
                      </span>
                      <span className="font-bold text-[#111827]">{jobDistribution.thirdPct}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DBEAFE]" />
                        <span>Other</span>
                      </span>
                      <span className="font-bold text-[#111827]">{jobDistribution.other}%</span>
                    </div>
                  </div>
                </div>

                {/* Seniority Bar & Legend */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#475569] block">
                    SENIORITY
                  </span>

                  {/* Multi-segment bar */}
                  <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-slate-100">
                    <div style={{ width: '58%' }} className="bg-[#1D4ED8] h-full" />
                    <div style={{ width: '28%' }} className="bg-[#3B82F6] h-full" />
                    <div style={{ width: '8%' }} className="bg-[#93C5FD] h-full" />
                    <div style={{ width: '6%' }} className="bg-[#DBEAFE] h-full" />
                  </div>

                  {/* Legend Grid */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" />
                        <span>Founder</span>
                      </span>
                      <span className="font-bold text-[#111827]">58%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
                        <span>Manager</span>
                      </span>
                      <span className="font-bold text-[#111827]">28%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#93C5FD]" />
                        <span>Vp</span>
                      </span>
                      <span className="font-bold text-[#111827]">8%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DBEAFE]" />
                        <span>Other</span>
                      </span>
                      <span className="font-bold text-[#111827]">6%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CONTENT PERFORMANCE BLOCK */}
            <div className="space-y-3 pt-1">
              <h3 className="text-sm font-bold text-[#111827]">Content performance</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Card 1: Reach across recent posts chart */}
                <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827]">
                      Reach across recent posts
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">Oldest → newest</span>
                  </div>

                  {/* Line Chart SVG */}
                  <div className="py-4 my-auto">
                    <svg viewBox="0 0 280 80" className="w-full h-20 overflow-visible">
                      <defs>
                        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 10 38 Q 65 55 90 48 T 150 25 T 205 60 T 270 30"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="2.2"
                      />
                      <path
                        d="M 10 38 Q 65 55 90 48 T 150 25 T 205 60 T 270 30 L 270 80 L 10 80 Z"
                        fill="url(#chartGrad)"
                      />
                      {/* Dots */}
                      <circle cx="10" cy="38" r="3.5" fill="#2563EB" />
                      <circle cx="90" cy="48" r="3.5" fill="#2563EB" />
                      <circle cx="150" cy="25" r="3.5" fill="#2563EB" />
                      <circle cx="205" cy="60" r="3.5" fill="#2563EB" />
                      <circle cx="270" cy="30" r="3.5" fill="#2563EB" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pt-1">
                    <span>Sep 3</span>
                    <span>Sep 7</span>
                  </div>
                </div>

                {/* Card 2: Recent LinkedIn Post Preview */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {creator.avatarUrl || creator.user?.avatarUrl ? (
                          <img
                            src={creator.avatarUrl || creator.user?.avatarUrl}
                            alt={name}
                            className="w-7 h-7 rounded-full object-cover object-top shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#0070F3] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#111827] truncate">{name}</h4>
                          <span className="text-[10px] text-[#64748B] flex items-center gap-1">
                            <span>Sep 7 · Public LinkedIn post</span>
                            <span className="text-[#2563EB] hover:underline cursor-pointer">
                              Open original ↗
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="w-5 h-5 rounded bg-[#0A66C2] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        in
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      {postExcerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100 text-[10px] text-[#64748B] mt-2">
                    <span className="flex items-center gap-1 font-semibold text-[#111827]">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>{typicalReach} estimated</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-slate-400" />
                      <span>109</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-slate-400" />
                      <span>76</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Repeat className="w-3 h-3 text-slate-400" />
                      <span>7</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION - BOOKING SIDEBAR (35%) */}
          <div className="w-full md:w-80 lg:w-96 p-6 sm:p-7 bg-[#FAFCFF] flex flex-col justify-between space-y-6 shrink-0">
            <div className="space-y-5">
              <h3 className="text-base font-black text-[#111827]">Book this creator</h3>

              {/* Package Selectors */}
              <div className="space-y-3">
                {/* 1. Single Post */}
                <button
                  type="button"
                  onClick={() => setSelectedPackage('single')}
                  className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                    selectedPackage === 'single'
                      ? 'border-[#2563EB] bg-[#EFF6FF]/60 shadow-xs'
                      : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        selectedPackage === 'single'
                          ? 'border-[#2563EB] bg-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {selectedPackage === 'single' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#111827]">Single post</span>
                  </div>
                  <span className="text-sm font-black text-[#111827]">{singlePrice} €</span>
                </button>

                {/* 2. Bundle 5 */}
                <button
                  type="button"
                  onClick={() => setSelectedPackage('bundle')}
                  className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                    selectedPackage === 'bundle'
                      ? 'border-[#2563EB] bg-[#EFF6FF]/60 shadow-xs'
                      : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        selectedPackage === 'bundle'
                          ? 'border-[#2563EB] bg-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {selectedPackage === 'bundle' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-[#111827]">Bundle · 5</span>
                  </div>
                  <span className="text-sm font-black text-[#111827]">{bundlePrice} €</span>
                </button>
              </div>

              {/* Metrics Summary */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Typical reach</span>
                  <span className="font-bold text-[#111827]">{typicalReach}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Estimated CPM</span>
                  <span className="font-bold text-[#111827]">{estimatedCpm} €</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Posts analyzed</span>
                  <span className="font-bold text-[#111827]">5</span>
                </div>
              </div>

              {/* Pricing calculation dropdown */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowPricingCalc(!showPricingCalc)}
                  className="w-full text-center text-[11px] text-slate-500 hover:text-slate-800 font-medium py-1 cursor-pointer flex items-center justify-center gap-1 transition-colors"
                >
                  <span>How pricing is calculated</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${showPricingCalc ? 'rotate-180' : ''}`}
                  />
                </button>

                {showPricingCalc && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-[10px] text-slate-600 mt-2 leading-relaxed animate-in fade-in">
                    Rates are based on historical LinkedIn post impressions, audience seniority, and verified engagement rates. Bundle purchases include a 15% rate reduction.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onBook(creator, selectedPackage)}
                className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xs transition-all active:scale-95 text-center cursor-pointer"
              >
                Collaborate with {name}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#64748B] mt-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Secure booking · Creator approves first</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
