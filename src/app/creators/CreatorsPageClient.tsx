'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Lock,
  Layers,
  FileCheck2,
  Sliders,
  Award,
} from 'lucide-react';

export default function CreatorsPageClient() {
  const [followers, setFollowers] = useState<number>(25000);
  const [postsPerMonth, setPostsPerMonth] = useState<number>(3);

  // Dynamic calculations based on B2B marketplace benchmarks
  const baseRate = Math.max(120, Math.round(followers * 0.009));
  const monthlyEarnings = baseRate * postsPerMonth;

  return (
    <div className="pt-28 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-violet-300/30 to-indigo-300/20 blur-3xl pointer-events-none rounded-full -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for B2B Creators</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
            Monetize Your LinkedIn Influence with{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Zero Inbound Friction
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop negotiating in endless DM threads. Set your fixed price per post, receive prepaid campaign offers from vetted B2B SaaS companies, and get paid directly to your bank account.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register?role=creator"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Claim Your Creator Card</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-2xs transition-all"
            >
              <span>Creator Sign In</span>
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free to join
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-500" /> Escrow secured
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-violet-500" /> 100% upfront commitment
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Creator Earnings Calculator */}
      <section className="py-12">
        <div className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.08)] p-6 sm:p-8 lg:p-9 overflow-hidden">
            {/* Top Widget Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0 ring-4 ring-indigo-50">
                  <Sliders className="w-5 h-5 text-white stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                    Estimate Your Monthly Sponsored Post Revenue
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Based on active brand campaign budgets across the Naano network
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/70 self-start sm:self-auto font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Calculator</span>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-7">
              {/* Followers Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Your LinkedIn Followers
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold font-mono shadow-xs">
                    {followers >= 1000 ? `${(followers / 1000).toFixed(0)}k Followers` : `${followers} Followers`}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="120000"
                  step="2500"
                  value={followers}
                  onChange={(e) => setFollowers(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <button type="button" onClick={() => setFollowers(10000)} className="hover:text-slate-900 cursor-pointer">10k</button>
                  <button type="button" onClick={() => setFollowers(25000)} className="hover:text-slate-900 cursor-pointer">25k</button>
                  <button type="button" onClick={() => setFollowers(50000)} className="hover:text-slate-900 cursor-pointer">50k</button>
                  <button type="button" onClick={() => setFollowers(100000)} className="hover:text-slate-900 cursor-pointer">100k+</button>
                </div>
              </div>

              {/* Posts / month Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Sponsored Posts / Month
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold font-mono shadow-xs">
                    {postsPerMonth} {postsPerMonth === 1 ? 'Post' : 'Posts'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={postsPerMonth}
                  onChange={(e) => setPostsPerMonth(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <button type="button" onClick={() => setPostsPerMonth(1)} className="hover:text-slate-900 cursor-pointer">1 post</button>
                  <button type="button" onClick={() => setPostsPerMonth(2)} className="hover:text-slate-900 cursor-pointer">2 posts</button>
                  <button type="button" onClick={() => setPostsPerMonth(4)} className="hover:text-slate-900 cursor-pointer">4 posts</button>
                  <button type="button" onClick={() => setPostsPerMonth(8)} className="hover:text-slate-900 cursor-pointer">8 posts</button>
                </div>
              </div>
            </div>

            {/* Results Metric Strip - Luxury Card Style */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-5 border-t border-slate-100">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Recommended Rate</span>
                </div>
                <div className="border-l-2 border-indigo-500 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    €{baseRate}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Fixed rate per post</div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Annual Potential</span>
                </div>
                <div className="border-l-2 border-blue-500 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    €{(monthlyEarnings * 12).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Projected run-rate</div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Escrow Security</span>
                </div>
                <div className="border-l-2 border-purple-500 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    100%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Prepaid before drafting</div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] bg-gradient-to-br from-white to-emerald-50/30 hover:border-emerald-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Est. Monthly Income</span>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
                    €{monthlyEarnings.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Deposited to bank account</div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-7 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero platform exclusivity lock-in. You keep 100% editorial freedom over who you work with.</span>
              </div>

              <Link
                href="/register?role=creator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <span>Set Up Your Creator Card</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars for Creators */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Top Creators Prefer Naano
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Say goodbye to awkward price negotiations and chasing late invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">You Set Your Rate</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Decide exactly what your audience is worth. Brands book you at your posted price with zero haggle.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-indigo-600">100% Control</div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Pre-funded Escrow</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Brands deposit payment into escrow before you begin drafting. Once your post is live, funds unlock automatically.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-emerald-600">Never Chased Invoices</div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Vetted B2B Tech Brands</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Only reputable software brands, AI startups, and enterprise tech scaleups. Protect your editorial integrity.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-violet-600">No Spam Products</div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Live Creator Card</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Get a dedicated URL showcasing your engagement stats, verified past collaborations, and instant booking button.
                </p>
              </div>
              <div className="mt-4 text-[11px] font-bold text-sky-600">Share in Your Bio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Testimonial Banner */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center gap-8">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80"
              alt="Eric Nowosielski"
              className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-400 shrink-0"
            />
            <div className="space-y-3">
              <p className="text-base sm:text-lg italic text-slate-200 leading-relaxed">
                &quot;Naano completely changed how I run sponsored content. I don’t send contracts or chase payments anymore. Brands send a brief, the funds are deposited, and I publish what I believe in.&quot;
              </p>
              <div>
                <div className="font-bold text-white text-sm">Eric Nowosielski</div>
                <div className="text-xs text-indigo-400">48.5K LinkedIn Followers · €250/post</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
