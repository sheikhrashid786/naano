'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Users,
  Eye,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  Send,
  X,
  ChevronDown,
} from 'lucide-react';

function LinkedInIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.63 1.63 0 1 0 1.63 1.63A1.63 1.63 0 0 0 7.86 6.3z" />
    </svg>
  );
}

export interface CreatorData {
  id: string;
  name: string;
  headline?: string | null;
  bio?: string | null;
  niche: string;
  industry: string;
  country: string;
  followersCount: number;
  engagementRate: number;
  pricePerPost: number;
  badge?: string | null;
  avatarUrl?: string | null;
  fitScore?: number;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

interface LiveCreatorsDirectoryProps {
  initialCreators: CreatorData[];
  initialUser?: {
    userId?: string;
    id?: string;
    role?: string;
    name?: string | null;
    email?: string | null;
  } | null;
}

export default function LiveCreatorsDirectory({ initialCreators, initialUser }: LiveCreatorsDirectoryProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(initialUser || null);

  useEffect(() => {
    if (initialUser !== undefined) {
      setCurrentUser(initialUser);
    } else {
      fetch('/api/auth/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) setCurrentUser(data.user);
        })
        .catch(() => {});
    }
  }, [initialUser]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNiche, setSelectedNiche] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'fit' | 'followers' | 'priceAsc'>('fit');
  const [selectedCreator, setSelectedCreator] = useState<CreatorData | null>(null);
  const [inviteModalCreator, setInviteModalCreator] = useState<CreatorData | null>(null);

  // Invite modal state
  const [invitePitch, setInvitePitch] = useState('');
  const [inviteBudget, setInviteBudget] = useState(250);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Handle invite click - redirects to login if user is not authenticated
  const handleInviteClick = (creator: CreatorData) => {
    if (!currentUser) {
      router.push('/login?redirect=/dashboard/company/marketplace');
      return;
    }

    if (currentUser.role === 'COMPANY') {
      setInviteModalCreator(creator);
      setInviteBudget(creator.pricePerPost);
    } else {
      router.push('/login?redirect=/dashboard/company/marketplace');
    }
  };

  // Categories list
  const niches = ['All', 'Sales Tech', 'AI & SaaS', 'Growth Marketing', 'B2B Outbound'];

  // Filter and sort creators
  const [visibleCount, setVisibleCount] = useState<number>(6);

  const filteredCreators = useMemo(() => {
    return initialCreators
      .filter((c) => {
        const matchesNiche =
          selectedNiche === 'All' ||
          c.niche?.toLowerCase().includes(selectedNiche.toLowerCase()) ||
          c.industry?.toLowerCase().includes(selectedNiche.toLowerCase());

        const name = c.user?.name || c.name || '';
        const headline = c.headline || '';
        const bio = c.bio || '';
        const matchesSearch =
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.niche?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesNiche && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'followers') return b.followersCount - a.followersCount;
        if (sortBy === 'priceAsc') return a.pricePerPost - b.pricePerPost;
        return (b.fitScore || 90) - (a.fitScore || 90);
      });
  }, [initialCreators, selectedNiche, searchTerm, sortBy]);

  const visibleCreators = filteredCreators.slice(0, visibleCount);
  const hasMore = visibleCount < filteredCreators.length;

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteModalCreator) return;
    setInviteStatus('submitting');

    try {
      const res = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: inviteModalCreator.id,
          fixedRate: inviteBudget,
          pitchMessage: invitePitch || `Hi ${inviteModalCreator.name}, we'd love to partner with you on an upcoming B2B post.`,
        }),
      });

      if (res.ok) {
        setInviteStatus('success');
        setTimeout(() => {
          setInviteStatus('idle');
          setInviteModalCreator(null);
          setInvitePitch('');
        }, 2200);
      } else {
        // If not logged in as company, redirect to login
        if (res.status === 401) {
          window.location.href = `/login?redirect=/dashboard/company/marketplace`;
          return;
        }
        setInviteStatus('error');
      }
    } catch {
      setInviteStatus('error');
    }
  }

  return (
    <section id="creators" className="py-24 bg-white border-y border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Creator Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Browse Top B2B LinkedIn Voices
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-xl">
              Vetted founders, sales executives, and tech creators ready to feature your product at guaranteed fixed rates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">
              Showing <strong className="text-slate-900">{visibleCreators.length}</strong> of <strong className="text-slate-900">{filteredCreators.length}</strong> available creators
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Niche Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {niches.map((niche) => (
              <button
                key={niche}
                onClick={() => {
                  setSelectedNiche(niche);
                  setVisibleCount(6);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedNiche === niche
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-200/60'
                }`}
              >
                {niche}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, topic, bio..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setVisibleCount(6);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="fit">Sort: Match Score</option>
              <option value="followers">Sort: Followers</option>
              <option value="priceAsc">Sort: Price (Low)</option>
            </select>
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCreators.map((creator) => {
            const displayName = creator.user?.name || creator.name;
            const displayAvatar =
              creator.avatarUrl ||
              creator.user?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
            const fitScore = creator.fitScore || 94;

            return (
              <div
                key={creator.id}
                className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Card Gradient Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative">
                      <img
                        src={displayAvatar}
                        alt={displayName}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md shadow-slate-200"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0A66C2] flex items-center justify-center text-white border-2 border-white">
                        <LinkedInIcon className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <Sparkles className="w-3 h-3 text-indigo-500" />
                        <span>{fitScore}% Fit Score</span>
                      </span>

                      {creator.badge && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {creator.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Creator Info */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                      <span>{displayName}</span>
                      <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50 shrink-0" />
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                      {creator.niche || creator.industry}
                    </p>
                    <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                      {creator.headline || creator.bio || 'B2B LinkedIn Creator focused on actionable growth.'}
                    </p>
                  </div>
                </div>

                {/* Key Statistics Strip */}
                <div className="px-6 py-3.5 bg-slate-50/70 border-y border-slate-100 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Followers
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-0.5 font-mono">
                      {creator.followersCount >= 1000
                        ? `${(creator.followersCount / 1000).toFixed(1)}k`
                        : creator.followersCount}
                    </div>
                  </div>

                  <div className="border-x border-slate-200/60">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Engagement
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-0.5 font-mono text-emerald-600">
                      {creator.engagementRate || 4.2}%
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Price / Post
                    </div>
                    <div className="text-sm font-black text-slate-900 mt-0.5 font-mono">
                      €{creator.pricePerPost}
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 bg-white flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCreator(creator)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer text-center"
                  >
                    View Card
                  </button>

                  <button
                    type="button"
                    onClick={() => handleInviteClick(creator)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-indigo-500/20 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <span>Invite</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-900 font-bold text-xs sm:text-sm shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <span>Load More Voices</span>
              <span className="text-xs font-mono text-slate-400 font-normal">
                ({visibleCreators.length} of {filteredCreators.length})
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-y-0.5 transition-all" />
            </button>
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Looking for a creator in a niche not listed?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              We scout and vet bespoke creators for your specific ICP in under 48 hours. Zero upfront commitment.
            </p>
          </div>

          <Link
            href="/dashboard/company/campaigns"
            className="px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-indigo-50 font-bold text-xs sm:text-sm transition-all shrink-0 shadow-md"
          >
            Request Custom Creator Scouting
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. CREATOR FULL PROFILE QUICK VIEW MODAL                       */}
      {/* ============================================================== */}
      {selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCreator(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={
                  selectedCreator.avatarUrl ||
                  selectedCreator.user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                }
                alt={selectedCreator.user?.name || selectedCreator.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedCreator.user?.name || selectedCreator.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                    {selectedCreator.country}
                  </span>
                </div>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                  {selectedCreator.niche} · {selectedCreator.industry}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Headline
                </h4>
                <p className="text-sm text-slate-600">
                  {selectedCreator.headline || 'B2B LinkedIn Creator'}
                </p>
              </div>

              {selectedCreator.bio && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    About & Positioning
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    {selectedCreator.bio}
                  </p>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Audience</div>
                  <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                    {selectedCreator.followersCount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Avg. Engagement</div>
                  <div className="text-lg font-black text-emerald-600 font-mono mt-0.5">
                    {selectedCreator.engagementRate}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Rate / Post</div>
                  <div className="text-lg font-black text-indigo-600 font-mono mt-0.5">
                    €{selectedCreator.pricePerPost}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedCreator(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const c = selectedCreator;
                  setSelectedCreator(null);
                  handleInviteClick(c);
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Invite to Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. REAL INVITE CREATOR TO COLLABORATION MODAL                  */}
      {/* ============================================================== */}
      {inviteModalCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => {
                setInviteModalCreator(null);
                setInviteStatus('idle');
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Direct Booking Invite
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Collaborate with {inviteModalCreator.user?.name || inviteModalCreator.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                The creator will receive your brief. Funds are held safely in escrow until the post is live.
              </p>
            </div>

            {inviteStatus === 'success' ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center my-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-emerald-900 text-base">Invite Dispatched!</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  We notified the creator. You can review the collaboration in your dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Fixed Fee per Post (€ EUR)
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="10"
                    required
                    value={inviteBudget}
                    onChange={(e) => setInviteBudget(parseInt(e.target.value, 10))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Creator standard rate: €{inviteModalCreator.pricePerPost}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Message / Campaign Angle
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={invitePitch}
                    onChange={(e) => setInvitePitch(e.target.value)}
                    placeholder="Describe your product, the key message, and what kind of post you are looking for..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {inviteStatus === 'error' && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                    Please log in as a brand to send collaboration invites.
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setInviteModalCreator(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteStatus === 'submitting'}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{inviteStatus === 'submitting' ? 'Sending...' : 'Send Collaboration Offer'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
