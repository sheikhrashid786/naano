'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/dashboard/Header';
import {
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Send,
  FileText
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Applied
          </span>
        );
      case 'IN_PROGRESS':
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
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
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Sticky Header with Dynamic User Avatar matching reference screenshot */}
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
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs border ${
              toastMsg.type === 'success'
                ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {toastMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span>{toastMsg.text}</span>
            </div>
            <button onClick={() => setToastToast(null)} className="hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Title & Subtitle */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
            Collaborations
          </h1>
          <p className="text-xs sm:text-[13px] text-[#64748B] mt-1.5 font-normal">
            Every step tells you where you stand, what to do, and what happens if you do nothing.
          </p>
        </div>

        {/* Dynamic Filter Tabs with Pill Counts matching screenshot */}
        <div className="flex items-center gap-6 sm:gap-8 border-b border-[#E2E8F0] mt-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          {/* Tab 1: All */}
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center pb-3 transition-colors cursor-pointer text-xs sm:text-[13px] ${
              activeTab === 'all'
                ? 'text-[#2864EA] font-bold border-b-2 border-[#2864EA] -mb-[2px]'
                : 'text-[#475569] hover:text-[#111827] font-medium'
            }`}
          >
            <span>All</span>
            <span
              className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold leading-none ${
                activeTab === 'all'
                  ? 'bg-[#2864EA] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] border border-slate-200/60'
              }`}
            >
              {counts.all}
            </span>
          </button>

          {/* Tab 2: Active */}
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`flex items-center pb-3 transition-colors cursor-pointer text-xs sm:text-[13px] ${
              activeTab === 'active'
                ? 'text-[#2864EA] font-bold border-b-2 border-[#2864EA] -mb-[2px]'
                : 'text-[#475569] hover:text-[#111827] font-medium'
            }`}
          >
            <span>Active</span>
            <span
              className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold leading-none ${
                activeTab === 'active'
                  ? 'bg-[#2864EA] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] border border-slate-200/60'
              }`}
            >
              {counts.active}
            </span>
          </button>

          {/* Tab 3: Needs action */}
          <button
            type="button"
            onClick={() => setActiveTab('needs_action')}
            className={`flex items-center pb-3 transition-colors cursor-pointer text-xs sm:text-[13px] ${
              activeTab === 'needs_action'
                ? 'text-[#2864EA] font-bold border-b-2 border-[#2864EA] -mb-[2px]'
                : 'text-[#475569] hover:text-[#111827] font-medium'
            }`}
          >
            <span>Needs action</span>
            <span
              className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold leading-none ${
                activeTab === 'needs_action'
                  ? 'bg-[#2864EA] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] border border-slate-200/60'
              }`}
            >
              {counts.needsAction}
            </span>
          </button>

          {/* Tab 4: Applications sent */}
          <button
            type="button"
            onClick={() => setActiveTab('applications_sent')}
            className={`flex items-center pb-3 transition-colors cursor-pointer text-xs sm:text-[13px] ${
              activeTab === 'applications_sent'
                ? 'text-[#2864EA] font-bold border-b-2 border-[#2864EA] -mb-[2px]'
                : 'text-[#475569] hover:text-[#111827] font-medium'
            }`}
          >
            <span>Applications sent</span>
            <span
              className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold leading-none ${
                activeTab === 'applications_sent'
                  ? 'bg-[#2864EA] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] border border-slate-200/60'
              }`}
            >
              {counts.applicationsSent}
            </span>
          </button>

          {/* Tab 5: Declined */}
          <button
            type="button"
            onClick={() => setActiveTab('declined')}
            className={`flex items-center pb-3 transition-colors cursor-pointer text-xs sm:text-[13px] ${
              activeTab === 'declined'
                ? 'text-[#2864EA] font-bold border-b-2 border-[#2864EA] -mb-[2px]'
                : 'text-[#475569] hover:text-[#111827] font-medium'
            }`}
          >
            <span>Declined</span>
            <span
              className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold leading-none ${
                activeTab === 'declined'
                  ? 'bg-[#2864EA] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] border border-slate-200/60'
              }`}
            >
              {counts.declined}
            </span>
          </button>

          {/* Tab 6: Completed */}
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`flex items-center pb-3 transition-colors cursor-pointer text-xs sm:text-[13px] ${
              activeTab === 'completed'
                ? 'text-[#2864EA] font-bold border-b-2 border-[#2864EA] -mb-[2px]'
                : 'text-[#475569] hover:text-[#111827] font-medium'
            }`}
          >
            <span>Completed</span>
            <span
              className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold leading-none ${
                activeTab === 'completed'
                  ? 'bg-[#2864EA] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] border border-slate-200/60'
              }`}
            >
              {counts.completed}
            </span>
          </button>
        </div>

        {/* Collaborations Table Card matching screenshot */}
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] mt-6">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#2864EA]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-[#F1F5F9] text-xs font-medium text-[#64748B]">
                    <th className="py-4 px-6 font-medium">Brand</th>
                    <th className="py-4 px-4 font-medium">Campaign</th>
                    <th className="py-4 px-4 font-medium">Status</th>
                    <th className="py-4 px-4 font-medium">Performance</th>
                    <th className="py-4 px-4 font-medium">Next action</th>
                    <th className="py-4 px-4 font-medium">Due date</th>
                    <th className="py-4 px-6 font-medium text-right sm:text-left">Your net</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filteredCollabs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-14 text-center text-xs sm:text-[13px] text-[#64748B] border-b border-[#F1F5F9]"
                      >
                        No collaborations yet. Brand invitations and your accepted applications land here.
                      </td>
                    </tr>
                  ) : (
                    filteredCollabs.map((collab) => {
                      const companyName = collab.company?.name || collab.campaign?.company?.name || 'Brand';
                      const campaignTitle = collab.campaign?.title || 'Main Campaign';
                      const rate = collab.fixedRate || collab.payment?.amount || 240;
                      const dueDate = formatDueDate(collab);
                      const isUpdating = updatingId === collab.id;

                      return (
                        <tr
                          key={collab.id}
                          className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/70 transition-colors text-xs text-[#111827]"
                        >
                          {/* 1. Brand */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-[#111827] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                {companyName.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-xs text-[#111827] truncate">
                                  {companyName}
                                </div>
                                <div className="text-[10.5px] text-[#64748B] truncate">
                                  {collab.company?.industry || 'B2B SaaS'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Campaign */}
                          <td className="py-4 px-4">
                            <div className="font-semibold text-xs text-[#111827] line-clamp-1 max-w-[180px]">
                              {campaignTitle}
                            </div>
                            <div className="text-[10.5px] text-[#64748B] line-clamp-1 max-w-[180px]">
                              {collab.campaign?.deliverables || 'Sponsored LinkedIn post'}
                            </div>
                          </td>

                          {/* 3. Status */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {renderStatusBadge(collab.status)}
                          </td>

                          {/* 4. Performance */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {collab.submittedPostUrl ? (
                              <a
                                href={collab.submittedPostUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[#2864EA] font-semibold hover:underline"
                              >
                                <span>Live post</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-[#94A3B8]">—</span>
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
                                  className="px-3 py-1 bg-[#2864EA] hover:bg-[#1e52c8] text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                                >
                                  {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Accept'}
                                </button>
                                <button
                                  type="button"
                                  disabled={isUpdating}
                                  onClick={() => handleStatusChange(collab.id, 'DECLINED')}
                                  className="px-2.5 py-1 bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#111827] rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                                >
                                  Decline
                                </button>
                              </div>
                            ) : collab.status === 'IN_PROGRESS' || collab.status === 'ACCEPTED' ? (
                              <button
                                type="button"
                                onClick={() => setSelectedCollabForSubmit(collab)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2864EA] hover:bg-[#1e52c8] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                              >
                                <Send className="w-3 h-3" />
                                <span>Submit post URL</span>
                              </button>
                            ) : collab.status === 'CONTENT_SUBMITTED' ? (
                              <span className="text-xs text-[#D97706] font-medium">
                                Awaiting approval
                              </span>
                            ) : collab.status === 'COMPLETED' ? (
                              <span className="text-xs text-[#10B981] font-medium">
                                Payout released
                              </span>
                            ) : collab.status === 'APPLIED' ? (
                              <span className="text-xs text-[#64748B] font-medium">
                                Under review
                              </span>
                            ) : (
                              <span className="text-xs text-[#94A3B8]">—</span>
                            )}
                          </td>

                          {/* 6. Due Date */}
                          <td className="py-4 px-4 text-xs text-[#64748B] whitespace-nowrap">
                            {dueDate}
                          </td>

                          {/* 7. Your Net */}
                          <td className="py-4 px-6 text-xs sm:text-sm font-bold text-[#111827] whitespace-nowrap text-right sm:text-left">
                            €{rate}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Table Footer matching reference screenshot */}
              <div className="px-6 py-4 flex items-center justify-between">
                <span className="text-xs text-[#64748B] font-medium">
                  {filteredCollabs.length} {filteredCollabs.length === 1 ? 'collaboration' : 'collaborations'}
                </span>

                <div className="flex items-center gap-1">
                  <span className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2864EA] font-bold text-xs flex items-center justify-center border border-[#DBEAFE]">
                    1
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Submit Post URL Modal */}
      {selectedCollabForSubmit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  Submit LinkedIn Post
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  {selectedCollabForSubmit.campaign?.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedCollabForSubmit(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-[#64748B] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitPost} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#374151] mb-1.5">
                  Live LinkedIn Post URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.linkedin.com/posts/username_..."
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-[#2864EA]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#374151] mb-1.5">
                  Proof / Comments (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Added the tracked link in the first comment as requested..."
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-[#2864EA]"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setSelectedCollabForSubmit(null)}
                  className="flex-1 py-2.5 bg-white border border-[#E2E8F0] rounded-xl font-semibold text-[#64748B] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#2864EA] hover:bg-[#1e52c8] text-white rounded-xl font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Post</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
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
