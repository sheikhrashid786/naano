'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import Link from 'next/link';
import {
  Layers,
  CheckCircle2,
  ExternalLink,
  Send,
  Loader2,
  FileText,
  Copy,
  Check
} from 'lucide-react';

export default function CreatorCollabsPage() {
  const [collabs, setCollabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [postUrl, setPostUrl] = useState('');
  const [proofText, setProofText] = useState('');
  const [activeBriefCollab, setActiveBriefCollab] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  async function loadCollabs() {
    try {
      const res = await fetch('/api/collaborations');
      if (res.ok) {
        const data = await res.json();
        const active = (data.collaborations || []).filter(
          (c: any) =>
            c.status === 'IN_PROGRESS' ||
            c.status === 'CONTENT_SUBMITTED' ||
            c.status === 'COMPLETED'
        );
        setCollabs(active);
        if (active.length > 0 && !activeBriefCollab) {
          setActiveBriefCollab(active[0]);
        }
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCollabs();
  }, []);

  async function handleSubmitPost(e: React.FormEvent) {
    e.preventDefault();
    if (!activeBriefCollab || !postUrl) return;

    setSubmittingId(activeBriefCollab.id);
    try {
      const res = await fetch(`/api/collaborations/${activeBriefCollab.id}/submit-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postUrl, proofText }),
      });

      if (res.ok) {
        setSuccessMsg('Live LinkedIn post submitted successfully! The brand has been notified for approval.');
        setPostUrl('');
        setProofText('');
        await loadCollabs();
      }
    } catch (e) {
    } finally {
      setSubmittingId(null);
    }
  }

  function copyTrackingLink(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Active Briefs & Deliverables"
        subtitle="Follow the brand brief, copy your tracking link, and submit your live LinkedIn post URL."
      />

      <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : collabs.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
            <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-[#111827]">No active briefs yet</h4>
            <p className="text-xs text-[#6B7280] mt-1 mb-4">
              Accept a campaign invitation to get access to the brief and submit deliverables.
            </p>
            <Link
              href="/dashboard/creator/applications"
              className="inline-block bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs"
            >
              Check Invitations →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Collaborations Selector */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7280] px-1">
                Your Active Campaigns ({collabs.length})
              </h3>
              {collabs.map((collab) => {
                const isSelected = activeBriefCollab?.id === collab.id;
                const isSubmitted = collab.status === 'CONTENT_SUBMITTED';
                const isCompleted = collab.status === 'COMPLETED';

                return (
                  <button
                    key={collab.id}
                    onClick={() => {
                      setActiveBriefCollab(collab);
                      setSuccessMsg('');
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-blue-600 shadow-sm ring-2 ring-blue-600/10'
                        : 'bg-white border-[#E5E7EB] hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-[#111827]">
                        {collab.campaign.company.name}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700'
                            : isSubmitted
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {collab.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-[#4B5563] truncate font-medium">
                      {collab.campaign.title}
                    </div>
                    <div className="text-[11px] font-bold text-[#111827] mt-2">
                      Fee: €{collab.fixedRate}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Brief Details & Post Submission */}
            <div className="lg:col-span-2 space-y-6">
              {activeBriefCollab && (
                <>
                  {/* Campaign Brief Container */}
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-5">
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F3F4F6]">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          Official Brand Brief
                        </span>
                        <h3 className="text-lg font-bold text-[#111827] mt-1">
                          {activeBriefCollab.campaign.title}
                        </h3>
                        <p className="text-xs text-[#6B7280]">
                          By {activeBriefCollab.campaign.company.name} · Deliverable Fee: €{activeBriefCollab.fixedRate}
                        </p>
                      </div>

                      <Link
                        href={`/dashboard/creator/messages?collabId=${activeBriefCollab.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl shrink-0"
                      >
                        Chat with Brand
                      </Link>
                    </div>

                    {/* Brief Sections */}
                    <div className="space-y-4 text-xs">
                      {activeBriefCollab.campaign.brief?.trackingUrl && (
                        <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                              Required Tracking URL (Add to 1st comment)
                            </span>
                            <span className="text-xs font-mono text-blue-900 truncate block mt-0.5">
                              {activeBriefCollab.campaign.brief.trackingUrl}
                            </span>
                          </div>
                          <button
                            onClick={() => copyTrackingLink(activeBriefCollab.campaign.brief.trackingUrl)}
                            className="bg-white border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      )}

                      {activeBriefCollab.campaign.brief?.angle && (
                        <div>
                          <h4 className="font-bold text-[#111827] uppercase tracking-wider text-[10px] mb-1">
                            Narrative Angle
                          </h4>
                          <p className="text-[#4B5563] leading-relaxed bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB]">
                            {activeBriefCollab.campaign.brief.angle}
                          </p>
                        </div>
                      )}

                      {activeBriefCollab.campaign.brief?.keyTalkingPoints && (
                        <div>
                          <h4 className="font-bold text-[#111827] uppercase tracking-wider text-[10px] mb-1">
                            Key Talking Points
                          </h4>
                          <p className="text-[#4B5563] leading-relaxed whitespace-pre-line bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB]">
                            {activeBriefCollab.campaign.brief.keyTalkingPoints}
                          </p>
                        </div>
                      )}

                      {activeBriefCollab.campaign.brief?.dosAndDonts && (
                        <div>
                          <h4 className="font-bold text-[#111827] uppercase tracking-wider text-[10px] mb-1">
                            Do&apos;s &amp; Don&apos;ts
                          </h4>
                          <p className="text-[#4B5563] leading-relaxed whitespace-pre-line bg-[#F9FAFB] p-3 rounded-xl border border-[#E5E7EB]">
                            {activeBriefCollab.campaign.brief.dosAndDonts}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submission Box */}
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-4">
                    <h3 className="text-base font-bold text-[#111827]">
                      Submit Live LinkedIn Deliverable
                    </h3>

                    {activeBriefCollab.status === 'COMPLETED' ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>This collaboration has been approved and €{activeBriefCollab.fixedRate} has been released!</span>
                      </div>
                    ) : activeBriefCollab.status === 'CONTENT_SUBMITTED' ? (
                      <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs space-y-2">
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Content Submitted — Awaiting Brand Approval</span>
                        </div>
                        <div className="font-mono text-[11px] text-amber-900 break-all">
                          URL: {activeBriefCollab.submittedPostUrl}
                        </div>
                        <p className="text-[11px] text-amber-700">
                          The brand will review and release your payout shortly.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitPost} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                            Live LinkedIn Post URL *
                          </label>
                          <input
                            type="url"
                            required
                            value={postUrl}
                            onChange={(e) => setPostUrl(e.target.value)}
                            placeholder="https://www.linkedin.com/posts/..."
                            className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                            Notes / Delivery Proof (optional)
                          </label>
                          <textarea
                            rows={2}
                            value={proofText}
                            onChange={(e) => setProofText(e.target.value)}
                            placeholder="e.g. Published at 09:00 CET, tracking link added in 1st comment..."
                            className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-blue-600 resize-none"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={submittingId === activeBriefCollab.id || !postUrl}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {submittingId === activeBriefCollab.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Submit for Brand Approval</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
