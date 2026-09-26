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
  Layers,
  Sparkles,
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

  // Load collabs from API
  async function loadCollabs() {
    setLoading(true);
    try {
      const res = await fetch('/api/collabs');
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

  // Update status handler
  async function handleUpdateStatus(
    id: string,
    newStatus: string,
    feedback?: string
  ) {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/collabs?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          feedbackNotes: feedback,
        }),
      });
      if (res.ok) {
        setCollabs((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: newStatus,
                  feedbackNotes: feedback || c.feedbackNotes,
                }
              : c
          )
        );
        setSelectedReview(null);
        setFeedbackText('');
      }
    } catch (e) {
    } finally {
      setProcessingId(null);
    }
  }

  // Derived metrics for summary
  const totalCollaborations = collabs.length;
  const committedBudget = collabs.reduce(
    (sum, c) => sum + (c.payment?.amount || c.campaign?.budgetPerPost || 0),
    0
  );
  const todoCount = collabs.filter(
    (c) => c.status === 'CONTENT_SUBMITTED' || c.status === 'APPLIED'
  ).length;

  // Filter tab counts
  const counts = useMemo(() => {
    return {
      all: collabs.length,
      active: collabs.filter(
        (c) =>
          c.status === 'IN_PROGRESS' ||
          c.status === 'CONTENT_SUBMITTED' ||
          c.status === 'CHANGES_REQUESTED'
      ).length,
      invitations_received: collabs.filter((c) => c.status === 'APPLIED').length,
      invitations_sent: collabs.filter((c) => c.status === 'INVITED').length,
      todo: todoCount,
      completed: collabs.filter(
        (c) => c.status === 'COMPLETED' || c.status === 'APPROVED'
      ).length,
    };
  }, [collabs, todoCount]);

  // Filtered collaborations
  const filteredCollabs = useMemo(() => {
    return collabs.filter((c) => {
      // Tab filter
      if (activeTab === 'active') {
        const isActive =
          c.status === 'IN_PROGRESS' ||
          c.status === 'CONTENT_SUBMITTED' ||
          c.status === 'CHANGES_REQUESTED';
        if (!isActive) return false;
      } else if (activeTab === 'invitations_received') {
        if (c.status !== 'APPLIED') return false;
      } else if (activeTab === 'invitations_sent') {
        if (c.status !== 'INVITED') return false;
      } else if (activeTab === 'todo') {
        if (c.status !== 'CONTENT_SUBMITTED' && c.status !== 'APPLIED') return false;
      } else if (activeTab === 'completed') {
        if (c.status !== 'COMPLETED' && c.status !== 'APPROVED') return false;
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

  function renderStatusBadge(status: string) {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Drafting</span>
          </span>
        );
      case 'CONTENT_SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Review Needed</span>
          </span>
        );
      case 'INVITED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Invited</span>
          </span>
        );
      case 'APPLIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>Applied</span>
          </span>
        );
      case 'COMPLETED':
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            <span>Completed</span>
          </span>
        );
      case 'CHANGES_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Changes Requested</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
            {status}
          </span>
        );
    }
  }

  function renderNextAction(collab: Collaboration) {
    if (collab.status === 'CONTENT_SUBMITTED') {
      return (
        <button
          onClick={() => setSelectedReview(collab)}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer bg-indigo-50 px-2.5 py-1 rounded-lg"
        >
          <span>Review draft</span>
        </button>
      );
    }
    if (collab.status === 'APPLIED') {
      return (
        <button
          onClick={() => handleUpdateStatus(collab.id, 'IN_PROGRESS')}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-lg"
        >
          Accept application
        </button>
      );
    }
    if (collab.status === 'INVITED') {
      return <span className="text-xs text-slate-400">Awaiting creator</span>;
    }
    if (collab.status === 'IN_PROGRESS') {
      return <span className="text-xs text-slate-400">Draft in progress</span>;
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
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative font-sans">
      <Header balance={committedBudget} user={currentUser} />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* 1. TOP TITLE ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                <Layers className="w-3 h-3 text-indigo-400" />
                <span>Brand Pipeline</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {collabs.length} Active Collaborations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight">
              Collaborations Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review creator drafts, coordinate revisions, and authorize escrow milestone releases.
            </p>
          </div>

          {/* Forecaster 3-chip inline summary */}
          <div className="flex items-center gap-4 bg-white border border-slate-200/90 rounded-2xl p-2.5 px-4 shadow-2xs self-start sm:self-auto">
            <div className="border-l-2 border-indigo-500 pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Total
              </span>
              <span className="text-sm font-black text-slate-900 font-mono block">
                {totalCollaborations}
              </span>
            </div>
            <div className="border-l-2 border-emerald-500 pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Committed
              </span>
              <span className="text-sm font-black text-slate-900 font-mono block">
                €{committedBudget.toLocaleString()}
              </span>
            </div>
            <div className="border-l-2 border-amber-500 pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Action Needed
              </span>
              <span className="text-sm font-black text-amber-600 font-mono block">
                {todoCount}
              </span>
            </div>
          </div>
        </div>

        {/* 2. FILTER & SEARCH BAR */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative inline-block w-full sm:w-auto">
              <select
                value={selectedCampaignId}
                onChange={(e) => {
                  setSelectedCampaignId(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto appearance-none bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none focus:border-indigo-600 cursor-pointer"
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

            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search creator name, campaign title..."
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="text-xs text-slate-500 font-mono self-end sm:self-auto">
            Showing <strong className="text-slate-900">{filteredCollabs.length}</strong> collaborations
          </div>
        </div>

        {/* 3. STATUS TABS */}
        <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 overflow-x-auto max-w-full">
          {[
            { key: 'all', label: 'All', count: counts.all },
            { key: 'active', label: 'Active', count: counts.active },
            {
              key: 'invitations_received',
              label: 'Invitations Received',
              count: counts.invitations_received,
            },
            {
              key: 'invitations_sent',
              label: 'Invitations Sent',
              count: counts.invitations_sent,
            },
            { key: 'todo', label: 'Action Needed', count: counts.todo },
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
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4. COLLABORATIONS TABLE CONTAINER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-4 pl-6 pr-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-4">Creator</th>
                  <th className="py-4 px-4">Campaign</th>
                  <th className="py-4 px-4">Milestone Status</th>
                  <th className="py-4 px-4">Next Action</th>
                  <th className="py-4 px-4">Due Date</th>
                  <th className="py-4 px-4">Budget</th>
                  <th className="py-4 pr-6 pl-4">Updated</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
                        <span className="text-xs font-semibold">Loading collaborations...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedCollabs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-500 font-normal">
                      <Layers className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <span>No collaborations match this filter. Find and book creators in the </span>
                      <Link
                        href="/dashboard/company/marketplace"
                        className="text-indigo-600 hover:underline font-bold"
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
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isSelected ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <td className="py-4 pl-6 pr-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(collab.id)}
                            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                              {creatorAvatar ? (
                                <img
                                  src={creatorAvatar}
                                  alt={creatorName}
                                  className="w-full h-full object-cover object-top"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-xs text-indigo-600 bg-indigo-50">
                                  {creatorName.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block text-xs">
                                {creatorName}
                              </span>
                              <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                                {collab.creator?.headline || collab.creator?.niche || 'Creator'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-semibold text-slate-800 max-w-[170px] truncate">
                          {campaignTitle}
                        </td>

                        <td className="py-4 px-4">{renderStatusBadge(collab.status)}</td>

                        <td className="py-4 px-4">{renderNextAction(collab)}</td>

                        <td className="py-4 px-4 text-slate-600 font-mono text-[11px]">
                          {formatDate(collab.submissionDate)}
                        </td>

                        <td className="py-4 px-4 font-mono font-black text-slate-900">
                          €{amount.toLocaleString()}
                        </td>

                        <td className="py-4 pr-6 pl-4 text-slate-500 font-mono text-[11px]">
                          {formatDate(collab.updatedAt || collab.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <span>{filteredCollabs.length} total records</span>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <div className="relative inline-block">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-1 pr-7 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* REVIEW CONTENT MODAL                                                      */}
      {/* ========================================================================= */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  Content Deliverable Review
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedReview.creator?.user?.name}’s Draft
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
                  <span className="font-bold text-slate-900 block mb-1">Preview Link</span>
                  <a
                    href={selectedReview.draftUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-indigo-600 hover:underline font-semibold bg-indigo-50/70 border border-indigo-100 px-3.5 py-2 rounded-xl"
                  >
                    <span>{selectedReview.draftUrl}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {selectedReview.draftNotes && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Creator Notes / Draft Text</span>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 whitespace-pre-line text-slate-700 leading-relaxed max-h-48 overflow-y-auto">
                    {selectedReview.draftNotes}
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-900 block mb-1">Feedback / Requested Changes</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Leave constructive revision notes if changes are required..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white"
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
                Request Revisions
              </button>

              <button
                type="button"
                disabled={processingId === selectedReview.id}
                onClick={() =>
                  handleUpdateStatus(selectedReview.id, 'APPROVED')
                }
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
              >
                {processingId === selectedReview.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Approve Draft</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
