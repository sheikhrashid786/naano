'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/dashboard/Header';
import ApplyCampaignModal from '@/components/dashboard/ApplyCampaignModal';
import { 
  Search, 
  ChevronDown, 
  Globe, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  X
} from 'lucide-react';

function getChannel(camp: any): string {
  const d = (camp.deliverables || camp.description || '').toLowerCase();
  if (d.includes('twitter') || d.includes('x.com')) return 'X';
  if (d.includes('youtube')) return 'YouTube';
  return 'LinkedIn';
}

function computeDaysLeft(camp: any): string {
  if (camp.endDate) {
    const diff = new Date(camp.endDate).getTime() - Date.now();
    const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    return `${days} days`;
  }
  const created = new Date(camp.createdAt || Date.now()).getTime();
  const diffDays = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
  const remaining = Math.max(1, 14 - diffDays);
  return `${remaining > 10 ? 6 : remaining} days`;
}

function computeMatchScore(creator: any, camp: any): { percentage: number; score: string } {
  if (!creator) return { percentage: 100, score: '100/100' };

  let score = 80;
  const creatorInd = (creator.industry || creator.niche || '').toLowerCase();
  const campInd = (camp.company?.industry || camp.title || '').toLowerCase();

  if (creatorInd && campInd) {
    if (creatorInd.includes(campInd) || campInd.includes(creatorInd)) {
      score += 15;
    } else if (campInd.includes('saas') || campInd.includes('tech') || campInd.includes('email') || campInd.includes('search') || campInd.includes('ai')) {
      score += 10;
    }
  }

  const budget = camp.budgetPerPost || 200;
  const creatorRate = creator.pricePerPost || 200;
  if (budget >= creatorRate * 0.8) {
    score += 10;
  }

  const finalPercentage = Math.min(100, Math.max(85, score));
  return {
    percentage: finalPercentage,
    score: `${finalPercentage}/100`,
  };
}

function renderCompanyLogo(company: { name: string; logoUrl?: string | null }) {
  if (company.logoUrl) {
    return (
      <img
        src={company.logoUrl}
        alt={company.name}
        className="w-full h-full object-cover"
      />
    );
  }

  const name = company.name || 'Brand';
  const nameLower = name.toLowerCase();

  if (nameLower.includes('premium')) {
    return (
      <div className="w-full h-full bg-[#111827] flex items-center justify-center">
        <span className="text-white font-black text-lg tracking-tight">PI</span>
        <span className="w-1.5 h-3.5 bg-[#F59E0B] ml-0.5 rounded-xs" />
      </div>
    );
  }

  if (nameLower.includes('orbi')) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-[2.5px] border-[#111827] flex items-center justify-center" />
      </div>
    );
  }

  if (nameLower.includes('attio')) {
    return (
      <div className="w-full h-full bg-[#111827] flex items-center justify-center">
        <span className="text-white font-black text-xl tracking-tight">A</span>
      </div>
    );
  }

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    'bg-gradient-to-br from-blue-600 to-indigo-700 text-white',
    'bg-gradient-to-br from-violet-600 to-purple-800 text-white',
    'bg-gradient-to-br from-emerald-600 to-teal-700 text-white',
    'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
    'bg-gradient-to-br from-slate-800 to-slate-900 text-white',
  ];
  const colorIndex = (name.charCodeAt(0) || 0) % colors.length;

  return (
    <div className={`w-full h-full ${colors[colorIndex]} flex items-center justify-center font-black text-base tracking-tight`}>
      {initials}
    </div>
  );
}

export default function CreatorMarketplacePage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeChannel, setActiveChannel] = useState<'all' | 'linkedin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  
  const [selectedCampaignForApply, setSelectedCampaignForApply] = useState<any | null>(null);
  const [selectedBrief, setSelectedBrief] = useState<any | null>(null);
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [campsRes, profileRes] = await Promise.all([
          fetch('/api/campaigns'),
          fetch('/api/creator/profile'),
        ]);

        if (campsRes.ok) {
          const data = await campsRes.json();
          setCampaigns(data.campaigns || []);
        }

        if (profileRes.ok) {
          const pData = await profileRes.json();
          setCreator(pData.creator || null);
        }
      } catch (e) {
        console.error('Failed to load marketplace data:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Dynamically extract unique industries from active campaigns
  const availableIndustries = useMemo(() => {
    const list = campaigns.map((c) => c.company?.industry).filter(Boolean);
    return Array.from(new Set(list));
  }, [campaigns]);

  // Dynamically extract target audience countries/regions from active campaigns
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    campaigns.forEach((c) => {
      if (c.targetAudience) {
        c.targetAudience.split('·').forEach((item: string) => {
          const trimmed = item.trim();
          if (trimmed) set.add(trimmed);
        });
      }
    });
    return Array.from(set);
  }, [campaigns]);

  // Dynamically calculate counts per channel
  const linkedinCampaignsCount = useMemo(() => {
    return campaigns.filter((c) => getChannel(c).toLowerCase() === 'linkedin').length;
  }, [campaigns]);

  // Filter and sort campaigns dynamically
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((camp) => {
        // Channel filter
        if (activeChannel === 'linkedin' && getChannel(camp).toLowerCase() !== 'linkedin') {
          return false;
        }

        // Search text
        const titleMatch = camp.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const companyMatch = camp.company?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = camp.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const audienceMatch = camp.targetAudience?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSearch = !searchQuery || titleMatch || companyMatch || descMatch || audienceMatch;

        // Industry filter
        const matchesIndustry =
          selectedIndustry === 'all' ||
          camp.company?.industry?.toLowerCase() === selectedIndustry.toLowerCase();

        // Country / Region filter
        const matchesCountry =
          selectedCountry === 'all' ||
          camp.targetAudience?.toLowerCase().includes(selectedCountry.toLowerCase());

        return matchesSearch && matchesIndustry && matchesCountry;
      })
      .sort((a, b) => {
        if (sortBy === 'budget') {
          return (b.budgetPerPost || 0) - (a.budgetPerPost || 0);
        }
        if (sortBy === 'name') {
          return (a.company?.name || '').localeCompare(b.company?.name || '');
        }
        // default relevance: higher match score first
        const matchA = computeMatchScore(creator, a).percentage;
        const matchB = computeMatchScore(creator, b).percentage;
        return matchB - matchA;
      });
  }, [campaigns, activeChannel, searchQuery, selectedIndustry, selectedCountry, sortBy, creator]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Sticky Header with dynamic user info */}
      <Header
        user={{
          name: creator?.user?.name,
          avatarUrl: creator?.user?.avatarUrl,
        }}
        balance={0}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        {/* Success Toast */}
        {successToast && (
          <div className="p-4 bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold rounded-2xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')} className="text-[#065F46] hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Heading & Subtitle */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
            Opportunities
          </h1>
          <p className="text-xs sm:text-[13px] text-[#64748B] mt-1.5 font-normal">
            Open brand campaigns - apply, the brand accepts, and the booking is created on your terms.
          </p>
        </div>

        {/* Dynamic Channel Filter Pills */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveChannel('all')}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeChannel === 'all'
                ? 'bg-[#2864EA] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#111827]'
            }`}
          >
            <span>All channels</span>
            <span className={`text-[10px] font-bold ${activeChannel === 'all' ? 'text-white/80' : 'text-[#94A3B8]'}`}>
              {campaigns.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('linkedin')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeChannel === 'linkedin'
                ? 'bg-[#2864EA] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#111827]'
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z" />
            </svg>
            <span>LinkedIn</span>
            <span className="text-[10px] font-bold text-[#94A3B8]">{linkedinCampaignsCount}</span>
          </button>
        </div>

        {/* Dynamic Search & Dropdown Filters Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a campaign or a brand..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#111827] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2864EA] shadow-2xs"
            />
          </div>

          {/* Dynamic Industry Filter */}
          <div className="relative">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="appearance-none bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 pr-8 text-xs font-medium text-[#475569] hover:bg-slate-50 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">All industries</option>
              {availableIndustries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Dynamic Country/Region Filter */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="appearance-none bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 pr-8 text-xs font-medium text-[#475569] hover:bg-slate-50 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">All countries</option>
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-[#E2E8F0] rounded-xl px-4 py-2 pr-8 text-xs font-medium text-[#475569] hover:bg-slate-50 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="relevance">Relevance (default)</option>
              <option value="budget">Highest Budget</option>
              <option value="name">Brand Name</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dynamic Campaign Cards Grid */}
        {loading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#2864EA]" />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-12 text-center shadow-xs">
            <p className="text-sm font-bold text-[#111827]">No opportunities match your search</p>
            <p className="text-xs text-[#64748B] mt-1">Try resetting the search bar or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
            {filteredCampaigns.map((camp) => {
              const companyName = camp.company?.name || 'Brand';
              const channelName = getChannel(camp);
              const daysLeft = computeDaysLeft(camp);
              const match = computeMatchScore(creator, camp);

              return (
                <div
                  key={camp.id}
                  className="bg-white border border-[#E2E8F0] rounded-[28px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-4 sm:p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  {/* Top Cloud Graphic Banner */}
                  <div className="h-28 rounded-t-[20px] relative p-3 flex items-start justify-between overflow-hidden">
                    <img
                      src="/images/hero-clouds.jpg"
                      alt="Clouds banner"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-white/10" />

                    {/* Top Left: LinkedIn Pill Badge */}
                    <span className="relative z-10 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-full border border-slate-200/60 text-[10px] font-bold text-[#1E293B] shadow-2xs">
                      {channelName === 'LinkedIn' ? (
                        <svg className="w-3 h-3 fill-[#0A66C2]" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z" />
                        </svg>
                      ) : (
                        <Globe className="w-3 h-3 text-[#2864EA]" />
                      )}
                      <span>{channelName}</span>
                    </span>

                    {/* Top Right: Match Percentage Badge */}
                    <span className="relative z-10 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-full border border-slate-200/60 text-[10px] font-bold text-[#2563EB] shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      <span>{match.percentage}% match</span>
                    </span>
                  </div>

                  {/* Dynamic Company Logo Overlapping Banner */}
                  <div className="-mt-8 flex justify-center relative z-20">
                    <div className="w-15 h-15 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                      {renderCompanyLogo(camp.company)}
                    </div>
                  </div>

                  {/* Company Title & Details */}
                  <div className="text-center mt-3">
                    <h3 className="text-base font-bold text-[#111827] tracking-tight">
                      {companyName}
                    </h3>
                    <p className="text-xs text-[#64748B] mt-0.5 font-medium">
                      {camp.title}
                    </p>
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-[10.5px] font-medium text-[#475569] mt-2.5">
                      <Globe className="w-3 h-3 text-[#64748B]" />
                      <span>{camp.targetAudience || 'Europe · North America'}</span>
                    </div>
                  </div>

                  {/* Audience Relevance Progress Bar */}
                  <div className="mt-5 px-2">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-[#64748B] font-medium italic">Audience relevance</span>
                      <span className="text-[#2864EA] font-bold">{match.score}</span>
                    </div>
                    <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#2864EA] rounded-full transition-all duration-500" 
                        style={{ width: `${match.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* 3 Metrics Block (Dynamic Match, Channel & Deadline) */}
                  <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl p-3.5 mt-4 grid grid-cols-3 text-center">
                    <div className="px-1">
                      <div className="text-xs sm:text-sm font-bold text-[#111827]">{match.score}</div>
                      <div className="text-[9.5px] font-bold text-[#8C95A6] uppercase tracking-wider mt-0.5">
                        MATCH
                      </div>
                    </div>
                    <div className="px-1 border-x border-[#E2E8F0]/60">
                      <div className="text-xs sm:text-sm font-bold text-[#111827]">{channelName}</div>
                      <div className="text-[9.5px] font-bold text-[#8C95A6] uppercase tracking-wider mt-0.5">
                        CHANNEL
                      </div>
                    </div>
                    <div className="px-1">
                      <div className="text-xs sm:text-sm font-bold text-[#111827]">{daysLeft}</div>
                      <div className="text-[9.5px] font-bold text-[#8C95A6] uppercase tracking-wider mt-0.5">
                        POST DEADLINE
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2.5 mt-4 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedBrief(camp)}
                      className="flex-1 py-2.5 px-3 bg-white border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#334155] hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-98"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#475569]" />
                      <span>View the brief</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCampaignForApply(camp)}
                      className="flex-1 py-2.5 px-3 bg-[#2864EA] hover:bg-[#1e52c8] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs text-center flex items-center justify-center active:scale-98"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Campaign Brief Modal (Dynamic details) */}
      {selectedBrief && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#2864EA] bg-[#EFF6FF] px-2.5 py-1 rounded-full">
                  Campaign Brief
                </span>
                <h3 className="text-lg font-bold text-[#111827] mt-2">
                  {selectedBrief.company?.name}: {selectedBrief.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBrief(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-[#64748B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#475569]">
              <div>
                <h4 className="font-bold text-[#111827] mb-1">Campaign Objective</h4>
                <p className="leading-relaxed">{selectedBrief.description || selectedBrief.objective}</p>
              </div>

              {selectedBrief.deliverables && (
                <div className="p-3.5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl">
                  <h4 className="font-bold text-[#111827] mb-1">Deliverables</h4>
                  <p className="leading-relaxed">{selectedBrief.deliverables}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl">
                  <span className="text-[10px] text-[#8C95A6] font-bold uppercase">Budget per post</span>
                  <div className="text-sm font-bold text-[#111827] mt-0.5">€{selectedBrief.budgetPerPost || 240}</div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl">
                  <span className="text-[10px] text-[#8C95A6] font-bold uppercase">Target Audience</span>
                  <div className="text-sm font-bold text-[#111827] mt-0.5 truncate">{selectedBrief.targetAudience || 'Europe · North America'}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="flex-1 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const camp = selectedBrief;
                  setSelectedBrief(null);
                  setSelectedCampaignForApply(camp);
                }}
                className="flex-1 py-2.5 bg-[#2864EA] hover:bg-[#1e52c8] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Apply for Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Campaign Modal */}
      {selectedCampaignForApply && (
        <ApplyCampaignModal
          campaign={selectedCampaignForApply}
          onClose={() => setSelectedCampaignForApply(null)}
          onSuccess={() => {
            setSuccessToast(`Application submitted to ${selectedCampaignForApply.company.name}!`);
            setTimeout(() => setSuccessToast(''), 5000);
          }}
        />
      )}

      {/* Floating Chat Bubble Widget in bottom right matching screenshot */}
      <button
        type="button"
        aria-label="Support chat"
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#64748B] hover:bg-[#475569] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer z-50 hover:scale-105 active:scale-95"
      >
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.477 3 2 6.94 2 11.8c0 2.76 1.44 5.22 3.7 6.8-.24 1.42-.98 2.68-1.02 2.75-.12.22-.05.49.16.63.1.07.22.1.34.1.1 0 .2-.03.29-.08 2.1-1.22 3.8-2.22 4.34-2.54.71.16 1.45.24 2.19.24 5.523 0 10-3.94 10-8.8S17.523 3 12 3z" />
        </svg>
      </button>
    </div>
  );
}
