'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/dashboard/Header';
import {
  Store,
  Search,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Layers,
  FileText,
  DollarSign,
  X,
  Target,
  Sparkles,
} from 'lucide-react';

interface Props {
  initialUser: {
    name: string;
    email: string;
  };
  campaigns: any[];
}

export default function AdminCampaignsClient({ initialUser, campaigns: initialCampaigns }: Props) {
  const [campaignsList, setCampaignsList] = useState<any[]>(initialCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedBrief, setSelectedBrief] = useState<any | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const filteredCampaigns = useMemo(() => {
    return campaignsList.filter((camp) => {
      const matchesStatus = selectedStatus === 'ALL' || camp.status === selectedStatus;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        camp.title.toLowerCase().includes(query) ||
        camp.company?.name.toLowerCase().includes(query) ||
        camp.objective.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [campaignsList, selectedStatus, searchQuery]);

  async function handleStatusChange(campaignId: string, newStatus: string) {
    setLoadingId(campaignId);
    try {
      const res = await fetch(`/api/admin/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update campaign status');

      setCampaignsList((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, status: newStatus } : c))
      );
      showToast(`Campaign status updated to ${newStatus}`);
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
                <span>Operations Moderation</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {campaignsList.length} Total Campaigns in System
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight">
              Campaigns &amp; Creative Briefs
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Inspect creative guidelines, adjust budget caps, and override operational statuses across all active B2B campaigns.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 overflow-x-auto max-w-full">
            {['ALL', 'ACTIVE', 'PAUSED', 'COMPLETED', 'DRAFT', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{st === 'ALL' ? 'All Statuses' : st}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${selectedStatus === st ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {st === 'ALL' ? campaignsList.length : campaignsList.filter((c) => c.status === st).length}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, company, or objective..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-4 px-6">Campaign Title</th>
                  <th className="py-4 px-6">Brand / Company</th>
                  <th className="py-4 px-6">Budget per Post</th>
                  <th className="py-4 px-6">Deliverables Pool</th>
                  <th className="py-4 px-6">Status Override</th>
                  <th className="py-4 px-6 text-right">Creative Brief</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <Store className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      No campaigns match your filter.
                    </td>
                  </tr>
                ) : (
                  filteredCampaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Campaign Title */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">{camp.title}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <Target className="w-3 h-3 text-indigo-500" />
                          <span>Objective: {camp.objective}</span>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">{camp.company?.name || 'Brand'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{camp.company?.industry || 'B2B'}</div>
                      </td>

                      {/* Budget */}
                      <td className="py-4 px-6">
                        <div className="font-black text-slate-900 font-mono text-sm">
                          €{camp.budgetPerPost}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">Fixed creator rate</div>
                      </td>

                      {/* Deliverables Pool */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{camp.collaborations?.length || 0} creators</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Target: {camp.targetAudience || 'B2B Software Leaders'}
                        </div>
                      </td>

                      {/* Status Override */}
                      <td className="py-4 px-6">
                        <select
                          value={camp.status}
                          disabled={loadingId === camp.id}
                          onChange={(e) => handleStatusChange(camp.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-indigo-600 cursor-pointer disabled:opacity-50"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="PAUSED">PAUSED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="DRAFT">DRAFT</option>
                        </select>
                      </td>

                      {/* Brief Modal Trigger */}
                      <td className="py-4 px-6 text-right">
                        {camp.brief ? (
                          <button
                            type="button"
                            onClick={() => setSelectedBrief({ ...camp.brief, title: camp.title, company: camp.company?.name })}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View Brief</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No brief attached</span>
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

      {/* Brief Inspector Modal */}
      {selectedBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
            <button
              onClick={() => setSelectedBrief(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                {selectedBrief.company || 'Campaign Brief'}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                {selectedBrief.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Campaign Brief &amp; Messaging Guidelines</p>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1 font-mono">
                  1. Creative Angle &amp; Core Thesis
                </h4>
                <p className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 leading-relaxed">
                  {selectedBrief.angle || 'Standard thought leadership alignment.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1 font-mono">
                  2. Suggested LinkedIn Hook Examples
                </h4>
                <p className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 leading-relaxed font-mono text-slate-800">
                  {selectedBrief.suggestedHooks || 'No hooks specified.'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1 font-mono">
                  3. Key Talking Points
                </h4>
                <p className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedBrief.keyTalkingPoints || 'Standard feature highlights and social proof.'}
                </p>
              </div>

              {selectedBrief.dosAndDonts && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1 font-mono">
                    4. Dos and Don&apos;ts
                  </h4>
                  <p className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 leading-relaxed">
                    {selectedBrief.dosAndDonts}
                  </p>
                </div>
              )}

              {selectedBrief.trackingUrl && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1 font-mono">
                    5. Tracked Campaign URL
                  </h4>
                  <p className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-700 font-mono select-all">
                    {selectedBrief.trackingUrl}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBrief(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-all"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
