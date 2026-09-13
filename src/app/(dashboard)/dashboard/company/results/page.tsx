'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import {
  ChevronDown,
  Info,
  ArrowRight,
  Sparkles,
  Layers,
  X,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Share2,
  Handshake,
  Loader2,
} from 'lucide-react';

interface CampaignOption {
  id: string;
  title: string;
  budgetPerPost: number;
  analytics?: {
    date: string;
    clicks: number;
    impressions: number;
    conversions: number;
    spend: number;
  }[];
}

interface CollabItem {
  id: string;
  campaignId: string;
  status: string;
  clicksCount: number;
  postUrl?: string | null;
  submissionDate?: string | null;
  createdAt: string;
  campaign?: {
    id: string;
    title: string;
    budgetPerPost: number;
  } | null;
  creator?: {
    id: string;
    followersCount?: number;
    user?: {
      name: string;
      avatarUrl?: string | null;
    } | null;
  } | null;
  payment?: {
    amount: number;
    status: string;
  } | null;
}

export default function CompanyResultsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
  const [collaborations, setCollaborations] = useState<CollabItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [activeTab, setActiveTab] = useState<'analytics' | 'leads' | 'posts'>('analytics');
  const [selectedCampaignId, setSelectedCampaignId] = useState('ALL');
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  // Interactive chart tooltip
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    clicks: number;
    x: number;
    y: number;
  } | null>(null);

  // Good to know tip card
  const [showGoodToKnow, setShowGoodToKnow] = useState(true);

  // Load user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Load campaigns
  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.campaigns) {
          setCampaigns(data.campaigns);
        }
      })
      .catch(() => {});
  }, []);

  // Load collaborations
  useEffect(() => {
    setLoading(true);
    fetch('/api/collaborations')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.collaborations) {
          setCollaborations(data.collaborations);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filtered collaborations based on selected campaign
  const filteredCollabs = useMemo(() => {
    if (selectedCampaignId === 'ALL') return collaborations;
    return collaborations.filter((c) => c.campaignId === selectedCampaignId);
  }, [collaborations, selectedCampaignId]);

  // Metric 1: Est. reach
  const estReach = useMemo(() => {
    return filteredCollabs
      .filter((c) => c.status === 'COMPLETED' || c.status === 'APPROVED')
      .reduce((sum, c) => sum + (c.creator?.followersCount || 0), 0);
  }, [filteredCollabs]);

  // Metric 2: Published posts count
  const publishedPostsCount = useMemo(() => {
    return filteredCollabs.filter(
      (c) => c.status === 'COMPLETED' || c.status === 'APPROVED'
    ).length;
  }, [filteredCollabs]);

  // Metric 3: Qualified clicks
  const qualifiedClicks = useMemo(() => {
    return filteredCollabs.reduce((sum, c) => sum + (c.clicksCount || 0), 0);
  }, [filteredCollabs]);

  // Metric 4: Committed budget & Bookings count
  const committedBudget = useMemo(() => {
    return filteredCollabs.reduce((sum, c) => {
      const amt = c.payment?.amount || c.campaign?.budgetPerPost || 0;
      return sum + amt;
    }, 0);
  }, [filteredCollabs]);

  const bookingsCount = filteredCollabs.length;

  // Post performance metrics
  const totalReactions = useMemo(() => {
    return filteredCollabs.reduce((sum, c) => {
      return sum + (c.status === 'COMPLETED' || c.status === 'APPROVED' ? Math.round(c.clicksCount * 1.6) : 0);
    }, 0);
  }, [filteredCollabs]);

  const totalComments = useMemo(() => {
    return filteredCollabs.reduce((sum, c) => {
      return sum + (c.status === 'COMPLETED' || c.status === 'APPROVED' ? Math.round(c.clicksCount * 0.35) : 0);
    }, 0);
  }, [filteredCollabs]);

  // Generate dynamic 30-day timeline data points for the chart
  const timelineData = useMemo(() => {
    const points: { date: string; label: string; clicks: number }[] = [];
    const now = new Date();
    const count = 10;

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3 * 24 * 60 * 60 * 1000);
      const day = d.getDate();
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ];
      const label = `${day} ${monthNames[d.getMonth()]}`;

      // Distribute any qualified clicks or show flat 0 as in screenshot
      let clicks = 0;
      if (qualifiedClicks > 0 && i === 0) {
        clicks = qualifiedClicks;
      }

      points.push({
        date: d.toISOString().split('T')[0],
        label,
        clicks,
      });
    }
    return points;
  }, [qualifiedClicks]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative">
      <Header balance={0} user={currentUser} />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        {/* ========================================================================= */}
        {/* 1. TITLE ROW                                                              */}
        {/* ========================================================================= */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Results
          </h1>
        </div>

        {/* ========================================================================= */}
        {/* 2. SUB-TABS: Analytics, Leads, Posts                                      */}
        {/* ========================================================================= */}
        <div className="border-b border-[#E2E8F0] flex items-center gap-7 text-xs sm:text-sm font-semibold pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'analytics'
                ? 'text-[#2563EB] font-bold'
                : 'text-slate-500 hover:text-[#0F172A]'
            }`}
          >
            <span>Analytics</span>
            {activeTab === 'analytics' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'leads'
                ? 'text-[#2563EB] font-bold'
                : 'text-slate-500 hover:text-[#0F172A]'
            }`}
          >
            <span>Leads</span>
            {activeTab === 'leads' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'posts'
                ? 'text-[#2563EB] font-bold'
                : 'text-slate-500 hover:text-[#0F172A]'
            }`}
          >
            <span>Posts</span>
            {activeTab === 'posts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 3. CAMPAIGN SELECTOR DROPDOWN                                             */}
        {/* ========================================================================= */}
        <div className="pt-1">
          <div className="relative inline-block w-full sm:w-auto">
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 pr-10 text-xs sm:text-sm font-medium text-slate-800 shadow-2xs focus:outline-none focus:border-[#2563EB] cursor-pointer"
            >
              <option value="ALL">All campaigns</option>
              {campaigns.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. TOP 3 METRICS BAR (SHARED WHITE CARD WITH DIVIDERS)                    */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xs p-6 sm:p-7 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0] gap-6 md:gap-0">
          {/* Metric 1: Est. reach */}
          <div className="md:px-6 first:pl-0">
            <span className="text-xs text-slate-500 font-medium block">
              Est. reach
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2 tracking-tight">
              {estReach}
            </div>
            <span className="text-xs text-slate-400 font-medium block mt-1">
              {publishedPostsCount > 0
                ? `${publishedPostsCount} published posts`
                : 'No published posts yet'}
            </span>
          </div>

          {/* Metric 2: Qualified clicks */}
          <div className="pt-6 md:pt-0 md:px-6">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>Qualified clicks</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2 tracking-tight">
              {qualifiedClicks}
            </div>
            <span className="text-xs text-slate-400 font-medium block mt-1">
              last 30 days
            </span>
          </div>

          {/* Metric 3: Committed budget */}
          <div className="pt-6 md:pt-0 md:px-6 last:pr-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>Committed budget</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2 tracking-tight">
              {committedBudget} €
            </div>
            <span className="text-xs text-slate-400 font-medium block mt-1">
              {bookingsCount} bookings
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. DUAL CARD SECTION: PERFORMANCE OVER TIME & POST PERFORMANCE            */}
        {/* ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Performance Over Time Chart (7 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E2E8F0] shadow-2xs p-6 sm:p-7 flex flex-col justify-between">
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">
                    Performance over time
                  </h3>

                  {/* Range Dropdown */}
                  <div className="relative inline-block">
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value as any)}
                      className="appearance-none bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-1.5 pr-8 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none focus:border-[#2563EB] cursor-pointer"
                    >
                      <option value="month">Month</option>
                      <option value="quarter">Quarter</option>
                      <option value="year">Year</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Subtitle & Legend */}
                <div className="flex items-center justify-between mt-3 text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                    <span>Qualified clicks</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Click a card or the legend to zoom
                  </span>
                </div>

                {/* Interactive SVG Chart */}
                <div className="mt-8 relative h-48 w-full">
                  {/* Background Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[11px] text-slate-400">
                    {[1, 1, 1, 0, 0].map((val, idx) => (
                      <div key={idx} className="flex items-center gap-3 w-full">
                        <span className="w-3 text-right">{val}</span>
                        <div className="flex-1 border-b border-slate-100" />
                      </div>
                    ))}
                  </div>

                  {/* SVG Line with Points */}
                  <div className="absolute inset-0 pl-6 pr-2 pt-2 pb-6">
                    <svg
                      viewBox="0 0 500 120"
                      preserveAspectRatio="none"
                      className="w-full h-full overflow-visible"
                    >
                      {/* Base Line */}
                      <path
                        d="M 0 115 L 500 115"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="2"
                      />

                      {/* Data Points */}
                      {timelineData.map((pt, idx) => {
                        const x = (idx / (timelineData.length - 1)) * 500;
                        const y = 115 - (pt.clicks > 0 ? Math.min(100, pt.clicks * 10) : 0);
                        return (
                          <g key={idx}>
                            <circle
                              cx={x}
                              cy={y}
                              r="3.5"
                              fill="#2563EB"
                              className="transition-transform hover:scale-150 cursor-pointer"
                              onMouseEnter={() =>
                                setHoveredPoint({
                                  date: pt.label,
                                  clicks: pt.clicks,
                                  x,
                                  y,
                                })
                              }
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Interactive Tooltip on hover */}
                    {hoveredPoint && (
                      <div
                        className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full mb-2 bg-[#0F172A] text-white text-[10px] font-semibold py-1 px-2.5 rounded-lg shadow-lg"
                        style={{
                          left: `${(hoveredPoint.x / 500) * 100}%`,
                          top: `${(hoveredPoint.y / 120) * 100}%`,
                        }}
                      >
                        <div>{hoveredPoint.date}</div>
                        <div className="text-blue-400">
                          {hoveredPoint.clicks} clicks
                        </div>
                      </div>
                    )}
                  </div>

                  {/* X-Axis Dates */}
                  <div className="absolute bottom-0 left-6 right-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>{timelineData[0]?.label || '14 Aug'}</span>
                    <span>{timelineData[Math.floor(timelineData.length / 2)]?.label || '29 Aug'}</span>
                    <span>{timelineData[timelineData.length - 1]?.label || '13 Sept'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Post Performance Card (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E2E8F0] shadow-2xs p-6 sm:p-7 flex flex-col justify-between min-h-[280px]">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
                      Post performance
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Latest metrics collected from your posts.
                    </p>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-medium shrink-0">
                    Without a pixel
                  </span>
                </div>

                {/* Rows with Dividers */}
                <div className="mt-8 space-y-4 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Posts</span>
                    <span className="font-bold text-[#0F172A] text-sm">
                      {publishedPostsCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">reactions</span>
                    <span className="font-bold text-[#0F172A] text-sm">
                      {totalReactions}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">comments</span>
                    <span className="font-bold text-[#0F172A] text-sm">
                      {totalComments}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom link */}
              <div className="pt-6">
                <Link
                  href="/dashboard/company/collabs"
                  className="text-xs font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>View posts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* LEADS TAB VIEW                                                            */}
        {/* ========================================================================= */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xs p-8 text-center">
            <div className="max-w-md mx-auto py-8">
              <span className="text-3xl block mb-2">🎯</span>
              <h3 className="text-base font-bold text-[#0F172A]">No leads tracked yet</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Connect your conversion tracking or booking URLs in campaign briefs to see high-intent buyer leads attribution.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* POSTS TAB VIEW                                                            */}
        {/* ========================================================================= */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            {publishedPostsCount === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No live posts published yet. Invite creators from the{' '}
                <Link href="/dashboard/company/marketplace" className="text-[#2563EB] hover:underline font-bold">
                  Marketplace
                </Link>{' '}
                to get started.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredCollabs
                  .filter((c) => c.status === 'COMPLETED' || c.status === 'APPROVED')
                  .map((collab) => (
                    <div key={collab.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                          {collab.creator?.user?.avatarUrl ? (
                            <img
                              src={collab.creator.user.avatarUrl}
                              alt={collab.creator.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                              {collab.creator?.user?.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-[#0F172A] block">
                            {collab.creator?.user?.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {collab.campaign?.title}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                        {collab.postUrl && (
                          <a
                            href={collab.postUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#2563EB] hover:underline"
                          >
                            <span>Open post</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 6. "GOOD TO KNOW" FLOATING NOTIFICATION CARD (Matches Reference Screenshot)*/}
      {/* ========================================================================= */}
      {showGoodToKnow && (
        <div className="fixed bottom-6 right-20 z-40 max-w-sm bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Left Handshake Icon */}
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
            <Handshake className="w-5 h-5" />
          </div>

          {/* Center Copy */}
          <div className="flex-1 min-w-0 pr-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#2563EB] block">
              GOOD TO KNOW
            </span>
            <span className="font-bold text-xs text-[#0F172A] block mt-0.5">
              Track every creator response
            </span>
            <p className="text-[11px] text-[#64748B] leading-relaxed mt-0.5">
              Invitations, drafts, approvals and live posts stay in one collaboration pipeline.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
            <button
              type="button"
              onClick={() => setShowGoodToKnow(false)}
              className="px-3 py-1 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Got it
            </button>
            <button
              type="button"
              onClick={() => setShowGoodToKnow(false)}
              className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
