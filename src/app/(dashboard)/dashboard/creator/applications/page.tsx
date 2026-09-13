'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import Link from 'next/link';
import { Layers, CheckCircle2, XCircle, Clock, Loader2, MessageSquare } from 'lucide-react';

export default function CreatorApplicationsPage() {
  const [collabs, setCollabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  async function handleRespond(id: string, status: 'ACCEPTED' | 'DECLINED') {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/collaborations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await loadCollabs();
      }
    } catch (e) {
    } finally {
      setProcessingId(null);
    }
  }

  const invites = collabs.filter((c) => c.status === 'INVITED');
  const myApplications = collabs.filter((c) => c.status === 'APPLIED');

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Applications & Invitations"
        subtitle="Review brand invitations and track applications you have sent to SaaS companies."
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* Section 1: Invitations Received from Brands */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#111827]">
            Invitations Received from Brands ({invites.length})
          </h3>

          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : invites.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center text-xs text-[#9CA3AF]">
              No pending brand invitations at the moment.
            </div>
          ) : (
            <div className="space-y-3">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white border border-amber-200 bg-amber-50/20 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#111827]">
                        {inv.campaign.company.name}
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        Offer: €{inv.fixedRate}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-[#374151]">
                      Campaign: {inv.campaign.title}
                    </h4>

                    {inv.pitchMessage && (
                      <p className="text-xs text-[#6B7280] italic bg-white p-3 rounded-xl border border-[#E5E7EB] max-w-xl">
                        &ldquo;{inv.pitchMessage}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      onClick={() => handleRespond(inv.id, 'DECLINED')}
                      disabled={processingId === inv.id}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleRespond(inv.id, 'ACCEPTED')}
                      disabled={processingId === inv.id}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {processingId === inv.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Accept &amp; Open Brief</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Applications Sent by Creator */}
        <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
          <h3 className="text-base font-bold text-[#111827]">
            Applications Sent by You ({myApplications.length})
          </h3>

          {myApplications.length === 0 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center text-xs text-[#9CA3AF]">
              You haven&apos;t sent any applications yet.{' '}
              <Link href="/dashboard/creator/marketplace" className="text-blue-600 font-bold underline">
                Browse open SaaS campaigns →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#111827]">
                        {app.campaign.company.name}
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        Requested: €{app.fixedRate}
                      </span>
                    </div>
                    <div className="text-xs text-[#6B7280] mt-0.5">{app.campaign.title}</div>
                  </div>

                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                    Pending Brand Review
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
