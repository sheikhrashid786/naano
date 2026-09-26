'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/dashboard/Header';
import {
  CreditCard,
  Search,
  CheckCircle2,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface Props {
  initialUser: {
    name: string;
    email: string;
  };
  payments: any[];
  stats: {
    totalGMV: number;
    paidAmount: number;
    pendingAmount: number;
    estimatedFees: number;
  };
}

export default function AdminFinancesClient({
  initialUser,
  payments: initialPayments,
  stats,
}: Props) {
  const [paymentsList, setPaymentsList] = useState<any[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const filteredPayments = useMemo(() => {
    return paymentsList.filter((p) => {
      const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        (p.collaboration?.creator?.user?.name && p.collaboration.creator.user.name.toLowerCase().includes(query)) ||
        (p.collaboration?.company?.name && p.collaboration.company.name.toLowerCase().includes(query)) ||
        (p.stripePayoutId && p.stripePayoutId.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [paymentsList, selectedStatus, searchQuery]);

  async function handleReleasePayout(paymentId: string) {
    if (!confirm('Are you sure you want to release this escrow payout to the creator?')) return;

    setLoadingId(paymentId);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'PAID',
          stripePayoutId: `po_demo_${Math.random().toString(36).substring(2, 9)}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to release payout');

      setPaymentsList((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: 'PAID', paidAt: new Date().toISOString() } : p))
      );
      showToast('Escrow funds successfully released to creator');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative font-sans">
      <Header
        balance={stats.totalGMV}
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
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Super Admin Escrow Controller</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Stripe Connected Vault Infrastructure
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight">
              Escrow Payouts &amp; Platform GMV
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Inspect brand deposits, audit platform commission margins, and authorize verified deliverable payouts.
            </p>
          </div>
        </div>

        {/* 4 Top Forecaster Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* GMV */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] border-l-4 border-l-emerald-600">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
              <span>Total Volume (GMV)</span>
              <DollarSign className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2 font-mono">
              €{stats.totalGMV.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Across all brand briefs</div>
          </div>

          {/* Paid Out */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] border-l-4 border-l-emerald-500">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
              <span>Released to Creators</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight mt-2 font-mono">
              €{stats.paidAmount.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Delivered &amp; verified live</div>
          </div>

          {/* Pending Escrow */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] border-l-4 border-l-amber-500">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
              <span>Held in Escrow</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight mt-2 font-mono">
              €{stats.pendingAmount.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Awaiting post verification</div>
          </div>

          {/* Platform Revenue */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] border-l-4 border-l-teal-500">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
              <span>Platform Take Rate (15%)</span>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-teal-700 tracking-tight mt-2 font-mono">
              €{stats.estimatedFees.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-medium">Net platform revenue margin</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 overflow-x-auto max-w-full">
            {['ALL', 'PENDING', 'PROCESSING', 'PAID', 'FAILED'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatus === st
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{st === 'ALL' ? 'All Transactions' : st}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${selectedStatus === st ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {st === 'ALL' ? paymentsList.length : paymentsList.filter((p) => p.status === st).length}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search creator, brand, or stripe ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-4 px-6">Transaction / Creator</th>
                  <th className="py-4 px-6">Funded Brand</th>
                  <th className="py-4 px-6">Milestone Escrow</th>
                  <th className="py-4 px-6">Stripe Reference</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Escrow Authorization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      No payment records match your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Creator */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900 text-sm">
                          {p.collaboration?.creator?.user?.name || 'Creator'}
                        </div>
                        <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                          Brief: {p.collaboration?.campaign?.title || 'B2B Campaign'}
                        </div>
                      </td>

                      {/* Funded by */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">
                          {p.collaboration?.company?.name || 'Brand Company'}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">Secured Escrow</div>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6">
                        <div className="font-black text-slate-900 font-mono text-sm">
                          €{p.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">{p.currency || 'EUR'}</span>
                        </div>
                      </td>

                      {/* Stripe Payout ID */}
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/60">
                          {p.stripePayoutId || 'escrow_hold'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                            p.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : p.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.status === 'PAID' ? 'bg-emerald-500' : p.status === 'PENDING' ? 'bg-amber-500' : 'bg-slate-400'
                            }`}
                          />
                          <span>{p.status}</span>
                        </span>
                      </td>

                      {/* Escrow Release Button */}
                      <td className="py-4 px-6 text-right">
                        {p.status !== 'PAID' ? (
                          <button
                            type="button"
                            disabled={loadingId === p.id}
                            onClick={() => handleReleasePayout(p.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                          >
                            <span>Authorize Release</span>
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold text-xs inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Released</span>
                          </span>
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
