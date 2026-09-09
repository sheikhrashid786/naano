'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import Link from 'next/link';
import {
  Layers,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  DollarSign
} from 'lucide-react';

export default function CompanyCollabsPage() {
  const [collabs, setCollabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);

  async function loadCollabs() {
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

  async function handleUpdateStatus(id: string, status: string) {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/collaborations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await loadCollabs();
        setSelectedReview(null);
      }
    } catch (e) {
    } finally {
      setProcessingId(null);
    }
  }

  const filtered = collabs.filter((c) => {
    if (filter === 'REVIEW') return c.status === 'CONTENT_SUBMITTED';
    if (filter === 'IN_PROGRESS') return c.status === 'IN_PROGRESS';
    if (filter === 'PENDING') return c.status === 'INVITED' || c.status === 'APPLIED';
    if (filter === 'COMPLETED') return c.status === 'COMPLETED';
    return true;
  });

  const needsReviewCount = collabs.filter((c) => c.status === 'CONTENT_SUBMITTED').length;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Collaborations"
        subtitle="Review submitted content, track post performance, and approve creator payouts."
      />

      <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3 text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${filter === 'ALL'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
              }`}
          >
            All ({collabs.length})
          </button>
          <button
            onClick={() => setFilter('REVIEW')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${filter === 'REVIEW'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
              }`}
          >
            <span>Needs Review</span>
            {needsReviewCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {needsReviewCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('IN_PROGRESS')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${filter === 'IN_PROGRESS'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
              }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${filter === 'PENDING'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
              }`}
          >
            Pending Invites / Applications
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${filter === 'COMPLETED'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
              }`}
          >
            Completed &amp; Paid
          </button>
        </div>

        {/* Collaborations List */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
            <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-[#111827]">No collaborations found</h4>
            <p className="text-xs text-[#6B7280] mt-1">There are no records in this view.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((collab) => {
              const isSubmitted = collab.status === 'CONTENT_SUBMITTED';
              const isApplied = collab.status === 'APPLIED';
              const isCompleted = collab.status === 'COMPLETED';

              return (
                <div
                  key={collab.id}
                  className={`bg-white border rounded-2xl p-6 shadow-xs transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${isSubmitted ? 'border-amber-300 bg-amber-50/20' : 'border-[#E5E7EB]'
                    }`}
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                      {collab.creator.user.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#111827] truncate">
                          {collab.creator.user.name}
                        </h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isSubmitted
                                ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                        >
                          {collab.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-xs text-[#4B5563]">
                        Campaign:{' '}
                        <strong className="text-[#111827]">{collab.campaign.title}</strong>
                      </div>

                      {collab.pitchMessage && (
                        <p className="text-xs text-[#6B7280] bg-[#F9FAFB] p-2.5 rounded-xl max-w-xl italic mt-1.5">
                          &ldquo;{collab.pitchMessage}&rdquo;
                        </p>
                      )}

                      {isSubmitted && collab.submittedPostUrl && (
                        <div className="pt-2 flex items-center gap-3 text-xs">
                          <a
                            href={collab.submittedPostUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                          >
                            <span>Open live LinkedIn post</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Metrics */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-[#9CA3AF]">
                        Fixed Fee
                      </div>
                      <div className="text-base font-bold text-[#111827]">
                        €{collab.fixedRate}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/company/messages?collabId=${collab.id}`}
                        className="p-2 rounded-xl border border-[#E5E7EB] hover:bg-gray-100 text-[#4B5563] transition-colors"
                        title="Chat with creator"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>

                      {isApplied && (
                        <button
                          onClick={() => handleUpdateStatus(collab.id, 'ACCEPTED')}
                          disabled={processingId === collab.id}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                          Accept Application
                        </button>
                      )}

                      {isSubmitted && (
                        <button
                          onClick={() => setSelectedReview(collab)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Review &amp; Approve</span>
                        </button>
                      )}

                      {isCompleted && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Paid &amp; Live</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Content Review Modal */}
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
              <h3 className="text-lg font-bold text-[#111827]">Review Submitted Content</h3>
              <p className="text-xs text-[#6B7280]">
                Submitted by <strong>{selectedReview.creator.user.name}</strong> for{' '}
                <strong>{selectedReview.campaign.title}</strong>
              </p>

              <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-2">
                <div className="text-xs font-semibold text-[#4B5563]">Live Post URL:</div>
                <a
                  href={selectedReview.submittedPostUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-blue-600 break-all hover:underline flex items-center gap-1"
                >
                  <span>{selectedReview.submittedPostUrl}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>

                {selectedReview.postProofText && (
                  <div className="pt-2 text-xs text-[#4B5563]">
                    <div className="font-semibold text-[#111827] mb-1">Creator Note / Proof:</div>
                    <div className="text-[#6B7280] italic">{selectedReview.postProofText}</div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                <div>
                  <span className="font-bold">Deliverable Fee to Release:</span>
                  <p className="text-[11px] text-emerald-700">Processed via Stripe Connect payout</p>
                </div>
                <div className="text-lg font-bold text-emerald-900">
                  €{selectedReview.fixedRate}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Close
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReview.id, 'APPROVED')}
                  disabled={processingId === selectedReview.id}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {processingId === selectedReview.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Approve Content &amp; Release Payment</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
