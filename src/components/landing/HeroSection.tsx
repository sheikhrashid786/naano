'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sliders,
  DollarSign,
  Users,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export default function HeroSection() {
  // Interactive Live Campaign ROI Estimator
  const [postsCount, setPostsCount] = useState<number>(3);
  const [avgFollowers, setAvgFollowers] = useState<number>(25000);

  // Calculations based on actual B2B benchmark data
  const estimatedCost = postsCount * 220;
  const estimatedImpressions = Math.round(postsCount * avgFollowers * 0.55);
  const estimatedClicks = Math.round(estimatedImpressions * 0.024);
  const estimatedPipelineValue = Math.round(estimatedClicks * 45);

  const brandLogos = [
    { src: '/lp/logo-lemlist.png', alt: 'lemlist', h: '28px' },
    { src: '/lp/logo-attio.jpg', alt: 'Attio', h: '30px' },
    { src: '/lp/logo-leadbay.png', alt: 'Leadbay', h: '24px' },
    { src: '/lp/logo-folk.png', alt: 'Folk CRM', h: '26px' },
    { src: '/lp/logo-blogseo.png', alt: 'BlogSEO', h: '22px' },
    { src: '/lp/logo-ringover.png', alt: 'Ringover', h: '28px' },
    { src: '/lp/logo-lagrowthmachine.png', alt: 'La Growth Machine', h: '26px' },
    { src: '/lp/logo-abyssale.png', alt: 'Abyssale', h: '24px' },
  ];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden banner-section bg-[#EBF1EE] border-b border-slate-200/80 section-even">
      {/* Background Decorative Emerald & Mint Mesh Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-gradient-to-tr from-emerald-200/40 via-teal-100/35 to-emerald-100/30 blur-3xl pointer-events-none rounded-full -z-10" />
      <div className="absolute top-12 left-10 w-80 h-80 bg-emerald-100/40 blur-2xl pointer-events-none rounded-full -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-100/30 blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 shadow-2xs mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              The B2B Creator OS & Marketplace
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-emerald-800">
              Zero Inbound Friction
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black tracking-tight text-slate-950 leading-[1.08]">
            Turn LinkedIn Authority into{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Attributed Pipeline
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed">
            Discover verified tech creators your buyers already trust. Deploy high-impact campaigns with guaranteed escrow protection and track real clicks, demos, and pipeline.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <Link
              href="/#creators"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Verified Creators</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/company/campaigns"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200/90 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Launch a Campaign</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Escrow Protection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Fixed Transparent Pricing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>End-to-End UTM Attribution</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE LIVE CAMPAIGN ROI CALCULATOR PREVIEW WIDGET       */}
        {/* ============================================================== */}
        <div className="mt-14 max-w-5xl lg:max-w-6xl mx-auto">
          <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(5,150,105,0.08)] p-6 sm:p-8 lg:p-9 overflow-hidden">
            {/* Top Widget Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 shrink-0 ring-4 ring-emerald-50">
                  <Sliders className="w-5 h-5 text-white stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">Interactive Campaign Forecaster</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Estimate reach and pipeline value before spending a single euro</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/70 self-start sm:self-auto font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Calculator</span>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-7">
              {/* Slider 1: Posts Count */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Sponsored Posts
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold font-mono shadow-xs">
                    {postsCount} {postsCount === 1 ? 'Post' : 'Posts'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={postsCount}
                  onChange={(e) => setPostsCount(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <button type="button" onClick={() => setPostsCount(1)} className="hover:text-slate-900 cursor-pointer">1 post</button>
                  <button type="button" onClick={() => setPostsCount(3)} className="hover:text-slate-900 cursor-pointer">3 posts</button>
                  <button type="button" onClick={() => setPostsCount(6)} className="hover:text-slate-900 cursor-pointer">6 posts</button>
                  <button type="button" onClick={() => setPostsCount(12)} className="hover:text-slate-900 cursor-pointer">12 posts</button>
                </div>
              </div>

              {/* Slider 2: Audience Range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Average Audience Size
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold font-mono shadow-xs">
                    {(avgFollowers / 1000).toFixed(0)}k Followers
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="5000"
                  value={avgFollowers}
                  onChange={(e) => setAvgFollowers(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <button type="button" onClick={() => setAvgFollowers(10000)} className="hover:text-slate-900 cursor-pointer">10k</button>
                  <button type="button" onClick={() => setAvgFollowers(25000)} className="hover:text-slate-900 cursor-pointer">25k</button>
                  <button type="button" onClick={() => setAvgFollowers(50000)} className="hover:text-slate-900 cursor-pointer">50k</button>
                  <button type="button" onClick={() => setAvgFollowers(100000)} className="hover:text-slate-900 cursor-pointer">100k+</button>
                </div>
              </div>
            </div>

            {/* Results 4-Column Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-slate-100">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Est. Budget</span>
                </div>
                <div className="border-l-2 border-emerald-600 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    €{estimatedCost.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Fixed escrow spend</div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Est. Reach</span>
                </div>
                <div className="border-l-2 border-teal-500 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    ~{(estimatedImpressions / 1000).toFixed(0)}k
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Organic impressions</div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Targeted Clicks</span>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    ~{estimatedClicks}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">High-intent visitors</div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] bg-gradient-to-br from-white to-emerald-50/40 hover:border-emerald-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Projected Pipeline</span>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
                    €{estimatedPipelineValue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Estimated ARR value</div>
                </div>
              </div>
            </div>

            {/* Bottom Guarantee Strip */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All campaign budgets held securely in Stripe Escrow until live publication proof is approved.</span>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 shrink-0"
              >
                <span>Launch campaign with these estimates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* LOGO MARQUEE: REAL BRANDS USING NAANO                          */}
        {/* ============================================================== */}
        <div className="mt-16 pt-8 border-t border-slate-200/60">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-7">
            Trusted by fast-growing B2B tech leaders & scaleups
          </p>

          <div
            className="w-full overflow-hidden relative"
            style={{
              maskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
            }}
          >
            <div className="flex items-center animate-marquee whitespace-nowrap gap-12">
              {brandLogos.concat(brandLogos).map((item, idx) => (
                <div
                  key={idx}
                  className="shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-200"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={{ height: item.h }}
                    className="object-contain max-w-[140px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
