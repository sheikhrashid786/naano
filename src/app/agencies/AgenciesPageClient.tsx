'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BarChart,
  Briefcase,
} from 'lucide-react';

export default function AgenciesPageClient() {
  const [clientCount, setClientCount] = useState<number>(4);
  const [avgPostsPerClient, setAvgPostsPerClient] = useState<number>(3);

  const totalMonthlyPosts = clientCount * avgPostsPerClient;
  const estimatedAgencyFeeSavings = Math.round(totalMonthlyPosts * 180); // Hours saved vs manual outreach

  return (
    <div>
      {/* Hero Banner (Section 1: Even - Tinted background) */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28 banner-section bg-[#EBF1EE] border-b border-slate-200/80 section-even">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-gradient-to-tr from-emerald-200/40 via-teal-200/30 to-emerald-100/30 blur-3xl pointer-events-none rounded-full -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 uppercase tracking-wider mb-6">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Naano for Agencies & Consultancies</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
            Scale LinkedIn Creator Campaigns Across{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              All Your B2B Clients
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate manual creator sourcing, messy spreadsheets, and legal friction. Manage multiple brand accounts, pool campaign budgets, and deliver white-label pipeline attribution reports.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register?role=brand"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Create Agency Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/#creators"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-2xs transition-all"
            >
              <span>Explore Creator Network</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Agency ROI & Efficiency Calculator (Section 2: Odd - Clean White) */}
      <section className="py-20 bg-white border-b border-slate-200/80 section-odd">
        <div className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-slate-50/70 border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.08)] p-6 sm:p-8 lg:p-9 overflow-hidden">
            {/* Top Widget Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 shrink-0 ring-4 ring-emerald-50">
                  <BarChart className="w-5 h-5 text-white stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight">
                    Agency Efficiency &amp; Capacity Forecaster
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    See how many creator hours Naano saves your account team every month
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
              {/* Clients Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Active B2B Clients
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold font-mono shadow-xs">
                    {clientCount} {clientCount === 1 ? 'Client' : 'Clients'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={clientCount}
                  onChange={(e) => setClientCount(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <button type="button" onClick={() => setClientCount(2)} className="hover:text-slate-900 cursor-pointer">2 clients</button>
                  <button type="button" onClick={() => setClientCount(5)} className="hover:text-slate-900 cursor-pointer">5 clients</button>
                  <button type="button" onClick={() => setClientCount(10)} className="hover:text-slate-900 cursor-pointer">10 clients</button>
                  <button type="button" onClick={() => setClientCount(20)} className="hover:text-slate-900 cursor-pointer">20 clients</button>
                </div>
              </div>

              {/* Posts / Client Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Creator Posts / Client / Month
                  </label>
                  <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold font-mono shadow-xs">
                    {avgPostsPerClient} {avgPostsPerClient === 1 ? 'Post' : 'Posts'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={avgPostsPerClient}
                  onChange={(e) => setAvgPostsPerClient(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                />
                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                  <button type="button" onClick={() => setAvgPostsPerClient(1)} className="hover:text-slate-900 cursor-pointer">1 post</button>
                  <button type="button" onClick={() => setAvgPostsPerClient(3)} className="hover:text-slate-900 cursor-pointer">3 posts</button>
                  <button type="button" onClick={() => setAvgPostsPerClient(6)} className="hover:text-slate-900 cursor-pointer">6 posts</button>
                  <button type="button" onClick={() => setAvgPostsPerClient(10)} className="hover:text-slate-900 cursor-pointer">10 posts</button>
                </div>
              </div>
            </div>

            {/* Results Metric Strip - Luxury Card Style */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-5 border-t border-slate-100">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-emerald-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Total Output</span>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    {totalMonthlyPosts} Posts
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Across {clientCount} client brands</div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-teal-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Admin Hours Saved</span>
                </div>
                <div className="border-l-2 border-teal-500 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    ~{Math.round(totalMonthlyPosts * 4.5)} hrs
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Zero manual outreach</div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-emerald-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Escrow Compliance</span>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    100%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Prepaid holding vault</div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] bg-gradient-to-br from-white to-emerald-50/40 hover:border-emerald-300 transition-all">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Operational Savings</span>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                  <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
                    €{estimatedAgencyFeeSavings.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Saved in manual sourcing</div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="mt-7 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Multi-tenant client accounts, pooled billing, and white-label client PDF summaries.</span>
              </div>

              <Link
                href="/register?role=brand"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95 shrink-0"
              >
                <span>Create Agency Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Agency Features (Section 3: Even - Tinted) */}
      <section className="py-24 bg-[#EBF1EE] border-b border-slate-200/80 section-even">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-6">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Multi-Tenant Workspaces</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Separate client campaigns, distinct creator rosters, and isolated brief permissions under one master agency billing account.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-6">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">White-Label Reporting</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Export client-ready executive PDF summaries with live impression totals, click counts, conversion rates, and publication proofs.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Consolidated Invoicing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                One monthly invoice for your accounting team. No more tracking 20 separate creator PayPal transfers and tax forms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
