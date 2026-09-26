'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/dashboard/Header';
import {
  Layers,
  Search,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  DollarSign,
  FileCheck,
  Eye,
  AlertCircle,
} from 'lucide-react';

interface Props {
  initialUser: {
    name: string;
    email: string;
  };
  collaborations: any[];
}

export default function AdminCollabsClient({ initialUser, collaborations: initialCollabs }: Props) {
  const [collabsList, setCollabsList] = useState<any[]>(initialCollabs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const statuses = [
    'ALL',
    'INVITED',
    'APPLIED',
    'ACCEPTED',
    'IN_PROGRESS',
    'CONTENT_SUBMITTED',
    'APPROVED',
    'COMPLETED',
    'CANCELLED',
  ];

  const filteredCollabs = useMemo(() => {
    return collabsList.filter((collab) => {
      const matchesStatus = selectedStatus === 'ALL' || collab.status === selectedStatus;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        collab.creator?.user?.name.toLowerCase().includes(query) ||
        collab.company?.name.toLowerCase().includes(query) ||
        collab.campaign?.title.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [collabsList, selectedStatus, searchQuery]);

  async function handleStatusChange(collabId: string, newStatus: string) {
    setLoadingId(collabId);
    try {
      const res = await fetch(`/api/admin/collabs/${collabId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update collaboration status');

      setCollabsList((prev) =>
        prev.map((c) => (c.id === collabId ? { ...c, status: newStatus } : c))
      );
      showToast(`Collaboration deliverable marked as ${newStatus}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative font-sans">
      <Header
        balance={0}
        user={{
          name: initialUser.name,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        }}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span>Deliverable QA</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {collabsList.length} Total Deliverables in System
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight">
              Collaborations &amp; Proofs QA
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Review live submitted post links, approve milestones, and mediate deliverable agreements between brands and creators.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 overflow-x-auto max-w-full">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{st === 'ALL' ? 'All Stages' : st.replace('_', ' ')}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${selectedStatus === st ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {st === 'ALL' ? collabsList.length : collabsList.filter((c) => c.status === st).length}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search creator, brand, or campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Collaborations Table */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-4 px-6">Creator</th>
                  <th className="py-4 px-6">Brand &amp; Campaign</th>
                  <th className="py-4 px-6">Fixed Rate</th>
                  <th className="py-4 px-6">Post Submission / Proof</th>
                  <th className="py-4 px-6">Stage Override</th>
                  <th className="py-4 px-6 text-right">Escrow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCollabs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      No collaborations found in this status.
                    </td>
                  </tr>
                ) : (
                  filteredCollabs.map((collab) => (
                    <tr key={collab.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Creator */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={collab.creator?.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                            alt={collab.creator?.user?.name}
                            className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{collab.creator?.user?.name}</div>
                            <div className="text-slate-400 text-[11px] font-mono">{collab.creator?.user?.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Brand & Campaign */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">{collab.company?.name || 'Brand'}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{collab.campaign?.title}</div>
                      </td>

                      {/* Rate */}
                      <td className="py-4 px-6">
                        <div className="font-black text-slate-900 font-mono text-sm">
                          €{collab.fixedRate}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">Escrow allocated</div>
                      </td>

                      {/* Post Submission Proof */}
                      <td className="py-4 px-6">
                        {collab.submittedPostUrl ? (
                          <a
                            href={collab.submittedPostUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Live Proof</span>
                          </a>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No deliverable link yet</span>
                        )}
                        {collab.postProofText && (
                          <div className="text-[11px] text-slate-600 mt-1 line-clamp-1 italic">
                            &quot;{collab.postProofText}&quot;
                          </div>
                        )}
                      </td>

                      {/* Stage Override */}
                      <td className="py-4 px-6">
                        <select
                          value={collab.status}
                          disabled={loadingId === collab.id}
                          onChange={(e) => handleStatusChange(collab.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-indigo-600 cursor-pointer disabled:opacity-50"
                        >
                          {statuses.filter((s) => s !== 'ALL').map((s) => (
                            <option key={s} value={s}>
                              {s.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Escrow Status */}
                      <td className="py-4 px-6 text-right">
                        {collab.payment ? (
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                              collab.payment.status === 'PAID'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                collab.payment.status === 'PAID' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            />
                            <span>€{collab.payment.amount} ({collab.payment.status})</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No payment object</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
