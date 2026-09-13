'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import {
  Search,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface Collaboration {
  id: string;
  campaignId: string;
  creatorId: string;
  status: string;
  draftUrl?: string | null;
  draftNotes?: string | null;
  submissionDate?: string | null;
  feedbackNotes?: string | null;
  postUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  campaign?: {
    id: string;
    title: string;
    budgetPerPost: number;
    brief?: any;
  } | null;
  creator?: {
    id: string;
    headline?: string | null;
    niche?: string | null;
    user?: {
      name: string;
      email: string;
      avatarUrl?: string | null;
    } | null;
  } | null;
  payment?: {
    id: string;
    amount: number;
    status: string;
  } | null;
}

interface CampaignOption {
  id: string;
  title: string;
}

export default function CompanyCollabsPage() {
  const [collabs, setCollabs] = useState<Collaboration[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Filters & Controls
  const [activeTab, setActiveTab] = useState<
    'all' | 'active' | 'invitations_received' | 'invitations_sent' | 'todo' | 'completed'
  >('all');
  const [selectedCampaignId, setSelectedCampaignId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollabIds, setSelectedCollabIds] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Review modal & action states
  const [selectedReview, setSelectedReview] = useState<Collaboration | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // Load user data
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Load campaigns for dropdown filter
  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.campaigns) {
          setCampaigns(
            data.campaigns.map((c: any) => ({
              id: c.id,
              title: c.title,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  // Load collaborations
  async function loadCollabs() {
    setLoading(true);
    try {
      const res = await fetch('/api/collaborations');
      if (res.ok) {
        const data = await res.json();
        setCollabs(data.collaborations || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCollabs();
  }, []);

  // Update collab status (Approve / Request Changes)
  async function handleUpdateStatus(id: string, status: string, feedback?: string) {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/collaborations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, feedbackNotes: feedback }),
      });
      if (res.ok) {
        await loadCollabs();
        setSelectedReview(null);
        setFeedbackText('');
      }
    } catch (e) {
    } finally {
      setProcessingId(null);
    }
  }

  // Summary counts for Header Stats
  const totalCollaborations = collabs.length;
  const committedBudget = useMemo(() => {
    return collabs.reduce((acc, c) => {
      const amt = c.payment?.amount || c.campaign?.budgetPerPost || 0;
      return acc + amt;
    }, 0);
  }, [collabs]);

  const todoCount = useMemo(() => {
    return collabs.filter((c) =>
      ['CONTENT_SUBMITTED', 'APPLIED'].includes(c.status)
    ).length;
  }, [collabs]);

  // Tab Badge Counts
  const counts = useMemo(() => {
    return {
      all: collabs.length,
      active: collabs.filter((c) =>
        ['IN_PROGRESS', 'ACCEPTED', 'CONTENT_SUBMITTED', 'CHANGES_REQUESTED'].includes(
          c.status
        )
      ).length,
      invitations_received: collabs.filter((c) => c.status === 'APPLIED').length,
      invitations_sent: collabs.filter((c) => c.status === 'INVITED').length,
      todo: collabs.filter((c) =>
        ['CONTENT_SUBMITTED', 'APPLIED'].includes(c.status)
      ).length,
      completed: collabs.filter((c) =>
        ['COMPLETED', 'APPROVED'].includes(c.status)
      ).length,
    };
  }, [collabs]);

  // Filtering Logic
  const filteredCollabs = useMemo(() => {
    return collabs.filter((c) => {
      // Tab filter
      if (activeTab === 'active') {
        if (!['IN_PROGRESS', 'ACCEPTED', 'CONTENT_SUBMITTED', 'CHANGES_REQUESTED'].includes(c.status))
          return false;
      } else if (activeTab === 'invitations_received') {
        if (c.status !== 'APPLIED') return false;
      } else if (activeTab === 'invitations_sent') {
        if (c.status !== 'INVITED') return false;
      } else if (activeTab === 'todo') {
        if (!['CONTENT_SUBMITTED', 'APPLIED'].includes(c.status)) return false;
      } else if (activeTab === 'completed') {
        if (!['COMPLETED', 'APPROVED'].includes(c.status)) return false;
      }

      // Campaign filter
      if (selectedCampaignId !== 'ALL' && c.campaignId !== selectedCampaignId) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const creatorName = c.creator?.user?.name?.toLowerCase() || '';
        const creatorEmail = c.creator?.user?.email?.toLowerCase() || '';
        const campaignTitle = c.campaign?.title?.toLowerCase() || '';
        if (
          !creatorName.includes(query) &&
          !creatorEmail.includes(query) &&
          !campaignTitle.includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [collabs, activeTab, selectedCampaignId, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredCollabs.length / rowsPerPage));
  const paginatedCollabs = filteredCollabs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Checkbox Selection
  const allSelected =
    paginatedCollabs.length > 0 &&
    paginatedCollabs.every((c) => selectedCollabIds.includes(c.id));

  function handleSelectAll() {
    if (allSelected) {
      setSelectedCollabIds([]);
    } else {
      setSelectedCollabIds(paginatedCollabs.map((c) => c.id));
    }
  }

  function handleToggleSelect(id: string) {
    setSelectedCollabIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  // Format date helper
  function formatDate(dateStr?: string | null) {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  }

  // Render Status Badge
  function renderStatusBadge(status: string) {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Active</span>
          </span>
        );
      case 'CONTENT_SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Review needed</span>
          </span>
        );
      case 'INVITED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Invited</span>
          </span>
        );
      case 'APPLIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>Applied</span>
          </span>
        );
      case 'COMPLETED':
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Completed</span>
          </span>
        );
      case 'CHANGES_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Changes requested</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
            {status}
          </span>
        );
    }
  }

  // Next Action Helper
  function renderNextAction(collab: Collaboration) {
    if (collab.status === 'CONTENT_SUBMITTED') {
      return (
        <button
          onClick={() => setSelectedReview(collab)}
          className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Review content</span>
        </button>
      );
    }
    if (collab.status === 'APPLIED') {
      return (
        <button
          onClick={() => handleUpdateStatus(collab.id, 'IN_PROGRESS')}
          className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
        >
          Accept application
        </button>
      );
    }
    if (collab.status === 'INVITED') {
      return <span className="text-xs text-slate-500">Awaiting creator</span>;
    }
    if (collab.status === 'IN_PROGRESS') {
      return <span className="text-xs text-slate-500">Drafting content</span>;
    }
    if (collab.status === 'COMPLETED' || collab.status === 'APPROVED') {
      return (
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Post published</span>
        </span>
      );
    }
    return <span className="text-xs text-slate-400">—</span>;
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative">
      <Header balance={0} user={currentUser} />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        {/* ========================================================================= */}
        {/* 1. TOP TITLE ROW WITH RIGHT-ALIGNED STATS (Matches Reference Screenshot)  */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
            Collaborations
          </h1>

          {/* Inline Stats */}
          <div className="flex items-center gap-5 sm:gap-6 text-xs sm:text-sm text-slate-600">
            <div>
              <span className="font-bold text-[#0F172A] mr-1.5">{totalCollaborations}</span>
              <span>collaborations</span>
            </div>
            <div>
              <span className="font-bold text-[#0F172A] mr-1.5">€{committedBudget}</span>
              <span>committed</span>
            </div>
            <div>
              <span className="font-bold text-[#0F172A] mr-1.5">{todoCount}</span>
              <span>to do</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. FILTER & SEARCH ROW (Campaign Dropdown + Search Input)                 */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Campaign Selector Dropdown */}
          <div className="relative inline-block w-full sm:w-auto">
            <select
              value={selectedCampaignId}
              onChange={(e) => {
                setSelectedCampaignId(e.target.value);
                setCurrentPage(1);
              }}
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

          {/* Search Creators / Campaigns Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search creators, campaigns..."
              className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. STATUS TABS WITH PILL BADGE COUNTERS (Matches Reference Screenshot)    */}
        {/* ========================================================================= */}
        <div className="border-b border-[#E2E8F0] flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar pt-1">
          {[
            { key: 'all', label: 'All', count: counts.all },
            { key: 'active', label: 'Active', count: counts.active },
            {
              key: 'invitations_received',
              label: 'Invitations received',
              count: counts.invitations_received,
            },
            {
              key: 'invitations_sent',
              label: 'Invitations sent',
              count: counts.invitations_sent,
            },
            { key: 'todo', label: 'To do', count: counts.todo },
            { key: 'completed', label: 'Completed', count: counts.completed },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key as any);
                  setCurrentPage(1);
                }}
                className={`pb-3 flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#2563EB]'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>

                {/* Active Blue Bottom Underline Indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* 4. COLLABORATIONS TABLE CONTAINER (Matches Reference Screenshot)         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[11px] font-bold text-slate-500 bg-white">
                  <th className="py-4 pl-6 pr-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-3">Creator</th>
                  <th className="py-4 px-3">Campaign</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 px-3">Next action</th>
                  <th className="py-4 px-3">Due date</th>
                  <th className="py-4 px-3">Amount</th>
                  <th className="py-4 pr-6 pl-3">Updated</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#F1F5F9] text-xs text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#2563EB]" />
                        <span className="text-xs font-semibold">Loading collaborations...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedCollabs.length === 0 ? (
                  /* Exact Empty State from Reference Screenshot */
                  <tr>
                    <td colSpan={8} className="py-14 text-center text-slate-500 font-normal">
                      <span>No collaborations yet, invite a creator from the </span>
                      <Link
                        href="/dashboard/company/marketplace"
                        className="text-[#2563EB] hover:underline font-medium"
                      >
                        Marketplace
                      </Link>
                      .
                    </td>
                  </tr>
                ) : (
                  paginatedCollabs.map((collab) => {
                    const isSelected = selectedCollabIds.includes(collab.id);
                    const creatorName = collab.creator?.user?.name || 'Creator';
                    const creatorAvatar = collab.creator?.user?.avatarUrl;
                    const campaignTitle = collab.campaign?.title || 'Campaign';
                    const amount =
                      collab.payment?.amount || collab.campaign?.budgetPerPost || 0;

                    return (
                      <tr
                        key={collab.id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-4 pl-6 pr-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(collab.id)}
                            className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-0 cursor-pointer"
                          />
                        </td>

                        {/* Creator */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              {creatorAvatar ? (
                                <img
                                  src={creatorAvatar}
                                  alt={creatorName}
                                  className="w-full h-full object-cover object-top"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-600">
                                  {creatorName.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-[#0F172A] block leading-tight">
                                {creatorName}
                              </span>
                              <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">
                                {collab.creator?.headline || collab.creator?.niche || 'Creator'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Campaign */}
                        <td className="py-4 px-3 font-semibold text-[#0F172A] max-w-[160px] truncate">
                          {campaignTitle}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-3">{renderStatusBadge(collab.status)}</td>

                        {/* Next action */}
                        <td className="py-4 px-3">{renderNextAction(collab)}</td>

                        {/* Due date */}
                        <td className="py-4 px-3 text-slate-600 font-medium">
                          {formatDate(collab.submissionDate)}
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-3 font-bold text-[#0F172A]">
                          €{amount}
                        </td>

                        {/* Updated */}
                        <td className="py-4 pr-6 pl-3 text-slate-500 font-medium">
                          {formatDate(collab.updatedAt || collab.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ========================================================================= */}
          {/* TABLE FOOTER (Pagination & Rows Per Page Matching Screenshot)            */}
          {/* ========================================================================= */}
          <div className="px-6 py-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            {/* Left: Total items counter */}
            <span>{filteredCollabs.length} collaborations</span>

            {/* Center: Current Page pill */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Right: Rows per page selector */}
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <div className="relative inline-block">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white border border-slate-200 rounded-lg px-2.5 py-1 pr-6 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* REVIEW CONTENT MODAL                                                      */}
      {/* ========================================================================= */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#2563EB] tracking-wider block">
                  Content Submission Review
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] mt-0.5">
                  {selectedReview.creator?.user?.name}’s submission
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {selectedReview.draftUrl && (
                <div>
                  <span className="font-bold text-[#0F172A] block mb-1">Preview Link</span>
                  <a
                    href={selectedReview.draftUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#2563EB] hover:underline font-semibold bg-blue-50 px-3 py-2 rounded-xl"
                  >
                    <span>{selectedReview.draftUrl}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {selectedReview.draftNotes && (
                <div>
                  <span className="font-bold text-[#0F172A] block mb-1">Creator Notes / Draft Text</span>
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 whitespace-pre-line text-slate-700 leading-relaxed max-h-48 overflow-y-auto">
                    {selectedReview.draftNotes}
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-[#0F172A] block mb-1">Feedback / Requested Changes</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Leave constructive notes if requesting changes..."
                  rows={3}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={processingId === selectedReview.id}
                onClick={() =>
                  handleUpdateStatus(selectedReview.id, 'CHANGES_REQUESTED', feedbackText)
                }
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Request changes
              </button>

              <button
                type="button"
                disabled={processingId === selectedReview.id}
                onClick={() =>
                  handleUpdateStatus(selectedReview.id, 'APPROVED')
                }
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {processingId === selectedReview.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Approve content</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
