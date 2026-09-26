'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Target,
  BarChart3,
  FileCheck2,
  CheckCircle2,
  Lock,
  Sparkles,
  Link as LinkIcon,
  MessageSquare,
  Check,
  X,
} from 'lucide-react';

export default function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<'match' | 'brief' | 'attribution'>('brief');

  const steps = [
    {
      num: '01',
      title: 'Precision ICP Matching',
      subtitle: 'Target your exact buyers',
      description: 'Filter through verified creators based on who actually engages with their content: SaaS founders, RevOps leaders, or SDR managers.',
      icon: Target,
      tag: 'Algorithmic Scouting',
    },
    {
      num: '02',
      title: 'Built-in Escrow Protection',
      subtitle: 'Zero financial risk',
      description: 'Funds are securely locked when a campaign starts. Payouts are only released once the live post URL and analytics proof are reviewed.',
      icon: Lock,
      tag: '100% Guaranteed',
    },
    {
      num: '03',
      title: 'Attributed Pipeline & Leads',
      subtitle: 'Beyond vanity impressions',
      description: 'Every post includes customized UTM link tracking and comment lead magnets to trace high-intent pipeline directly back to each creator.',
      icon: BarChart3,
      tag: 'Full-Funnel CRM Sync',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#FAFAFC] relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold border border-violet-100 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engineered for B2B Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
            How Naano Replaces Clunky Agency Retainers
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            A purpose-built operating system to discover, brief, contract, and measure B2B LinkedIn creator campaigns in minutes.
          </p>
        </div>

        {/* 3 Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200 font-mono">
                      {step.num}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/50">
                      {step.tag}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {step.title}
                  </h3>
                  <div className="text-xs font-semibold text-indigo-600 mt-1 mb-3">
                    {step.subtitle}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Automated in platform</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Campaign Brief Preview Box - Same light background as other sections */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Header - White background matching other sections */}
          <div className="p-7 sm:p-9 bg-white text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/80">
            <div className="max-w-2xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-indigo-600 font-mono">
                Live Campaign Architecture
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-900 tracking-tight mt-1">
                The Anatomy of a High-Converting Creator Brief
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-normal">
                Every collaboration on Naano includes structured guidelines so creators speak authentically while hitting key messaging points.
              </p>
            </div>

            {/* Tabs Switcher - Clean Light Segmented Control */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200/80 self-start md:self-center shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('brief')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'brief'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sample Brief
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('match')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'match'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Escrow Flow
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('attribution')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'attribution'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tracking Demo
              </button>
            </div>
          </div>

          {/* Tab Content Canvas */}
          <div className="p-6 sm:p-9 bg-slate-50/50">
            {activeTab === 'brief' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                {/* 1. Suggested Hook */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-3">
                      <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Suggested High-Retention Hook</span>
                    </div>
                    <div className="border-l-2 border-indigo-500 pl-4 py-0.5">
                      <p className="text-[14.5px] font-medium text-slate-900 leading-relaxed italic">
                        &ldquo;99% of AI cold outreach tools sound like generic bots. Here is the exact intent-driven workflow our team used to generate 42 qualified enterprise demos last month:&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Call-to-Action Strategy */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-3">
                      <LinkIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Call-to-Action Strategy</span>
                    </div>
                    <div className="border-l-2 border-emerald-500 pl-4 py-0.5">
                      <div className="text-sm font-semibold text-slate-900">Lead Magnet in 1st Comment</div>
                      <p className="text-[13.5px] text-slate-600 leading-relaxed mt-1">
                        Keep the post algorithm-friendly by instructing readers to comment <code className="font-mono font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 text-xs">&ldquo;PLAYBOOK&rdquo;</code> for the automated DM link.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Key Talking Points */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 uppercase tracking-widest mb-3">
                    <FileCheck2 className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Key Talking Points &amp; Differentiation</span>
                  </div>
                  <div className="border-l-2 border-slate-300 pl-4 py-0.5 space-y-2.5">
                    <div className="flex items-start gap-2.5 text-[13.5px] text-slate-700 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>Highlight native LinkedIn research enrichment vs. stale static scrapers.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[13.5px] text-slate-700 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>Showcase a 30-second screen recording of the actual workflow.</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-[13.5px] text-slate-700 leading-snug">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      <span>Mention the 14-day unrestricted trial (no credit card required).</span>
                    </div>
                  </div>
                </div>

                {/* 4. Platform Dos & Don'ts */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-3">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Platform Dos &amp; Don&apos;ts</span>
                    </div>
                    <div className="border-l-2 border-amber-500 pl-4 py-0.5 space-y-2.5">
                      <div className="text-[13px] sm:text-[13.5px] text-slate-700 leading-normal flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" /> DO:
                        </span>
                        <span>Use creator&apos;s authentic practitioner voice.</span>
                      </div>
                      <div className="text-[13px] sm:text-[13.5px] text-slate-700 leading-normal flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 shrink-0">
                          <X className="w-3.5 h-3.5 stroke-[2.5]" /> DO NOT:
                        </span>
                        <span>Sound like a corporate press release.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'match' && (
              <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider font-mono">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Automated Stripe Escrow Vault</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    How your campaign capital is guaranteed
                  </h4>
                  <div className="text-[13.5px] text-slate-600 space-y-2 leading-relaxed border-l-2 border-indigo-500 pl-4 py-0.5">
                    <p><strong className="text-slate-900 font-semibold">1. Budget Reserved:</strong> Campaign fee is secured in escrow upon invitation.</p>
                    <p><strong className="text-slate-900 font-semibold">2. Content Review:</strong> Creator drafts post adhering to your brief parameters.</p>
                    <p><strong className="text-slate-900 font-semibold">3. Verified Publish:</strong> Post goes live with unique tracking parameters.</p>
                    <p><strong className="text-slate-900 font-semibold">4. Direct Release:</strong> Capital is disbursed only after your sign-off.</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs text-center shrink-0 w-full sm:w-52">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Vault Protection</div>
                  <div className="text-base font-extrabold text-emerald-600 mt-1.5 flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Protected</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2 font-medium">0% Unapproved Risk</div>
                </div>
              </div>
            )}

            {activeTab === 'attribution' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">Multi-Channel Attribution Breakdown</h4>
                  <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    UTM-Tagged Campaign
                  </span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200/90 text-slate-700 rounded-xl font-mono text-xs overflow-x-auto shadow-2xs">
                  <span className="text-indigo-600 font-semibold">https://yourcompany.com/?</span>utm_source=linkedin&amp;utm_medium=creator&amp;utm_campaign=alexis_jarre&amp;utm_content=outbound_breakdown
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
                    <div className="text-xs text-slate-500 font-medium">Tracked Clicks</div>
                    <div className="text-2xl font-black text-slate-900 font-mono mt-1">238</div>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
                    <div className="text-xs text-slate-500 font-medium">Demos Booked</div>
                    <div className="text-2xl font-black text-emerald-600 font-mono mt-1">42</div>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
                    <div className="text-xs text-slate-500 font-medium">Pipeline Added</div>
                    <div className="text-2xl font-black text-indigo-600 font-mono mt-1">€18,400</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
