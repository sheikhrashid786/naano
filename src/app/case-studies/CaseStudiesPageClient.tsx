'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ArrowRight,
  Quote,
  Search,
  Users,
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
export interface CaseStudy {
  id: string;
  slug: string;
  company: string;
  logo: string;
  tagline: string;
  industry: string;
  metric: string;
  metricLabel: string;
  quote: string;
  author: string;
  role: string;
  creatorsUsed: string;
  pipelineAdded: string;
  impressions: string;
  clicks: string;
  summary: string;
  challenge?: string;
  strategy?: string;
  results?: string[];
  keyTakeaways?: string[];
}

interface CaseStudiesClientProps {
  initialCaseStudies?: CaseStudy[];
}

export default function CaseStudiesPageClient({ initialCaseStudies = [] }: CaseStudiesClientProps) {
  const caseStudies = initialCaseStudies;
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const industries = [
    'All',
    'AI & Developer Tools',
    'Sales Tech & Outbound',
    'CRM & Cloud',
    'Agencies & Enterprise',
  ];

  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter((cs) => {
      const matchesIndustry = selectedIndustry === 'All' || cs.industry === selectedIndustry;
      const matchesSearch =
        cs.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.metricLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesIndustry && matchesSearch;
    });
  }, [selectedIndustry, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 uppercase tracking-wider mb-4">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Proven Track Record</span>
          <span>•</span>
          <span className="font-mono">{caseStudies.length} Detailed Case Studies</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
          Client Case Studies &amp; Verified Results
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
          See how leading B2B software companies, scaleups, and agencies drive measurable customer acquisition and qualified pipeline using Naano creator campaigns.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 mb-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Industry Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedIndustry === ind
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, metric, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
        </div>
      </div>

      {/* Case Studies Grid - Direct links to standalone single pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCaseStudies.map((cs) => (
          <div
            key={cs.id}
            className="rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between overflow-hidden group p-7"
          >
            <div>
              {/* Header Bar */}
              <div className="flex items-center justify-between mb-5 pb-5 border-b border-slate-100">
                <img
                  src={cs.logo}
                  alt={cs.company}
                  className="h-7 max-w-[130px] object-contain grayscale group-hover:grayscale-0 transition-all"
                />
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  {cs.industry}
                </span>
              </div>

              {/* Main Metric Callout */}
              <div className="mb-5">
                <div className="text-4xl font-black text-indigo-600 font-mono tracking-tight">
                  {cs.metric}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                  {cs.metricLabel}
                </div>
                <p className="text-xs text-slate-600 mt-2 font-medium">
                  {cs.tagline}
                </p>
              </div>

              {/* Quote */}
              <div className="relative mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Quote className="w-5 h-5 text-indigo-200 mb-1 rotate-180" />
                <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-3">
                  &quot;{cs.quote}&quot;
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                  <span className="text-slate-900 font-bold">{cs.author}</span>
                  <span className="truncate max-w-[150px]">{cs.role}</span>
                </div>
              </div>

              {/* Metric stats row */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs mb-4">
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Pipeline Added</div>
                  <div className="font-extrabold text-emerald-600 font-mono mt-0.5">{cs.pipelineAdded}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Engagement</div>
                  <div className="font-extrabold text-slate-900 font-mono mt-0.5">{cs.clicks}</div>
                </div>
              </div>
            </div>

            {/* Direct Link to Standalone Single Case Study Page */}
            <div className="pt-4 border-t border-slate-100">
              <Link
                href={`/case-studies/${cs.slug}`}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all text-center flex items-center justify-center gap-2 group-hover:shadow-md"
              >
                <span>Read Full Case Study</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
