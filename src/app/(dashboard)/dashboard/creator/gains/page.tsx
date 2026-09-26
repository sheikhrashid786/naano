'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/dashboard/Header';
import {
  TrendingUp,
  ArrowRightLeft,
  Wallet,
  Landmark,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export default function CreatorEarningsPage() {
  const [data, setData] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'stripe'>('stripe');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [activeActivityTab, setActiveActivityTab] = useState<'earnings' | 'awaiting' | 'invoices'>('earnings');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Bank edit modal state
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountHolder: '',
    iban: '',
  });

  async function fetchData() {
    try {
      const [gainsRes, userRes] = await Promise.all([
        fetch('/api/creator/gains'),
        fetch('/api/auth/me'),
      ]);

      if (gainsRes.ok) {
        const json = await gainsRes.json();
        setData(json);
        if (json.availablePayout > 0) {
          setWithdrawAmount(json.availablePayout.toString());
        }
      }

      if (userRes.ok) {
        const uJson = await userRes.json();
        setCurrentUser(uJson.user);
      }
    } catch (e) {
      console.error('Failed to load earnings data', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const last6Months = useMemo(() => {
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();

      let earnedInMonth = 0;
      if (data?.collaborations) {
        data.collaborations.forEach((c: any) => {
          if (c.payment?.status === 'PAID' && c.payment.paidAt) {
            const pDate = new Date(c.payment.paidAt);
            if (pDate.getMonth() === mIdx && pDate.getFullYear() === yr) {
              earnedInMonth += c.fixedRate;
            }
          }
        });
      }

      result.push({
        label: monthNames[mIdx],
        isCurrent: i === 0,
        amount: earnedInMonth,
      });
    }
    return result;
  }, [data]);

  const maxMonthAmount = Math.max(...last6Months.map((m) => m.amount), 100);
  const totalOver6Months = last6Months.reduce((acc, m) => acc + m.amount, 0);

  const totalEarned = data?.totalEarned || 0;
  const inTransit = data?.pendingInEscrow || 0;
  const availableNow = data?.availablePayout || 0;
  const stripeConnected = data?.stripeConnected ?? false;

  const paidCollabsCount =
    data?.collaborations?.filter((c: any) => c.payment?.status === 'PAID').length || 0;
  const averageEarned =
    paidCollabsCount > 0 ? Math.round(totalEarned / paidCollabsCount) : 0;

  const awaitingCollabs = useMemo(() => {
    if (!data?.collaborations) return [];
    return data.collaborations.filter(
      (c: any) =>
        ['ACCEPTED', 'CONTENT_SUBMITTED', 'APPROVED'].includes(c.status) &&
        c.payment?.status !== 'PAID'
    );
  }, [data]);

  const paidCollabs = useMemo(() => {
    if (!data?.collaborations) return [];
    return data.collaborations.filter((c: any) => c.payment?.status === 'PAID');
  }, [data]);

  const currentActivityList = useMemo(() => {
    if (activeActivityTab === 'earnings') {
      return paidCollabs.map((c: any) => ({
        date: new Date(c.payment?.paidAt || c.updatedAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        type: 'Collaboration payout',
        detail: `${c.campaign?.company?.name || 'Brand'} · ${c.campaign?.title || 'LinkedIn Post'}`,
        amount: `+€${c.fixedRate}`,
        isPositive: true,
        status: 'Paid',
        statusClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
        invoiceUrl: `/api/invoices/${c.payment?.id || c.id}`,
      }));
    }

    if (activeActivityTab === 'awaiting') {
      return awaitingCollabs.map((c: any) => ({
        date: new Date(c.createdAt).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        type: 'Escrow lock',
        detail: `${c.campaign?.company?.name || 'Brand'} · ${c.campaign?.title || 'LinkedIn Post'}`,
        amount: `€${c.fixedRate}`,
        isPositive: false,
        status: 'In escrow',
        statusClass: 'bg-amber-50 text-amber-700 border border-amber-200/60',
        invoiceUrl: null,
      }));
    }

    return paidCollabs.map((c: any) => ({
      date: new Date(c.payment?.paidAt || c.updatedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      type: 'Tax invoice',
      detail: `Invoice #${c.payment?.stripePayoutId || c.id.slice(0, 8)} · ${c.campaign?.company?.name || 'Brand'}`,
      amount: `€${c.fixedRate}`,
      isPositive: false,
      status: 'Issued',
      statusClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
      invoiceUrl: `/api/invoices/${c.payment?.id || c.id}`,
    }));
  }, [activeActivityTab, paidCollabs, awaitingCollabs]);

  async function handleToggleStripe() {
    setActionLoading(true);
    try {
      const res = await fetch('/api/creator/gains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_STRIPE' }),
      });
      if (res.ok) {
        await fetchData();
        setToast({
          type: 'success',
          message: stripeConnected
            ? 'Stripe account disconnected.'
            : 'Stripe account connected successfully!',
        });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'Failed to update Stripe status.' });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleWithdraw() {
    if (availableNow <= 0) {
      setToast({ type: 'error', message: 'No available funds to withdraw.' });
      return;
    }
    if (selectedMethod === 'stripe' && !stripeConnected) {
      setToast({
        type: 'error',
        message: 'Please connect your Stripe account before withdrawing.',
      });
      return;
    }
    if (selectedMethod === 'bank' && !bankDetails.iban) {
      setToast({
        type: 'error',
        message: 'Please provide your bank details before initiating a bank transfer.',
      });
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/creator/gains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'WITHDRAW',
          method: selectedMethod,
          amount: withdrawAmount || availableNow,
        }),
      });

      if (res.ok) {
        setToast({
          type: 'success',
          message: `Payout of €${withdrawAmount || availableNow} initiated! Funds will arrive in 1–2 business days.`,
        });
        await fetchData();
      } else {
        setToast({ type: 'error', message: 'Failed to process payout.' });
      }
    } catch (e) {
      setToast({ type: 'error', message: 'An unexpected error occurred.' });
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 font-sans">
      <Header
        balance={availableNow}
        user={{
          name: currentUser?.name,
          avatarUrl: currentUser?.avatarUrl || currentUser?.creator?.avatarUrl,
        }}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs border animate-in fade-in ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{toast.message}</span>
            </div>
            <button onClick={() => setToast(null)} className="cursor-pointer text-slate-500 hover:text-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Heading & Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                <Wallet className="w-3 h-3 text-indigo-400" />
                <span>Earnings &amp; Payouts</span>
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Stripe Connect Vault Payouts
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight">
              Creator Earnings &amp; Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
              Track settled collaboration revenues, monitor milestones in transit, and withdraw to Stripe or SEPA.
            </p>
          </div>
        </div>

        {/* Top Row: 3 Forecaster Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total earned */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] border-l-4 border-l-indigo-600 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
                <span>Total Earned</span>
                <TrendingUp className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono tracking-tight mt-3">
                €{totalEarned.toLocaleString()}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-medium pt-3 border-t border-slate-100">
              {paidCollabsCount} paid collaborations · €{averageEarned} avg/post
            </div>
          </div>

          {/* Card 2: In transit */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] border-l-4 border-l-amber-500 flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
                <span>Held in Escrow</span>
                <ArrowRightLeft className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-amber-600 font-mono tracking-tight mt-3">
                €{inTransit.toLocaleString()}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight pt-3 border-t border-slate-100 font-medium">
              Funds locked in buyer escrow. Releases immediately upon post approval.
            </p>
          </div>

          {/* Card 3: Available now */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] border-l-4 border-l-emerald-500 flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
                <span>Available Balance</span>
                <Wallet className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 font-mono tracking-tight mt-3">
                €{availableNow.toLocaleString()}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight pt-3 border-t border-slate-100 font-medium">
              Settled balance ready to withdraw to your linked destination.
            </p>
          </div>
        </div>

        {/* Lower Section: 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN: Earnings over time (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Earnings Over Time
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Net monthly collaboration revenue over the last six months.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full shrink-0">
                  €{totalOver6Months.toLocaleString()} (6-mo total)
                </span>
              </div>

              {/* 6-Month Chart */}
              <div className="pt-6 pb-2">
                <div className="grid grid-cols-6 gap-3 sm:gap-4 items-end">
                  {last6Months.map((m, idx) => {
                    const heightPct =
                      m.amount > 0 ? Math.max(15, Math.round((m.amount / maxMonthAmount) * 100)) : 0;

                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="text-xs font-mono font-bold text-slate-700 mb-2">
                          €{m.amount}
                        </span>

                        <div className="w-full h-48 sm:h-52 bg-slate-50 rounded-2xl flex flex-col justify-end p-1 relative overflow-hidden border border-slate-200/60">
                          {heightPct > 0 && (
                            <div
                              className="w-full bg-indigo-600/30 rounded-xl mb-1 transition-all duration-500"
                              style={{ height: `${heightPct}%` }}
                            />
                          )}

                          <div className="h-1.5 w-full rounded-full bg-indigo-600" />
                        </div>

                        <span
                          className={`text-xs mt-2.5 font-medium ${
                            m.isCurrent
                              ? 'text-indigo-600 font-black'
                              : 'text-slate-500'
                          }`}
                        >
                          {m.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Withdraw earnings (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  Withdraw Balance
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select destination and initiate payout to your bank or Stripe.
                </p>
              </div>

              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block pt-1 font-mono">
                PAYOUT DESTINATION
              </span>

              {/* Method 1: Stripe */}
              <div
                onClick={() => setSelectedMethod('stripe')}
                className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                  selectedMethod === 'stripe'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMethod === 'stripe'
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'stripe' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Stripe Connect
                  </span>
                </div>

                <div className="mt-2.5 pl-6 text-xs text-slate-500 space-y-0.5">
                  <p>
                    <span className="font-semibold text-slate-700">Status:</span>{' '}
                    <span className={stripeConnected ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                      {stripeConnected ? 'Connected & Verified' : 'Not Connected'}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Instant or next-day transfer to your linked Stripe account.
                  </p>
                </div>

                <div className="mt-3 pl-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStripe();
                    }}
                    disabled={actionLoading}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? 'Updating...' : stripeConnected ? 'Disconnect Stripe' : 'Connect Stripe'}
                  </button>
                </div>
              </div>

              {/* Method 2: Bank transfer */}
              <div
                onClick={() => setSelectedMethod('bank')}
                className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                  selectedMethod === 'bank'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMethod === 'bank'
                        ? 'border-indigo-600 bg-indigo-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'bank' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <Landmark className="w-4 h-4 text-slate-700" />
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    SEPA Bank Wire
                  </span>
                </div>

                <div className="mt-2.5 pl-6 text-xs text-slate-500 space-y-0.5">
                  <p className="font-medium text-slate-700">
                    {bankDetails.accountHolder || 'No account holder recorded'}
                  </p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    {bankDetails.iban ? `IBAN: ${bankDetails.iban}` : 'No IBAN on file'}
                  </p>
                </div>

                <div className="mt-3 pl-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBankModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors cursor-pointer"
                  >
                    Edit Bank Details
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Controls: Amount & Withdraw Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  €
                </span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Amount"
                  max={availableNow}
                  className="w-full pl-8 pr-3 py-2.5 text-xs font-mono font-bold text-slate-900 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={handleWithdraw}
                disabled={actionLoading || availableNow <= 0}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 active:scale-95"
              >
                {actionLoading ? 'Processing...' : 'Withdraw All'}
              </button>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              Vault Activity &amp; Invoices
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Collaboration earnings, withdrawals and tax invoices in one audit ledger.
            </p>
          </div>

          {/* 3 Tabs with Forecaster styling */}
          <div className="bg-white border border-slate-200/90 p-1.5 rounded-2xl shadow-2xs inline-flex items-center gap-1.5 mt-6">
            <button
              type="button"
              onClick={() => setActiveActivityTab('earnings')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeActivityTab === 'earnings'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Earnings &amp; Payouts</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveActivityTab('awaiting')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeActivityTab === 'awaiting'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Awaiting Escrow Release</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${activeActivityTab === 'awaiting' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {awaitingCollabs.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveActivityTab('invoices')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeActivityTab === 'invoices'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Tax Invoices</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${activeActivityTab === 'invoices' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {paidCollabs.length}
              </span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-4 px-5">Date</th>
                  <th className="py-4 px-5">Movement Type</th>
                  <th className="py-4 px-5">Campaign / Brand</th>
                  <th className="py-4 px-5">Amount</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {currentActivityList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400">
                      No movements found in this category.
                    </td>
                  </tr>
                ) : (
                  currentActivityList.map((item: any, i: number) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-4 px-5 text-slate-500 font-mono text-[11px]">{item.date}</td>
                      <td className="py-4 px-5 font-bold text-slate-900">{item.type}</td>
                      <td className="py-4 px-5 text-slate-600">{item.detail}</td>
                      <td
                        className={`py-4 px-5 font-black font-mono text-sm ${
                          item.isPositive ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {item.amount}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${item.statusClass}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        {item.invoiceUrl ? (
                          <a
                            href={item.invoiceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline font-bold text-[11px]"
                          >
                            Download PDF
                          </a>
                        ) : (
                          <span className="text-slate-300">—</span>
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

      {/* Bank Details Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider block">
                  Wire Details
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  Bank Account Information
                </h3>
              </div>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your verified European or international bank account details for SEPA and wire payouts.
            </p>

            <div className="space-y-4 pt-1 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={bankDetails.accountHolder}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, accountHolder: e.target.value })
                  }
                  placeholder="e.g. Umar Draz"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  IBAN / Account Number
                </label>
                <input
                  type="text"
                  value={bankDetails.iban}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, iban: e.target.value })
                  }
                  placeholder="e.g. FR76 3000 6000 0112 3456 7890 189"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsBankModalOpen(false);
                  setToast({ type: 'success', message: 'Bank details saved.' });
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition cursor-pointer"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
