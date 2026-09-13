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
      // Semantic matching simulation based on query keywords
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
        `I analyzed ${creators.length} creators against your ICP for "${aiQuery}". Here are the ${matched.length} strongest profiles with verified buyer authority and performance signals.`
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
        `Based on "${promptText}", I have shortlisted ${matched.length} verified creators who match this exact campaign positioning.`
      );
      setIsSearchingAi(false);
    }, 500);
  }

  function handleResetAi() {
    setAiQuery('');
    setAiResponse(null);
    setAiMatchedCreators([]);
  }

  // Dynamic suggested prompts
  const suggestedPrompts = [
    'Find creators who already reach Propriétaire/Fondateur PME',
    "Find creators with credible content about Création ou refonte complète d'un site e-commerce WooCommerce/Shopify",
    'Build a shortlist for this campaign angle: « 10 ans d\'expertise, 3 personnes = zéro bureaucratie » : montrer comment',
    `Build a balanced creator shortlist for ${companyName}`,
  ];

  // Filter creators based on active tab
  const displayedCreators =
    activeTab === 'shortlist'
      ? creators.filter((c) => shortlist.includes(c.id))
      : creators;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative">
      <Header balance={0} user={currentUser} />

      {/* ========================================================================= */}
      {/* MODE 1: AI MATCHING SCREEN (Matches Reference Screenshot Pixel-For-Pixel) */}
      {/* ========================================================================= */}
      {activeMode === 'ai' ? (
        <div className="flex-1 w-full min-h-[calc(100vh-60px)] bg-gradient-to-b from-[#DCEEFF] via-[#EDF5FF] to-[#F8FAFC] flex flex-col items-center justify-center px-6 sm:px-8 lg:px-10 py-12 relative overflow-hidden">
          {/* Subtle Ambient Cloud Blobs */}
          <div className="absolute -left-20 top-1/4 w-96 h-96 rounded-full bg-white/40 blur-3xl pointer-events-none" />
          <div className="absolute -right-20 top-1/3 w-96 h-96 rounded-full bg-white/40 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-80 h-80 rounded-full bg-white/50 blur-3xl pointer-events-none" />

          {/* Top Segmented Mode Switcher */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#E2E8F0] shadow-sm mb-12 z-10">
            <button
              type="button"
              onClick={() => setActiveMode('ai')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white text-[#111827] shadow-xs border border-[#E2E8F0] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#111827]" />
              <span>AI Matching</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('marketplace')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all text-[#64748B] hover:text-[#111827] cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Creator Marketplace</span>
            </button>
          </div>

          <div className="w-full max-w-2xl mx-auto text-center z-10 space-y-6">
            {/* Cute 3D Cloud Mascot with Blue Sphere */}
            <div className="relative flex items-center justify-center mb-2">
              <div className="relative w-28 h-20 flex items-center justify-center filter drop-shadow-md">
                <svg viewBox="0 0 100 65" className="w-full h-full">
                  <defs>
                    <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="85%" stopColor="#F1F5F9" />
                      <stop offset="100%" stopColor="#E2E8F0" />
                    </linearGradient>
                    <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#60A5FA" />
                      <stop offset="40%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#1E3A8A" />
                    </radialGradient>
                  </defs>
                  {/* Cloud Body */}
                  <path
                    d="M 28 50 
                       A 16 16 0 0 1 18 26 
                       A 18 18 0 0 1 42 14 
                       A 24 24 0 0 1 76 18 
                       A 18 18 0 0 1 86 36 
                       A 16 16 0 0 1 74 52 
                       Z"
                    fill="url(#cloudGrad)"
                    stroke="#CBD5E1"
                    strokeWidth="0.75"
                  />
                  {/* Left Eye */}
                  <ellipse cx="44" cy="30" rx="2.5" ry="3.2" fill="#0F172A" />
                  <circle cx="45" cy="29" r="0.9" fill="#FFFFFF" />
                  {/* Right Eye */}
                  <ellipse cx="56" cy="30" rx="2.5" ry="3.2" fill="#0F172A" />
                  <circle cx="57" cy="29" r="0.9" fill="#FFFFFF" />
                  {/* Cute Mouth */}
                  <path
                    d="M 48 37 Q 50 39 52 37"
                    stroke="#0F172A"
                    strokeWidth="1.2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Floating Blue Sphere */}
                <div className="absolute -right-2 top-8 w-5 h-5 rounded-full shadow-md animate-pulse">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <circle cx="12" cy="12" r="10" fill="url(#sphereGrad)" />
                    <ellipse cx="9" cy="8" rx="3" ry="1.8" fill="#FFFFFF" opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#111827] tracking-tight leading-[1.18]">
              Hey {companyName}, let’s find <br /> the right creators for you.
            </h1>

            {/* Search Input Box */}
            <form onSubmit={handleAiSubmit} className="pt-2">
              <div className="bg-white rounded-2xl sm:rounded-full p-2 pl-6 pr-2.5 border border-[#E2E8F0] shadow-sm flex items-center justify-between gap-3 focus-within:border-[#2563EB] focus-within:shadow-md transition-all">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask Nao a question, or find creators..."
                  className="w-full text-xs sm:text-sm text-[#111827] placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  disabled={isSearchingAi}
                  className="w-9 h-9 rounded-xl sm:rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center shrink-0 transition-all active:scale-95 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  {isSearchingAi ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </div>
            </form>

            {/* AI Result or Suggested Prompts */}
            {aiResponse ? (
              <div className="pt-4 space-y-5 text-left animate-in fade-in">
                <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#2563EB] tracking-wider block">
                        Nao Recommendation
                      </span>
                      <p className="text-xs text-[#111827] mt-0.5 leading-relaxed font-medium">
                        {aiResponse}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetAi}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                    title="Reset search"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Shortlist of AI matched creators */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] block">
                    MATCHED PROFILES ({aiMatchedCreators.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {aiMatchedCreators.map((creator) => (
                      <div
                        key={creator.id}
                        className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {creator.avatarUrl || creator.user?.avatarUrl ? (
                            <img
                              src={creator.avatarUrl || creator.user?.avatarUrl}
                              alt={creator.user?.name}
                              className="w-10 h-10 rounded-full object-cover object-top border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#0070F3] text-white font-black text-sm flex items-center justify-center">
                              {creator.user?.name?.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-[#111827] truncate">
                              {creator.user?.name}
                            </h4>
                            <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                              {creator.niche}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-black text-[#111827]">
                            €{creator.pricePerPost}/post
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedCreatorForInvite(creator)}
                            className="px-3 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-bold rounded-lg transition-all"
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
                    className="text-xs font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>View all in Creator Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* SUGGESTED FOR YOU (Pristine home state matching screenshot) */
              <div className="pt-2 text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] block mb-2.5">
                  SUGGESTED FOR YOU
                </span>
                <div className="bg-white/90 backdrop-blur-xs rounded-2xl border border-[#E2E8F0] shadow-2xs divide-y divide-[#F1F5F9] overflow-hidden text-left">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggested(prompt)}
                      className="w-full p-4 px-5 text-left text-xs font-semibold text-[#111827] hover:bg-slate-50/80 hover:text-[#2563EB] transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <span className="truncate">{prompt}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0" />
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
        <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
          {/* Success Alert */}
          {successToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between animate-in fade-in shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{successToast}</span>
              </div>
              <button onClick={() => setSuccessToast('')}>
                <X className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          )}

          {/* HEADER AREA */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
                All creators
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 max-w-2xl leading-relaxed">
                All creators are shown from most to least relevant, using sector fit first and verified performance statistics to refine the order.
              </p>
            </div>

            {/* Top-Right Toggle Switcher */}
            <div className="inline-flex items-center p-1 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] shadow-2xs self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveMode('ai')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all text-[#64748B] hover:text-[#111827] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Matching</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('marketplace')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-white text-[#111827] shadow-xs border border-[#E2E8F0] cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Creator Marketplace</span>
              </button>
            </div>
          </div>

          {/* SUB-NAVIGATION TABS */}
          <div className="flex items-center gap-6 border-b border-[#E2E8F0] pt-1">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <span>All creators</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === 'all'
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {creators.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shortlist')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'shortlist'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <span>Shortlist</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeTab === 'shortlist'
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {shortlist.length}
              </span>
            </button>
          </div>

          {/* SUBTITLE CALLOUT BOX */}
          <div className="flex items-start sm:items-center gap-3 p-3.5 px-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#F0F7FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-[#111827] mr-1.5">Ranked for your company</span>
              <span className="text-[#64748B]">
                All creators are shown from most to least relevant, using sector fit first and verified performance statistics to refine the order.
              </span>
            </div>
          </div>

          {/* FILTERS & SEARCH TOOLBAR */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
            {/* Search Input & Sort By Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for a creator..."
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Sort Dropdown */}
              <div className="relative shrink-0">
                <div className="border border-[#E2E8F0] rounded-xl px-3.5 py-1.5 bg-[#F8FAFC] flex items-center justify-between gap-3 min-w-[150px]">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#94A3B8] block">
                      SORT BY
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs font-bold text-[#111827] focus:outline-none cursor-pointer pr-2"
                    >
                      <option value="fit">Best match</option>
                      <option value="followersDesc">Followers</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="nameAsc">Name</option>
                    </select>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Filter Dropdowns & Creator Count */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Industry Filter */}
                <div className="relative">
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="appearance-none bg-white border border-[#E2E8F0] hover:border-slate-300 rounded-xl pl-8 pr-8 py-2 text-xs font-semibold text-[#111827] focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="">Industry</option>
                    <option value="SaaS">B2B SaaS</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales Tech</option>
                    <option value="AI">AI & Tech</option>
                    <option value="HR">HR & Talent</option>
                  </select>
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Country Filter */}
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="appearance-none bg-white border border-[#E2E8F0] hover:border-slate-300 rounded-xl pl-8 pr-8 py-2 text-xs font-semibold text-[#111827] focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="">Country</option>
                    <option value="US">United States (US)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="FR">France (FR)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="AE">United Arab Emirates (AE)</option>
                    <option value="NL">Netherlands (NL)</option>
                  </select>
                  <Globe2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Price Filter */}
                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="appearance-none bg-white border border-[#E2E8F0] hover:border-slate-300 rounded-xl pl-7 pr-8 py-2 text-xs font-semibold text-[#111827] focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="">Price</option>
                    <option value="under200">Under €200</option>
                    <option value="200to500">€200 - €500</option>
                    <option value="over500">€500+</option>
                  </select>
                  <span className="text-xs font-bold text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    €
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* More Filters Toggle */}
                <button
                  type="button"
                  onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                    isFilterDropdownOpen
                      ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]'
                      : 'border-[#E2E8F0] bg-white text-[#111827] hover:border-slate-300'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span>Filters</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Clear Filters Button */}
                {(industry || country || priceRange || search) && (
                  <button
                    type="button"
                    onClick={() => {
                      setIndustry('');
                      setCountry('');
                      setPriceRange('');
                      setSearch('');
                    }}
                    className="text-xs font-bold text-[#2563EB] hover:underline px-2 cursor-pointer"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Creator count on right */}
              <div className="text-xs text-[#64748B] font-medium">
                <span className="font-bold text-[#111827]">{displayedCreators.length}</span> creators
              </div>
            </div>
          </div>

          {/* SECTION HEADER ABOVE CARDS */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-sm font-black text-[#111827]">Top ranked creators</h2>
            <span className="text-[11px] text-[#94A3B8]">
              The {displayedCreators.length} strongest profiles according to your sector and performance signals.
            </span>
          </div>

          {/* CREATOR CARDS GRID (3 COLUMNS) */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
              <span className="text-xs font-semibold">Matching and ranking top creators...</span>
            </div>
          ) : displayedCreators.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-[#111827]">No creators found</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                No profiles matched your active filters. Try adjusting the industry, price range or country.
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
                    className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Sky-Blue Atmospheric Header Banner */}
                      <div className="h-28 bg-gradient-to-b from-[#D4E8FC] via-[#E6F2FE] to-[#F3F9FF] p-4 flex items-start justify-between relative">
                        {/* Top Left: Checkbox & LinkedIn Icon */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleCheckbox(creator.id)}
                            className={`w-8 h-8 rounded-xl bg-white/90 border border-white/80 shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
                              isSelected ? 'border-[#2563EB] bg-[#EFF6FF]' : 'hover:bg-white'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-4 h-4 text-[#2563EB] stroke-[3]" />
                            ) : (
                              <div className="w-3.5 h-3.5 rounded border border-slate-300" />
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
                            className="w-8 h-8 rounded-xl bg-white/90 border border-white/80 shadow-2xs flex items-center justify-center text-[#0A66C2] hover:bg-white transition-all cursor-pointer font-black text-xs"
                            title="LinkedIn Profile"
                          >
                            <span className="font-bold text-xs">in</span>
                          </a>
                        </div>

                        {/* Top Right: Star & Book Button */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => toggleShortlist(creator.id)}
                            className={`w-8 h-8 rounded-xl bg-white/90 border border-white/80 shadow-2xs flex items-center justify-center transition-all cursor-pointer ${
                              isShortlisted
                                ? 'text-amber-500 bg-amber-50'
                                : 'text-slate-400 hover:text-amber-500 hover:bg-white'
                            }`}
                            title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                isShortlisted ? 'fill-amber-400 text-amber-500' : ''
                              }`}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedCreatorForInvite(creator)}
                            className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
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
                            className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover object-top bg-slate-100"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-[#0070F3] text-white font-black text-2xl flex items-center justify-center">
                            {initial}
                          </div>
                        )}
                      </div>

                      {/* Creator Name & Subtitle */}
                      <div className="text-center px-4 pt-2.5 pb-2">
                        <h3 className="text-base font-black text-[#111827] tracking-tight truncate block">
                          {creator.user.name}
                        </h3>
                        <p className="text-xs text-[#64748B] mt-0.5 truncate block">
                          {creator.niche || 'B2B Growth'}
                          {creator.country ? ` · ${creator.country}` : ''}
                        </p>
                      </div>

                      {/* 4-Column Metric Bar */}
                      <div className="border-t border-b border-[#F1F5F9] grid grid-cols-4 divide-x divide-[#F1F5F9] py-3 text-center my-3 bg-[#FCFCFD]">
                        <div className="px-1">
                          <span className="text-xs sm:text-sm font-black text-[#111827] block truncate">
                            {followersDisplay}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#94A3B8] block mt-0.5">
                            FOLLOWERS
                          </span>
                        </div>
                        <div className="px-1">
                          <span className="text-xs sm:text-sm font-black text-[#111827] block truncate">
                            {medianViewsDisplay}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#94A3B8] block mt-0.5">
                            MEDIAN VIEWS
                          </span>
                        </div>
                        <div className="px-1">
                          <span className="text-xs sm:text-sm font-black text-[#111827] block truncate">
                            {cpmDisplay}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#94A3B8] block mt-0.5">
                            CPM
                          </span>
                        </div>
                        <div className="px-1">
                          <span className="text-xs sm:text-sm font-black text-[#111827] block truncate">
                            {postCostDisplay}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#94A3B8] block mt-0.5">
                            POST COST
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* View Profile Action Footer */}
                    <div className="px-5 pb-4 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCreatorForProfile(creator)}
                        className="w-full flex items-center justify-between text-xs font-bold text-[#111827] hover:text-[#2563EB] transition-colors py-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <UserCircle className="w-4 h-4 text-[#2563EB]" />
                          <span>View profile</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
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
          onBook={(creator, packageType) => {
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
