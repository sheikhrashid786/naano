'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import InviteCreatorModal from '@/components/dashboard/InviteCreatorModal';
import {
  Search,
  Filter,
  Users,
  Sparkles,
  CheckCircle2,
  Send,
  Loader2,
  Globe2,
  TrendingUp,
  X
} from 'lucide-react';

export default function CompanyMarketplacePage() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [sortBy, setSortBy] = useState('fit');
  const [selectedCreatorForInvite, setSelectedCreatorForInvite] = useState<any | null>(null);
  const [successToast, setSuccessToast] = useState('');

  async function loadCreators() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (industry) params.set('industry', industry);
      if (country) params.set('country', country);
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
  }, [search, industry, country, sortBy]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Creator Marketplace"
        subtitle="Discover and book vetted B2B LinkedIn creators matched to your exact buyer personas."
      />

      <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Success Alert */}
        {successToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')}>
              <X className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by creator name, niche, topic, or keyword..."
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-semibold text-[#374151] focus:outline-none focus:border-blue-600"
              >
                <option value="">All Niches &amp; Industries</option>
                <option value="Outbound">B2B Outbound</option>
                <option value="AI">AI &amp; Automation</option>
                <option value="GTM">GTM &amp; Growth</option>
                <option value="Sales">Sales Tech</option>
                <option value="Marketing">Product Marketing</option>
              </select>

              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-semibold text-[#374151] focus:outline-none focus:border-blue-600"
              >
                <option value="">All Countries</option>
                <option value="FR">France (FR)</option>
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="DE">Germany (DE)</option>
                <option value="NL">Netherlands (NL)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs font-semibold text-[#374151] focus:outline-none focus:border-blue-600"
              >
                <option value="fit">Best Match (ICP Score)</option>
                <option value="followersDesc">Followers: High to Low</option>
                <option value="followersAsc">Followers: Low to High</option>
                <option value="priceAsc">Rate: Low to High</option>
                <option value="nameAsc">Name (A→Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Creator Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#6B7280]">
          <div>
            Showing <strong className="text-[#111827]">{creators.length}</strong> verified B2B creators
          </div>
        </div>

        {/* Creators Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs text-[#6B7280]">Calculating audience match scores...</span>
          </div>
        ) : creators.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-[#111827]">No creators matched your filter</h4>
            <p className="text-xs text-[#6B7280] mt-1">Try clearing some filter options or changing your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {creators.map((creator) => (
              <div
                key={creator.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar with Match Score and Country */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                        {creator.user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-[#111827] truncate group-hover:text-blue-600 transition-colors">
                            {creator.user.name}
                          </h4>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                            {creator.country}
                          </span>
                        </div>
                        <div className="text-[11px] font-medium text-blue-600 mt-0.5 truncate">
                          {creator.niche}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        <span>{creator.fitScore}% Match</span>
                      </span>
                    </div>
                  </div>

                  {/* Headline */}
                  <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed mb-4">
                    {creator.headline}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-[#F9FAFB] rounded-xl text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-[#9CA3AF] block uppercase tracking-wider font-semibold">
                        Followers
                      </span>
                      <span className="font-bold text-[#111827] text-sm">
                        {creator.followersCount.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#9CA3AF] block uppercase tracking-wider font-semibold">
                        Engagement
                      </span>
                      <span className="font-bold text-emerald-600 text-sm">
                        {creator.engagementRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-[#F3F4F6] flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-semibold">
                      Deliverable Rate
                    </div>
                    <div className="text-base font-bold text-[#111827]">
                      €{creator.pricePerPost}{' '}
                      <span className="text-[11px] font-normal text-[#6B7280]">/post</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCreatorForInvite(creator)}
                    className="inline-flex items-center gap-1.5 bg-[#111827] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Invite</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Invite Modal */}
        {selectedCreatorForInvite && (
          <InviteCreatorModal
            creator={selectedCreatorForInvite}
            onClose={() => setSelectedCreatorForInvite(null)}
            onSuccess={() => {
              setSuccessToast(`Invitation sent to ${selectedCreatorForInvite.user.name}!`);
            }}
          />
        )}
      </main>
    </div>
  );
}
