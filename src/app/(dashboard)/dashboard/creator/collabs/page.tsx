'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/dashboard/Header';
import EscrowMilestoneStepper from '@/components/dashboard/EscrowMilestoneStepper';
import {
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Send,
  FileText,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

type TabType = 'all' | 'active' | 'needs_action' | 'applications_sent' | 'declined' | 'completed';

export default function CreatorCollabsPage() {
  const [collabs, setCollabs] = useState<any[]>([]);
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  // Submit Post Modal state
  const [selectedCollabForSubmit, setSelectedCollabForSubmit] = useState<any | null>(null);
  const [postUrl, setPostUrl] = useState('');
  const [proofText, setProofText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Response / Status change state
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMsg, setToastToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function loadData() {
    try {
      const [collabsRes, profileRes] = await Promise.all([
        fetch('/api/collaborations'),
        fetch('/api/creator/profile'),
      ]);

      if (collabsRes.ok) {
        const data = await collabsRes.json();
        setCollabs(data.collaborations || []);
      }

      if (profileRes.ok) {
        const pData = await profileRes.json();
        setCreator(pData.creator || null);
      }
    } catch (e) {
      console.error('Failed to load collaborations data:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Compute tab counts dynamically
  const counts = useMemo(() => {
    const all = collabs.length;
    const active = collabs.filter((c) =>
      ['ACCEPTED', 'IN_PROGRESS', 'CONTENT_SUBMITTED', 'APPROVED'].includes(c.status)
    ).length;
    const needsAction = collabs.filter((c) =>
      ['INVITED', 'ACCEPTED', 'IN_PROGRESS'].includes(c.status)
    ).length;
    const applicationsSent = collabs.filter((c) => c.status === 'APPLIED').length;
    const declined = collabs.filter((c) =>
      ['DECLINED', 'CANCELLED'].includes(c.status)
    ).length;
    const completed = collabs.filter((c) => c.status === 'COMPLETED').length;

    return {
      all,
      active,
      needsAction,
      applicationsSent,
      declined,
      completed,
    };
  }, [collabs]);

  // Filter list based on selected tab
  const filteredCollabs = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return collabs.filter((c) =>
          ['ACCEPTED', 'IN_PROGRESS', 'CONTENT_SUBMITTED', 'APPROVED'].includes(c.status)
        );
      case 'needs_action':
        return collabs.filter((c) =>
          ['INVITED', 'ACCEPTED', 'IN_PROGRESS'].includes(c.status)
        );
      case 'applications_sent':
        return collabs.filter((c) => c.status === 'APPLIED');
      case 'declined':
        return collabs.filter((c) =>
          ['DECLINED', 'CANCELLED'].includes(c.status)
        );
      case 'completed':
        return collabs.filter((c) => c.status === 'COMPLETED');
      case 'all':
      default:
        return collabs;
    }
  }, [collabs, activeTab]);

  // Handle Accept / Decline invitation
  async function handleStatusChange(collabId: string, status: 'ACCEPTED' | 'DECLINED') {
    setUpdatingId(collabId);
    try {
      const res = await fetch(`/api/collaborations/${collabId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setToastToast({
          type: 'success',
          text: status === 'ACCEPTED' ? 'Invitation accepted! You can now prepare your post.' : 'Invitation declined.',
        });
        await loadData();
      } else {
        setToastToast({ type: 'error', text: 'Failed to update collaboration status.' });
      }
    } catch (e) {
      setToastToast({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setToastToast(null), 5000);
    }
  }

  // Handle post URL submission
  async function handleSubmitPost(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCollabForSubmit || !postUrl) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/collaborations/${selectedCollabForSubmit.id}/submit-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postUrl, proofText }),
      });

      if (res.ok) {
        setToastToast({
          type: 'success',
          text: 'LinkedIn post submitted for brand review!',
        });
        setSelectedCollabForSubmit(null);
        setPostUrl('');
        setProofText('');
        await loadData();
      } else {
        setToastToast({ type: 'error', text: 'Failed to submit post URL.' });
      }
    } catch (e) {
      setToastToast({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToastToast(null), 5000);
    }
  }

  // Helper for due date display
  function formatDueDate(collab: any) {
    if (collab.campaign?.endDate) {
      const d = new Date(collab.campaign.endDate);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    const created = new Date(collab.createdAt || Date.now());
    created.setDate(created.getDate() + 14);
    return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Helper for status badge
  function renderStatusBadge(status: string) {
    switch (status) {
      case 'INVITED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Invited
          </span>
        );
      case 'APPLIED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-teal-50 text-teal-800 border border-teal-200/80">
            Applied
          </span>
        );
      case 'IN_PROGRESS':
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
            In progress
          </span>
        );
      case 'CONTENT_SUBMITTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Under review
          </span>
        );
      case 'COMPLETED':
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        );
      case 'DECLINED':
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-16 font-sans">
      <Header
        user={{
          name: creator?.user?.name,
          avatarUrl: creator?.user?.avatarUrl,
        }}
        balance={0}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        {/* Toast Alert */}
        {toastMsg && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-2xs border ${
              toastMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toastMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{toastMsg.text}</span>
            </div>
            <button onClick={() => setToastToast(null)} className="hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sponsorship Deliverables &amp; Escrow Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Collaborations Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Track contract status, submit live draft URLs for brand approval, and monitor escrow payout disbursements.
            </p>
          </div>
        </div>

        {/* Dynamic Filter Tabs with Luxury Pill Styling */}
        <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'active', label: 'Active', count: counts.active },
            { id: 'needs_action', label: 'Needs Action', count: counts.needsAction },
            { id: 'applications_sent', label: 'Applied', count: counts.applicationsSent },
            { id: 'declined', label: 'Declined', count: counts.declined },
            { id: 'completed', label: 'Completed', count: counts.completed },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Collaborations Table Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <span className="text-xs font-bold text-slate-500">Loading collaborations...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Brand</th>
                    <th className="py-4 px-4">Campaign Brief</th>
                    <th className="py-4 px-4">Status &amp; Milestones</th>
                    <th className="py-4 px-4">Proof</th>
                    <th className="py-4 px-4">Action</th>
                    <th className="py-4 px-4">Due Date</th>
                    <th className="py-4 px-6 text-right sm:text-left">Your Net</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCollabs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-16 text-center text-xs text-slate-400"
                      >
                        No collaborations found for this filter tab.
                      </td>
                    </tr>
                  ) : (
                    filteredCollabs.map((collab) => {
                      const companyName = collab.company?.name || collab.campaign?.company?.name || 'Brand';
                      const campaignTitle = collab.campaign?.title || 'LinkedIn Sponsorship';
                      const rate = collab.fixedRate || collab.payment?.amount || 240;
                      const dueDate = formatDueDate(collab);
                      const isUpdating = updatingId === collab.id;

                      return (
                        <tr
                          key={collab.id}
                          className="hover:bg-slate-50/60 transition-colors text-xs text-slate-900"
                        >
                          {/* 1. Brand */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                                {companyName.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-xs text-slate-900 truncate">
                                  {companyName}
                                </div>
                                <div className="text-[10.5px] text-slate-400 truncate">
                                  {collab.company?.industry || 'B2B SaaS'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Campaign */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-xs text-slate-900 line-clamp-1 max-w-[200px]">
                              {campaignTitle}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[200px] mt-0.5">
                              {collab.campaign?.deliverables || 'Sponsored LinkedIn post'}
                            </div>
                          </td>

                          {/* 3. Status & Milestones */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <div className="space-y-1.5 w-44">
                              <div>{renderStatusBadge(collab.status)}</div>
                              <EscrowMilestoneStepper
                                status={collab.status}
                                paymentStatus={collab.payment?.status}
                                compact={true}
                              />
                            </div>
                          </td>

                          {/* 4. Proof */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {collab.submittedPostUrl ? (
                              <a
                                href={collab.submittedPostUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold hover:underline"
                              >
                                <span>Live Post</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400 font-mono">—</span>
                            )}
                          </td>

                          {/* 5. Next Action */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {collab.status === 'INVITED' ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleStatusChange(collab.id, 'ACCEPTED')}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 active:scale-95"
                                >
                                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Accept'}
                                </button>
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleStatusChange(collab.id, 'DECLINED')}
                                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                                >
                                  Decline
                                </button>
                              </div>
                            ) : collab.status === 'IN_PROGRESS' || collab.status === 'ACCEPTED' ? (
                              <button
                                type="button"
                                onClick={() => setSelectedCollabForSubmit(collab)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                              >
                                <Send className="w-3 h-3" />
                                <span>Submit URL</span>
                              </button>
                            ) : collab.status === 'CONTENT_SUBMITTED' ? (
                              <span className="text-xs text-amber-600 font-bold">
                                Under review
                              </span>
                            ) : collab.status === 'COMPLETED' ? (
                              <span className="text-xs text-emerald-600 font-bold">
                                Payout released
                              </span>
                            ) : collab.status === 'APPLIED' ? (
                              <span className="text-xs text-slate-500 font-bold">
                                Under review
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 font-mono">—</span>
                            )}
                          </td>

                          {/* 6. Due Date */}
                          <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                            {dueDate}
                          </td>

                          {/* 7. Your Net */}
                          <td className="py-4 px-6 text-xs sm:text-sm font-black text-slate-900 font-mono whitespace-nowrap text-right sm:text-left">
                            €{rate}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Table Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">
                  Showing {filteredCollabs.length} {filteredCollabs.length === 1 ? 'collaboration' : 'collaborations'}
                </span>
                <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                  Escrow Protected
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Submit Post URL Modal */}
      {selectedCollabForSubmit && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Submit Live LinkedIn Post
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedCollabForSubmit.campaign?.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedCollabForSubmit(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitPost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Live LinkedIn Post URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.linkedin.com/posts/username_..."
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Proof &amp; Tracking Confirmation (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Added the tracked link in the first comment as requested..."
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCollabForSubmit(null)}
                  className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit for Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
