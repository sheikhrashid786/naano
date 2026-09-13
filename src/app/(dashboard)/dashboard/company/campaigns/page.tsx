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

// Stylized company logo matching reference screenshot & dynamic for all brands
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

  // If GT (Gomal Themes), render the stylized mark
  if (initials === 'GT') {
    return (
      <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none">
        {/* Red corner hook */}
        <path d="M6 6H20V10H10V22H6V6Z" fill="#DC2626" />
        {/* Black stylized T / stem */}
        <path d="M12 12H26V16H20V26H16V16H12V12Z" fill="#0F172A" />
        <path d="M14 22H24V26H14V22Z" fill="#0F172A" />
      </svg>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-[#0F172A] bg-slate-100">
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

  // Format date helper matching screenshot: "CREATED ON 13 SEPT 2026"
  function formatDate(dateStr: string) {
    try {
      const date = new Date(dateStr);
      const day = date.getDate();
      const monthNames = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEPT',
        'OCT',
        'NOV',
        'DEC',
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `CREATED ON ${day} ${month} ${year}`;
    } catch {
      const now = new Date();
      const monthNames = [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEPT',
        'OCT',
        'NOV',
        'DEC',
      ];
      return `CREATED ON ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative">
      <Header balance={0} user={currentUser} />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between animate-in fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')}>
              <X className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        )}

        {/* 1. TOP NOTICE BANNER (Matches Screenshot) */}
        <div className="rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs bg-white">
          <span className="font-bold text-sm text-[#0F172A]">
            Your first brief is ready
          </span>

          <button
            type="button"
            onClick={() => {
              if (campaigns.length > 0) {
                setSelectedBrief(campaigns[0]);
              }
            }}
            className="px-5 py-2 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-bold text-[#0F172A] shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            See my campaign
          </button>
        </div>

        {/* 2. TITLE ROW WITH PRIMARY ACTION BUTTON */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Campaigns
          </h1>

          <Link
            href="/dashboard/company/campaigns/new"
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create a campaign</span>
          </Link>
        </div>

        {/* 3. FILTER TABS & CAMPAIGN COUNT */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs self-start">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#EFF6FF] text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-[#EFF6FF] text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('draft')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'draft'
                  ? 'bg-[#EFF6FF] text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-[#EFF6FF] text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Completed
            </button>
          </div>

          <span className="text-xs text-[#64748B] font-medium">
            {filteredCampaigns.length} campaigns
          </span>
        </div>

        {/* 4. CAMPAIGNS GRID (2 COLUMNS MATCHING SCREENSHOT) */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
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

              // Dynamic campaign title directly from database
              const displayTitle =
                camp.title || `${activeCompanyName || 'Company'} creator brief`;

              return (
                <div
                  key={camp.id}
                  className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-2xs flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  <div>
                    {/* Sky-Blue Cloud Header Banner (hero-clouds.jpg) */}
                    <div className="h-32 relative overflow-hidden p-4 flex items-start justify-between">
                      {/* Realistic clouds background from public/images/hero-clouds.jpg */}
                      <img
                        src="/images/hero-clouds.jpg"
                        alt="Clouds"
                        className="absolute inset-0 w-full h-full object-cover object-[center_65%] pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-white/10" />

                      {/* Left: Logo & Status Badge */}
                      <div className="flex items-center gap-2.5 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-white border border-white/80 flex items-center justify-center shadow-xs overflow-hidden">
                          <CompanyLogoIcon
                            logoUrl={activeCompanyLogo}
                            name={activeCompanyName}
                          />
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-white/70 text-xs font-bold text-slate-800 shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>Active</span>
                        </span>
                      </div>

                      {/* Right: Date Pill */}
                      <span className="px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-white/70 text-[10px] font-bold uppercase text-[#475569] tracking-wider shadow-2xs relative z-10">
                        {formatDate(camp.createdAt)}
                      </span>
                    </div>

                    {/* Card Title & Description */}
                    <div className="px-6 pt-4 pb-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">
                        {displayTitle}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2 leading-relaxed">
                        {camp.description}
                      </p>
                    </div>

                    {/* 3-Metric Bar */}
                    <div className="mx-6 my-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl grid grid-cols-3 divide-x divide-[#E2E8F0] p-3.5 text-left">
                      <div className="px-2">
                        <span className="font-bold text-sm text-[#0F172A] block">
                          {creatorsCount}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] block font-medium">
                          Creators
                        </span>
                      </div>
                      <div className="px-2">
                        <span className="font-bold text-sm text-[#0F172A] block">
                          {publishedCount}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] block font-medium">
                          Published
                        </span>
                      </div>
                      <div className="px-2">
                        <span className="font-bold text-sm text-[#0F172A] block">
                          €{committedBudget}
                        </span>
                        <span className="text-[10px] text-[#94A3B8] block font-medium">
                          Committed budget
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-6 pb-5 pt-1 flex items-center justify-end gap-3 text-xs">
                    <Link
                      href="/dashboard/company/marketplace"
                      className="font-bold text-[#0F172A] hover:text-[#2563EB] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Open campaign</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <span className="text-slate-300 font-light">/</span>

                    <button
                      type="button"
                      onClick={() => setSelectedBrief(camp)}
                      className="font-bold text-[#0F172A] hover:text-[#2563EB] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>My brief</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteCampaign(camp.id, e)}
                      disabled={deletingId === camp.id}
                      className="w-8 h-8 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 flex items-center justify-center text-rose-500 transition-colors cursor-pointer ml-1 shadow-2xs"
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
              );
            })}

            {/* "CREATE A CAMPAIGN" DOTTED ACTION CARD (Matches Screenshot) */}
            <div className="rounded-3xl border-2 border-dashed border-[#D0E2FF] bg-white p-6 shadow-2xs flex flex-col justify-between hover:border-[#2563EB] transition-all">
              <div>
                {/* Soft Grey-Blue Header Area */}
                <div className="h-28 bg-[#F0F5FA] rounded-2xl p-4 flex items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs overflow-hidden">
                    <CompanyLogoIcon
                      logoUrl={companyLogo}
                      name={companyName}
                    />
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">
                  Create a campaign
                </h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                  Launch a new campaign in 2 minutes — with AI, the Naano team, or an existing link.
                </p>

                {/* 3-Metric Placeholder Bar */}
                <div className="my-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl grid grid-cols-3 divide-x divide-[#E2E8F0] p-3.5 text-left">
                  <div className="px-2">
                    <span className="font-bold text-sm text-[#94A3B8] block">—</span>
                    <span className="text-[10px] text-[#94A3B8] block font-medium">Creators</span>
                  </div>
                  <div className="px-2">
                    <span className="font-bold text-sm text-[#94A3B8] block">—</span>
                    <span className="text-[10px] text-[#94A3B8] block font-medium">Published</span>
                  </div>
                  <div className="px-2">
                    <span className="font-bold text-sm text-[#94A3B8] block">—</span>
                    <span className="text-[10px] text-[#94A3B8] block font-medium">
                      Committed budget
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard/company/campaigns/new"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <span>Get started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* BRIEF DETAILS MODAL (When clicking "My brief" or "See my campaign")       */}
      {/* ========================================================================= */}
      {selectedBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#2563EB] tracking-wider block">
                  Campaign Brief
                </span>
                <h3 className="text-lg font-black text-[#111827] mt-0.5">
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
                <span className="font-bold text-[#111827] block mb-1">Objective</span>
                <p className="text-[#64748B] leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                  {selectedBrief.objective}
                </p>
              </div>

              <div>
                <span className="font-bold text-[#111827] block mb-1">Company Description</span>
                <p className="text-[#64748B] leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                  {selectedBrief.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <span className="font-bold text-[#111827] block text-[11px]">Budget per post</span>
                  <span className="text-base font-black text-[#2563EB] block mt-0.5">
                    €{selectedBrief.budgetPerPost}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
                  <span className="font-bold text-[#111827] block text-[11px]">Target Audience</span>
                  <span className="text-xs font-semibold text-[#111827] block mt-0.5 truncate">
                    {selectedBrief.targetAudience || 'Founders, GTM, Executives'}
                  </span>
                </div>
              </div>

              {selectedBrief.brief && (
                <div className="space-y-3 pt-2">
                  {selectedBrief.brief.angle && (
                    <div>
                      <span className="font-bold text-[#111827] block mb-1">Campaign Angle</span>
                      <p className="text-[#64748B] leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                        {selectedBrief.brief.angle}
                      </p>
                    </div>
                  )}

                  {selectedBrief.brief.keyTalkingPoints && (
                    <div>
                      <span className="font-bold text-[#111827] block mb-1">Key Talking Points</span>
                      <p className="text-[#64748B] leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 whitespace-pre-line">
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
                className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <span>Find matching creators</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="px-4 py-2 bg-[#111827] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
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
