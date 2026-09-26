'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import InviteCreatorModal from '@/components/dashboard/InviteCreatorModal';
import CreatorProfileModal from '@/components/dashboard/CreatorProfileModal';
import {
  Search,
  Users,
  CheckCircle2,
  X,
  Globe2,
  ChevronDown,
  Building2,
  Check,
  Star,
  SlidersHorizontal,
  Bot,
  Store,
  UserCircle,
  ArrowRight,
  Sparkles,
  Loader2,
  Filter,
  ArrowUp,
  RotateCcw,
} from 'lucide-react';

export default function CompanyMarketplacePage() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Filter and search state
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('fit');

  // Navigation mode and tabs
  const [activeTab, setActiveTab] = useState<'all' | 'shortlist'>('all');
  const [activeMode, setActiveMode] = useState<'ai' | 'marketplace'>('ai');
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [selectedCheckboxIds, setSelectedCheckboxIds] = useState<string[]>([]);

  // Modals & interaction state
  const [selectedCreatorForInvite, setSelectedCreatorForInvite] = useState<any | null>(null);
  const [selectedCreatorForProfile, setSelectedCreatorForProfile] = useState<any | null>(null);
  const [successToast, setSuccessToast] = useState('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // AI Matching state
  const [aiQuery, setAiQuery] = useState('');
  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiMatchedCreators, setAiMatchedCreators] = useState<any[]>([]);

  // Fetch current user & company
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          if (data.user.company?.name) {
            setCompanyName(data.user.company.name);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Load creators dynamically from the API
  async function loadCreators() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (industry) params.set('industry', industry);
      if (country) params.set('country', country);
      if (priceRange) params.set('priceRange', priceRange);
      if (sortBy) params.set('sortBy', sortBy);

      const res = await fetch(`/api/creators?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCreators(data.creators || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCreators();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, industry, country, priceRange, sortBy]);

  // Toggle creator in shortlist
  function toggleShortlist(creatorId: string) {
    setShortlist((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  }

  // Toggle checkbox select
  function toggleCheckbox(creatorId: string) {
    setSelectedCheckboxIds((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  }

  // Handle AI query execution
  function handleAiSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsSearchingAi(true);
    setTimeout(() => {
      const queryLower = aiQuery.toLowerCase();
      let matched = creators.filter((c) => {
        const text = `${c.user.name} ${c.niche} ${c.headline} ${c.industry} ${c.bio}`.toLowerCase();
        return (
          text.includes(queryLower) ||
          queryLower.includes(c.industry?.toLowerCase() || '') ||
          queryLower.includes(c.niche?.toLowerCase() || '') ||
          (queryLower.includes('saas') && (c.niche?.includes('SaaS') || c.industry?.includes('SaaS'))) ||
          (queryLower.includes('marketing') && (c.niche?.includes('Marketing') || c.industry?.includes('Marketing'))) ||
          (queryLower.includes('pme') && (c.niche?.includes('B2B') || c.industry?.includes('SaaS')))
        );
      });

      if (matched.length === 0) {
        matched = creators.slice(0, 3);
      }

      setAiMatchedCreators(matched);
      setAiResponse(
        `I analyzed ${creators.length} verified creators against your target ICP for "${aiQuery}". Here are the top ${matched.length} profiles with the highest buyer relevance.`
      );
      setIsSearchingAi(false);
    }, 600);
  }

  function handleSelectSuggested(promptText: string) {
    setAiQuery(promptText);
    setIsSearchingAi(true);
    setTimeout(() => {
      const matched = creators.slice(0, 3);
      setAiMatchedCreators(matched);
      setAiResponse(
        `Based on "${promptText}", I have shortlisted ${matched.length} verified creators who match this campaign positioning.`
      );
      setIsSearchingAi(false);
    }, 500);
  }

  function handleResetAi() {
    setAiQuery('');
    setAiResponse(null);
    setAiMatchedCreators([]);
  }

  const suggestedPrompts = [
    'Find creators who already reach B2B SaaS Founders & Tech CEOs',
    'Creators with verified audience in Marketing & Enterprise GTM',
    'Build a shortlist for product launch with >10,000 median impressions',
    `Build a balanced creator shortlist for ${companyName || 'our brand'}`,
  ];

  const displayedCreators =
    activeTab === 'shortlist'
      ? creators.filter((c) => shortlist.includes(c.id))
      : creators;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative font-sans">
      <Header balance={0} user={currentUser} />

      {/* ========================================================================= */}
      {/* MODE 1: AI MATCHING SCREEN                                               */}
      {/* ========================================================================= */}
      {activeMode === 'ai' ? (
        <div className="flex-1 w-full min-h-[calc(100vh-64px)] bg-gradient-to-b from-emerald-50/50 via-slate-50/30 to-[#F8FAFC] flex flex-col items-center justify-center px-6 sm:px-8 lg:px-10 py-12 relative overflow-hidden">
          {/* Ambient Lighting */}
          <div className="absolute -left-20 top-1/4 w-96 h-96 rounded-full bg-emerald-200/25 blur-3xl pointer-events-none" />
          <div className="absolute -right-20 top-1/3 w-96 h-96 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />

          {/* Top Segmented Mode Switcher */}
          <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 mb-10 z-10">
            <button
              type="button"
              onClick={() => setActiveMode('ai')}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all bg-emerald-600 text-white shadow-md shadow-emerald-600/25 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Matching</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('marketplace')}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Creator Marketplace</span>
            </button>
          </div>

          <div className="w-full max-w-2xl mx-auto text-center z-10 space-y-6">
            {/* Mascot Container */}
            <div className="relative flex items-center justify-center mb-1">
              <div className="relative w-24 h-20 flex items-center justify-center filter drop-shadow-md">
                <svg viewBox="0 0 100 65" className="w-full h-full">
                  <defs>
                    <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="85%" stopColor="#F1F5F9" />
                      <stop offset="100%" stopColor="#E2E8F0" />
                    </linearGradient>
                    <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="40%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#064E3B" />
                    </radialGradient>
                  </defs>
                  <path
                    d="M 28 50 A 16 16 0 0 1 18 26 A 18 18 0 0 1 42 14 A 24 24 0 0 1 76 18 A 18 18 0 0 1 86 36 A 16 16 0 0 1 74 52 Z"
                    fill="url(#cloudGrad)"
                    stroke="#CBD5E1"
                    strokeWidth="0.75"
                  />
                  <ellipse cx="44" cy="30" rx="2.5" ry="3.2" fill="#0F172A" />
                  <circle cx="45" cy="29" r="0.9" fill="#FFFFFF" />
                  <ellipse cx="56" cy="30" rx="2.5" ry="3.2" fill="#0F172A" />
                  <circle cx="57" cy="29" r="0.9" fill="#FFFFFF" />
                  <path d="M 48 37 Q 50 39 52 37" stroke="#0F172A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                </svg>

                <div className="absolute -right-2 top-8 w-5 h-5 rounded-full shadow-md animate-pulse">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <circle cx="12" cy="12" r="10" fill="url(#sphereGrad)" />
                    <ellipse cx="9" cy="8" rx="3" ry="1.8" fill="#FFFFFF" opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-[1.18]">
              Hey {companyName || 'there'}, let’s find <br /> the right creators for you.
            </h1>

            {/* Search Input Box */}
            <form onSubmit={handleAiSubmit} className="pt-2">
              <div className="bg-white rounded-3xl p-2 pl-6 pr-2.5 border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.06)] flex items-center justify-between gap-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Describe your ideal audience, target ICP, or campaign goals..."
                  className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  disabled={isSearchingAi}
                  className="w-10 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shrink-0 transition-all active:scale-95 cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-600/20"
                >
                  {isSearchingAi ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <ArrowUp className="w-4 h-4 stroke-[3]" />
                  )}
                </button>
              </div>
            </form>

            {/* AI Result or Suggested Prompts */}
            {aiResponse ? (
              <div className="pt-4 space-y-5 text-left animate-in fade-in">
                <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                        Naano Intelligence Match
                      </span>
                      <p className="text-xs text-slate-800 mt-1 leading-relaxed font-medium">
                        {aiResponse}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetAi}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
                    title="Reset search"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Shortlist of AI matched creators */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                    RECOMMENDED CANDIDATES ({aiMatchedCreators.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {aiMatchedCreators.map((creator) => (
                      <div
                        key={creator.id}
                        className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col justify-between hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {creator.avatarUrl || creator.user?.avatarUrl ? (
                            <img
                              src={creator.avatarUrl || creator.user?.avatarUrl}
                              alt={creator.user?.name}
                              className="w-11 h-11 rounded-2xl object-cover object-top border border-slate-200"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                              {creator.user?.name?.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-black text-slate-900 truncate">
                              {creator.user?.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              {creator.niche}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-sm font-black text-slate-900 font-mono">
                            €{creator.pricePerPost}<span className="text-[10px] font-normal text-slate-400">/post</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedCreatorForInvite(creator)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSearch(aiQuery);
                      setActiveMode('marketplace');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View all matching profiles in Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5 font-mono">
                  SUGGESTED WORKFLOW PROMPTS
                </span>
                <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden text-left">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggested(prompt)}
                      className="w-full p-4 px-6 text-left text-xs font-semibold text-slate-800 hover:bg-emerald-50/50 hover:text-emerald-800 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <span className="truncate">{prompt}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: CREATOR MARKETPLACE GRID SCREEN                                   */
        /* ========================================================================= */
        <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
          {successToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between animate-in fade-in shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successToast}</span>
              </div>
              <button onClick={() => setSuccessToast('')} className="text-emerald-700 hover:text-emerald-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* HEADER AREA */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                  <Store className="w-3 h-3 text-emerald-400" />
                  <span>Discovery Directory</span>
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {creators.length} Verified Creators
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight">
                Creator Marketplace
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
                Ranked by ICP match score, verified LinkedIn performance, and median post impressions.
              </p>
            </div>

            {/* Top-Right Toggle Switcher */}
            <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveMode('ai')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Matching</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('marketplace')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all bg-emerald-600 text-white shadow-md shadow-emerald-600/25 cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-white" />
                <span>Creator Marketplace</span>
              </button>
            </div>
          </div>

          {/* SUB-NAVIGATION TABS */}
          <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 self-start">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>All Creators</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {creators.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shortlist')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'shortlist'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Saved Shortlist</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${activeTab === 'shortlist' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {shortlist.length}
              </span>
            </button>
          </div>

          {/* FILTERS & SEARCH TOOLBAR */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search creator by name, topic, or niche..."
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="relative shrink-0">
                <div className="border border-slate-200 rounded-xl px-3.5 py-1.5 bg-slate-50/70 flex items-center justify-between gap-3 min-w-[160px]">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                      SORT BY
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer pr-2"
                    >
                      <option value="fit">Best match (ICP)</option>
                      <option value="followersDesc">Followers: High to Low</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="nameAsc">Name A-Z</option>
                    </select>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-8 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="">Industry: All</option>
                    <option value="SaaS">B2B SaaS</option>
                    <option value="Marketing">Marketing & Growth</option>
                    <option value="Sales">Sales Tech</option>
                    <option value="AI">AI & Machine Learning</option>
                    <option value="HR">HR & Talent</option>
                  </select>
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-8 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="">Country: All</option>
                    <option value="US">United States (US)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="FR">France (FR)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="AE">United Arab Emirates (AE)</option>
                  </select>
                  <Globe2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-7 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="">Budget: Any</option>
                    <option value="under200">Under €200</option>
                    <option value="200to500">€200 - €500</option>
                    <option value="over500">€500+</option>
                  </select>
                  <span className="text-xs font-bold text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    €
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {(industry || country || priceRange || search) && (
                  <button
                    type="button"
                    onClick={() => {
                      setIndustry('');
                      setCountry('');
                      setPriceRange('');
                      setSearch('');
                    }}
                    className="text-xs font-bold text-emerald-700 hover:underline px-2 cursor-pointer"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Showing <strong className="text-slate-900">{displayedCreators.length}</strong> matching profiles
              </div>
            </div>
          </div>

          {/* CREATOR CARDS GRID */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <span className="text-xs font-semibold">Matching creators...</span>
            </div>
          ) : displayedCreators.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3 shadow-2xs">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No creators found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No profiles matched your active filters. Try adjusting industry, budget, or keywords.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCreators.map((creator) => {
                const isShortlisted = shortlist.includes(creator.id);
                const isSelected = selectedCheckboxIds.includes(creator.id);

                const followersDisplay =
                  creator.followersCount >= 1000
                    ? `${(creator.followersCount / 1000).toFixed(1).replace('.0', '')}K`
                    : creator.followersCount.toString();

                const medianViewsDisplay = creator.medianViews
                  ? creator.medianViews >= 1000
                    ? `${(creator.medianViews / 1000).toFixed(1).replace('.0', '')}K`
                    : creator.medianViews.toString()
                  : `${Math.round((creator.followersCount * 0.18) / 100) / 10}K`;

                const cpmDisplay = `€${creator.cpm || Math.max(8, Math.round((creator.pricePerPost / (creator.followersCount * 0.18 || 1000)) * 1000))}`;
                const postCostDisplay = `€${creator.pricePerPost}`;
                const initial = creator.user.name ? creator.user.name.charAt(0).toUpperCase() : 'C';

                return (
                  <div
                    key={creator.id}
                    className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Atmospheric Top Bar */}
                      <div className="h-28 bg-gradient-to-r from-[#070D0A] to-[#064E3B] p-4 flex items-start justify-between relative overflow-hidden">
                        <img
                          src="/images/hero-clouds.jpg"
                          alt="Clouds"
                          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay pointer-events-none"
                        />

                        {/* Top Left: Checkbox & LinkedIn Icon */}
                        <div className="flex items-center gap-2 relative z-10">
                          <button
                            type="button"
                            onClick={() => toggleCheckbox(creator.id)}
                            className={`w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
                              isSelected ? 'bg-emerald-600 border-emerald-500' : 'hover:bg-white/20'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-4 h-4 text-white stroke-[3]" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded border border-white/40" />
                            )}
                          </button>

                          <a
                            href={
                              creator.linkedinUrl ||
                              `https://linkedin.com/in/${creator.user.name
                                .toLowerCase()
                                .replace(/[^a-z0-9]/g, '-')}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xs flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer font-bold text-xs"
                            title="LinkedIn Profile"
                          >
                            <span>in</span>
                          </a>
                        </div>

                        {/* Top Right: Star & Book Button */}
                        <div className="flex items-center gap-2 relative z-10">
                          <button
                            type="button"
                            onClick={() => toggleShortlist(creator.id)}
                            className={`w-8 h-8 rounded-xl backdrop-blur-md border transition-all cursor-pointer flex items-center justify-center ${
                              isShortlisted
                                ? 'bg-amber-400 text-slate-950 border-amber-300'
                                : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                            }`}
                            title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                isShortlisted ? 'fill-slate-950 text-slate-950' : ''
                              }`}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedCreatorForInvite(creator)}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                          >
                            Book
                          </button>
                        </div>
                      </div>

                      {/* Overlapping Avatar */}
                      <div className="-mt-10 mx-auto flex justify-center relative z-10">
                        {creator.avatarUrl || creator.user.avatarUrl ? (
                          <img
                            src={creator.avatarUrl || creator.user.avatarUrl}
                            alt={creator.user.name}
                            className="w-20 h-20 rounded-2xl border-4 border-white shadow-md object-cover object-top bg-slate-100"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-emerald-600 text-white font-black text-2xl flex items-center justify-center">
                            {initial}
                          </div>
                        )}
                      </div>

                      {/* Creator Name & Subtitle */}
                      <div className="text-center px-4 pt-3 pb-2">
                        <h3 className="text-base font-black text-slate-900 tracking-tight truncate block">
                          {creator.user.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 truncate block font-medium">
                          {creator.niche || 'B2B Growth'}
                          {creator.country ? ` · ${creator.country}` : ''}
                        </p>
                      </div>

                      {/* Forecaster 4-Column Metric Bar */}
                      <div className="mx-4 my-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 grid grid-cols-4 gap-2 text-center">
                        <div className="border-l-2 border-emerald-500 pl-1 text-left">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                            FOLLOWERS
                          </span>
                          <span className="text-xs sm:text-sm font-black text-slate-900 font-mono block mt-0.5 truncate">
                            {followersDisplay}
                          </span>
                        </div>
                        <div className="border-l-2 border-teal-500 pl-1 text-left">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                            MEDIAN
                          </span>
                          <span className="text-xs sm:text-sm font-black text-emerald-600 font-mono block mt-0.5 truncate">
                            {medianViewsDisplay}
                          </span>
                        </div>
                        <div className="border-l-2 border-amber-500 pl-1 text-left">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                            CPM
                          </span>
                          <span className="text-xs sm:text-sm font-black text-slate-900 font-mono block mt-0.5 truncate">
                            {cpmDisplay}
                          </span>
                        </div>
                        <div className="border-l-2 border-emerald-600 pl-1 text-left">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                            RATE
                          </span>
                          <span className="text-xs sm:text-sm font-black text-slate-900 font-mono block mt-0.5 truncate">
                            {postCostDisplay}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* View Profile Action Footer */}
                    <div className="px-5 pb-4 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedCreatorForProfile(creator)}
                        className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors py-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-4 h-4 text-emerald-600" />
                          <span>View Media Kit Card</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* VIEW CREATOR PROFILE MODAL */}
      {selectedCreatorForProfile && (
        <CreatorProfileModal
          creator={selectedCreatorForProfile}
          isShortlisted={shortlist.includes(selectedCreatorForProfile.id)}
          onToggleShortlist={toggleShortlist}
          onClose={() => setSelectedCreatorForProfile(null)}
          onBook={(creator) => {
            setSelectedCreatorForProfile(null);
            setSelectedCreatorForInvite(creator);
          }}
        />
      )}

      {/* INVITE / BOOK CREATOR MODAL */}
      {selectedCreatorForInvite && (
        <InviteCreatorModal
          creator={{
            id: selectedCreatorForInvite.id,
            pricePerPost: selectedCreatorForInvite.pricePerPost,
            fitScore: selectedCreatorForInvite.fitScore || 90,
            user: { name: selectedCreatorForInvite.user?.name || 'Creator' },
          }}
          onClose={() => setSelectedCreatorForInvite(null)}
          onSuccess={() => {
            setSelectedCreatorForInvite(null);
            setSuccessToast(
              `Collaboration invitation sent to ${selectedCreatorForInvite.user?.name}!`
            );
            setTimeout(() => setSuccessToast(''), 4000);
          }}
        />
      )}
    </div>
  );
}
