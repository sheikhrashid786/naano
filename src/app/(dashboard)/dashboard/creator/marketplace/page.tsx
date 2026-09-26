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
  X,
  Store,
  Sparkles,
  ArrowRight,
  TrendingUp,
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
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <span className="text-white font-black text-lg tracking-tight">PI</span>
        <span className="w-1.5 h-3.5 bg-amber-500 ml-0.5 rounded-xs" />
      </div>
    );
  }

  if (nameLower.includes('orbi')) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-[2.5px] border-slate-900 flex items-center justify-center" />
      </div>
    );
  }

  if (nameLower.includes('attio')) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center">
        <span className="text-white font-black text-xl tracking-tight">A</span>
      </div>
    );
  }

  const initials = name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
      <span className="text-emerald-700 font-black text-base">{initials}</span>
    </div>
  );
}

export default function CreatorMarketplacePage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState<any>(null);

  // Filters & Search
  const [activeChannel, setActiveChannel] = useState<'all' | 'linkedin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');

  // Modals & User Feedback
  const [selectedBrief, setSelectedBrief] = useState<any | null>(null);
  const [selectedCampaignForApply, setSelectedCampaignForApply] = useState<any | null>(null);
  const [successToast, setSuccessToast] = useState('');

  // Fetch current creator profile & campaigns
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [authRes, campRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/campaigns'),
        ]);

        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData?.user?.creator) {
            setCreator({
              ...authData.user.creator,
              user: {
                name: authData.user.name,
                avatarUrl: authData.user.avatarUrl,
              },
            });
          }
        }

        if (campRes.ok) {
          const campData = await campRes.json();
          setCampaigns(campData.campaigns || []);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const availableIndustries = useMemo(() => {
    const set = new Set<string>();
    campaigns.forEach((c) => {
      if (c.company?.industry) set.add(c.company.industry);
    });
    return Array.from(set);
  }, [campaigns]);

  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    campaigns.forEach((c) => {
      if (c.targetAudience) set.add(c.targetAudience);
    });
    return Array.from(set);
  }, [campaigns]);

  const linkedinCampaignsCount = useMemo(() => {
    return campaigns.filter((c) => getChannel(c) === 'LinkedIn').length;
  }, [campaigns]);

  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((camp) => {
        if (activeChannel === 'linkedin' && getChannel(camp) !== 'LinkedIn') {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = camp.title?.toLowerCase().includes(q);
          const matchCompany = camp.company?.name?.toLowerCase().includes(q);
          const matchDesc = camp.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchCompany && !matchDesc) return false;
        }

        if (selectedIndustry !== 'all' && camp.company?.industry !== selectedIndustry) {
          return false;
        }

        if (selectedCountry !== 'all' && camp.targetAudience !== selectedCountry) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'budget') {
          return (b.budgetPerPost || 0) - (a.budgetPerPost || 0);
        }
        if (sortBy === 'name') {
          return (a.company?.name || '').localeCompare(b.company?.name || '');
        }
        const matchA = computeMatchScore(creator, a).percentage;
        const matchB = computeMatchScore(creator, b).percentage;
        return matchB - matchA;
      });
  }, [campaigns, activeChannel, searchQuery, selectedIndustry, selectedCountry, sortBy, creator]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative font-sans">
      <Header
        user={{
          name: creator?.user?.name,
          avatarUrl: creator?.user?.avatarUrl,
        }}
        balance={0}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* Success Toast */}
        {successToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Heading & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                <Store className="w-3 h-3 text-emerald-400" />
                <span>Campaign Marketplace</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {campaigns.length} Open Opportunities
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight">
              Brand Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Apply to active brand campaigns with verified escrow funding on your own rate terms.
            </p>
          </div>
        </div>

        {/* Channel Filter Pills */}
        <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 self-start">
          <button
            type="button"
            onClick={() => setActiveChannel('all')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeChannel === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>All Channels</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${activeChannel === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {campaigns.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveChannel('linkedin')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeChannel === 'linkedin'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className="font-bold text-[11px] text-[#0A66C2]">in</span>
            <span>LinkedIn</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${activeChannel === 'linkedin' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {linkedinCampaignsCount}
            </span>
          </button>
        </div>

        {/* Dynamic Search & Dropdown Filters Bar */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a campaign brief or a brand..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:bg-white transition-all"
            />
          </div>

          <div className="relative">
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">All Industries</option>
              {availableIndustries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="all">All Regions</option>
              {availableCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="relevance">Relevance (Match Score)</option>
              <option value="budget">Highest Budget First</option>
              <option value="name">Brand Name A-Z</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Dynamic Campaign Cards Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-xs font-semibold">Loading brand campaigns...</span>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-2xs">
            <p className="text-sm font-bold text-slate-900">No opportunities match your filter</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the search terms or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {filteredCampaigns.map((camp) => {
              const companyName = camp.company?.name || 'Brand';
              const channelName = getChannel(camp);
              const daysLeft = computeDaysLeft(camp);
              const match = computeMatchScore(creator, camp);

              return (
                <div
                  key={camp.id}
                  className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Atmospheric Graphic Banner */}
                    <div className="h-32 bg-gradient-to-r from-[#070D0A] via-[#064E3B] to-[#070D0A] p-4 flex items-start justify-between relative overflow-hidden">
                      <img
                        src="/images/hero-clouds.jpg"
                        alt="Clouds banner"
                        className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay pointer-events-none"
                      />

                      {/* Top Left: Channel Pill Badge */}
                      <span className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-bold text-white shadow-2xs">
                        <span>{channelName}</span>
                      </span>

                      {/* Top Right: Match Percentage Badge */}
                      <span className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-400/30 text-[11px] font-bold text-emerald-300 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{match.percentage}% match</span>
                      </span>
                    </div>

                    {/* Dynamic Company Logo Overlapping Banner */}
                    <div className="-mt-9 flex justify-center relative z-20">
                      <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
                        {renderCompanyLogo(camp.company)}
                      </div>
                    </div>

                    {/* Company Title & Details */}
                    <div className="text-center px-5 pt-3 pb-1">
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        {companyName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 font-medium">
                        {camp.title}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[10.5px] font-medium text-slate-600 mt-2.5">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{camp.targetAudience || 'Europe · North America'}</span>
                      </div>
                    </div>

                    {/* Audience Relevance Progress Bar */}
                    <div className="mt-4 px-6">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-slate-500 font-medium">Audience match</span>
                        <span className="text-emerald-700 font-bold font-mono">{match.score}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                          style={{ width: `${match.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Forecaster 3-Metric Chips Bar */}
                    <div className="mx-6 my-4 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 grid grid-cols-3 gap-2 text-left">
                      <div className="border-l-2 border-emerald-500 pl-2.5">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          BUDGET
                        </div>
                        <div className="text-xs sm:text-sm font-black text-slate-900 font-mono mt-0.5">
                          €{camp.budgetPerPost || 240}
                        </div>
                      </div>

                      <div className="border-l-2 border-emerald-500 pl-2.5">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          CHANNEL
                        </div>
                        <div className="text-xs sm:text-sm font-black text-slate-900 font-mono mt-0.5">
                          {channelName}
                        </div>
                      </div>

                      <div className="border-l-2 border-amber-500 pl-2.5">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                          CLOSES
                        </div>
                        <div className="text-xs sm:text-sm font-black text-slate-900 font-mono mt-0.5">
                          {daysLeft}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="p-6 pt-0 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedBrief(camp)}
                      className="flex-1 py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Inspect Brief</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCampaignForApply(camp)}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/20 text-center flex items-center justify-center active:scale-95"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Campaign Brief Modal */}
      {selectedBrief && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                  Verified Brand Brief
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  {selectedBrief.company?.name}: {selectedBrief.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBrief(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Campaign Objective</h4>
                <p className="leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">{selectedBrief.description || selectedBrief.objective}</p>
              </div>

              {selectedBrief.deliverables && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Deliverables Required</h4>
                  <p className="leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">{selectedBrief.deliverables}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 border-l-4 border-l-emerald-600 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">Budget per post</span>
                  <div className="text-lg font-black text-emerald-800 mt-0.5 font-mono">€{selectedBrief.budgetPerPost || 240}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 border-l-4 border-l-emerald-500 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">Target Audience</span>
                  <div className="text-xs font-bold text-slate-900 mt-1 truncate">{selectedBrief.targetAudience || 'Europe · North America'}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
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
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/20"
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
    </div>
  );
}
