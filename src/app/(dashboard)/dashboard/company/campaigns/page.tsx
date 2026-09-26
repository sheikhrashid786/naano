'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import {
  Plus,
  ArrowRight,
  FileText,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  Sparkles,
  Layers,
  Users,
  TrendingUp,
  Briefcase,
  CheckCircle,
} from 'lucide-react';

interface CampaignItem {
  id: string;
  title: string;
  objective: string;
  description: string;
  budgetPerPost: number;
  status: string;
  createdAt: string;
  deliverables?: string | null;
  targetAudience?: string | null;
  company?: {
    id: string;
    name: string;
    logoUrl?: string | null;
  } | null;
  brief?: {
    angle?: string | null;
    suggestedHooks?: string | null;
    keyTalkingPoints?: string | null;
    dosAndDonts?: string | null;
    trackingUrl?: string | null;
    callToAction?: string | null;
  } | null;
  collaborations?: any[];
  _count?: {
    collaborations: number;
  };
}

// Stylized company logo
function CompanyLogoIcon({
  logoUrl,
  name,
}: {
  logoUrl?: string | null;
  name: string;
}) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-full h-full object-contain p-0.5"
      />
    );
  }

  const cleanName = name || 'Company';
  const initials = cleanName.slice(0, 2).toUpperCase();

  if (initials === 'GT') {
    return (
      <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
        <path d="M6 6H20V10H10V22H6V6Z" fill="#DC2626" />
        <path d="M12 12H26V16H20V26H16V16H12V12Z" fill="#0F172A" />
        <path d="M14 22H24V26H14V22Z" fill="#0F172A" />
      </svg>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-800 bg-slate-100">
      {initials}
    </div>
  );
}

export default function CompanyCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'draft' | 'completed'>('all');
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedBrief, setSelectedBrief] = useState<CampaignItem | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load user & company info
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          if (data.user.company?.name) {
            setCompanyName(data.user.company.name);
          }
          if (data.user.company?.logoUrl) {
            setCompanyLogo(data.user.company.logoUrl);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Load campaigns from API
  async function loadCampaigns() {
    setLoading(true);
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  // Delete a campaign
  async function handleDeleteCampaign(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/campaigns?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
        setToastMessage('Campaign deleted successfully.');
        setTimeout(() => setToastMessage(''), 3500);
      }
    } catch (e) {
    } finally {
      setDeletingId(null);
    }
  }

  // Filter campaigns by active tab
  const filteredCampaigns = campaigns.filter((c) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return c.status === 'ACTIVE';
    if (activeTab === 'draft') return c.status === 'DRAFT';
    if (activeTab === 'completed') return c.status === 'COMPLETED';
    return true;
  });

  const totalCommittedBudget = campaigns.reduce((acc, c) => {
    const count = c._count?.collaborations || c.collaborations?.length || 0;
    return acc + c.budgetPerPost * count;
  }, 0);

  function formatDate(dateStr: string) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Active';
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative font-sans">
      <Header balance={totalCommittedBudget} user={currentUser} />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between animate-in fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. TOP NOTICE BANNER (Forecaster Glassmorphic Banner) */}
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-sky-50/50 p-5 px-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.03)]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 block">
                Your first creator brief is active &amp; ready
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Matches are automatically calculated against verified B2B audience metrics.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (campaigns.length > 0) {
                setSelectedBrief(campaigns[0]);
              }
            }}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-900 shadow-2xs transition-all self-start sm:self-auto cursor-pointer shrink-0 active:scale-95"
          >
            Review active brief
          </button>
        </div>

        {/* 2. TITLE ROW WITH PRIMARY ACTION BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                <Briefcase className="w-3 h-3 text-indigo-400" />
                <span>Brand Campaigns</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {campaigns.length} Total Campaigns
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight">
              Campaigns Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage campaign briefs, monitor committed budgets, and book verified LinkedIn creators.
            </p>
          </div>

          <Link
            href="/dashboard/company/campaigns/new"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Campaign</span>
          </Link>
        </div>

        {/* 3. FILTER TABS & CAMPAIGN COUNT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 self-start">
            {[
              { id: 'all', label: 'All Campaigns', count: campaigns.length },
              { id: 'active', label: 'Active', count: campaigns.filter((c) => c.status === 'ACTIVE').length },
              { id: 'draft', label: 'Draft', count: campaigns.filter((c) => c.status === 'DRAFT').length },
              { id: 'completed', label: 'Completed', count: campaigns.filter((c) => c.status === 'COMPLETED').length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Showing <strong className="text-slate-900">{filteredCampaigns.length}</strong> of {campaigns.length} briefs
          </span>
        </div>

        {/* 4. CAMPAIGNS GRID (2 COLUMNS) */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-semibold">Loading campaigns...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* EXISTING CAMPAIGN CARDS */}
            {filteredCampaigns.map((camp) => {
              const creatorsCount =
                camp._count?.collaborations || camp.collaborations?.length || 0;
              const publishedCount =
                camp.collaborations?.filter(
                  (c) => c.status === 'COMPLETED' || c.status === 'APPROVED'
                ).length || 0;
              const committedBudget = camp.budgetPerPost * creatorsCount;
              const activeCompanyName = camp.company?.name || companyName;
              const activeCompanyLogo = camp.company?.logoUrl || companyLogo;

              const displayTitle =
                camp.title || `${activeCompanyName || 'Company'} creator brief`;

              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col justify-between hover:shadow-lg transition-all group"
                >
                  <div>
                    {/* Atmospheric Banner */}
                    <div className="h-32 relative overflow-hidden p-5 flex items-start justify-between bg-gradient-to-r from-slate-900 to-indigo-950">
                      <img
                        src="/images/hero-clouds.jpg"
                        alt="Clouds"
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                      {/* Left: Logo & Status Badge */}
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-white border border-white/90 flex items-center justify-center shadow-md overflow-hidden">
                          <CompanyLogoIcon
                            logoUrl={activeCompanyLogo}
                            name={activeCompanyName}
                          />
                        </div>

                        <div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-[11px] font-bold text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{camp.status || 'Active'}</span>
                          </span>
                          <span className="block text-[10px] text-white/70 font-mono mt-1">
                            {activeCompanyName}
                          </span>
                        </div>
                      </div>

                      {/* Right: Date Pill */}
                      <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold uppercase text-white/90 tracking-wider relative z-10">
                        {formatDate(camp.createdAt)}
                      </span>
                    </div>

                    {/* Card Title & Description */}
                    <div className="px-6 pt-5 pb-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        {displayTitle}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {camp.description || 'Targeted B2B creator collaboration brief.'}
                      </p>
                    </div>

                    {/* 3 Forecaster Metric Chips */}
                    <div className="mx-6 my-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 grid grid-cols-3 gap-3">
                      <div className="border-l-2 border-indigo-500 pl-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Creators
                        </div>
                        <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                          {creatorsCount}
                        </div>
                      </div>

                      <div className="border-l-2 border-emerald-500 pl-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Live Posts
                        </div>
                        <div className="text-lg font-black text-emerald-600 font-mono mt-0.5">
                          {publishedCount}
                        </div>
                      </div>

                      <div className="border-l-2 border-amber-500 pl-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Committed
                        </div>
                        <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                          €{committedBudget.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-6 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedBrief(camp)}
                      className="font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Inspect brief</span>
                    </button>

                    <div className="flex items-center gap-3">
                      <Link
                        href="/dashboard/company/marketplace"
                        className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Find Creators</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteCampaign(camp.id, e)}
                        disabled={deletingId === camp.id}
                        className="w-8 h-8 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 flex items-center justify-center text-rose-500 transition-colors cursor-pointer shadow-2xs"
                        title="Delete campaign"
                      >
                        {deletingId === camp.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* "CREATE A CAMPAIGN" DOTTED ACTION CARD */}
            <div className="rounded-3xl border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-gradient-to-b from-white to-slate-50/50 p-6 sm:p-7 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.02)] flex flex-col justify-between transition-all group">
              <div>
                <div className="h-28 bg-indigo-50/60 rounded-2xl p-4 flex items-center justify-center mb-5 border border-indigo-100/50">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center shadow-xs text-indigo-600 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6 stroke-[2.5]" />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Launch a New Campaign
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Generate an AI-optimized brief in under 2 minutes. Define target B2B buyer profiles, set budget-per-post, and invite pre-vetted creators.
                </p>

                {/* Forecaster Placeholder Bar */}
                <div className="my-5 p-4 rounded-2xl bg-white border border-slate-200/70 grid grid-cols-3 gap-3">
                  <div className="border-l-2 border-slate-300 pl-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Creators</span>
                    <span className="text-sm font-black text-slate-300 font-mono block mt-0.5">—</span>
                  </div>
                  <div className="border-l-2 border-slate-300 pl-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Live</span>
                    <span className="text-sm font-black text-slate-300 font-mono block mt-0.5">—</span>
                  </div>
                  <div className="border-l-2 border-slate-300 pl-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Budget</span>
                    <span className="text-sm font-black text-slate-300 font-mono block mt-0.5">—</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard/company/campaigns/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Build New Brief</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* BRIEF DETAILS MODAL                                                       */}
      {/* ========================================================================= */}
      {selectedBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  Campaign Brief Specification
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {selectedBrief.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Campaign Objective</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  {selectedBrief.objective}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Brand &amp; Product Context</span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  {selectedBrief.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 border-l-4 border-l-indigo-600">
                  <span className="font-bold text-slate-600 block text-[11px]">Budget per post</span>
                  <span className="text-xl font-black text-indigo-700 block mt-0.5 font-mono">
                    €{selectedBrief.budgetPerPost}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 border-l-4 border-l-emerald-500">
                  <span className="font-bold text-slate-600 block text-[11px]">Target Audience</span>
                  <span className="text-xs font-bold text-slate-900 block mt-1 truncate">
                    {selectedBrief.targetAudience || 'Founders, GTM, Executives'}
                  </span>
                </div>
              </div>

              {selectedBrief.brief && (
                <div className="space-y-3 pt-2">
                  {selectedBrief.brief.angle && (
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Content Angle</span>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                        {selectedBrief.brief.angle}
                      </p>
                    </div>
                  )}

                  {selectedBrief.brief.keyTalkingPoints && (
                    <div>
                      <span className="font-bold text-slate-900 block mb-1">Key Talking Points</span>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200 whitespace-pre-line">
                        {selectedBrief.brief.keyTalkingPoints}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Link
                href="/dashboard/company/marketplace"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
              >
                <span>Find matching creators</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
