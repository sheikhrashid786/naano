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

  // Compute last 6 months dynamically
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const last6Months = useMemo(() => {
    const now = new Date();
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();

      // Sum earnings in this month from collabs
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
        statusClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
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
        statusClass: 'bg-amber-50 text-amber-700 border border-amber-200',
        invoiceUrl: null,
      }));
    }

    // invoices tab
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
      statusClass: 'bg-blue-50 text-blue-700 border border-blue-200',
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
        <Loader2 className="w-8 h-8 animate-spin text-[#2864EA]" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-20">
      {/* Sticky Top Header */}
      <Header
        balance={availableNow}
        user={{
          name: currentUser?.name,
          avatarUrl: currentUser?.avatarUrl || currentUser?.creator?.avatarUrl,
        }}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs border ${
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
            <button onClick={() => setToast(null)} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Heading & Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
              Earnings
            </h1>
            <p className="text-xs sm:text-[13px] text-[#64748B] mt-1.5 font-normal">
              Track revenue from your paid collaborations and withdraw available funds.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-[#2864EA]" />
            <span>Paid collaborations</span>
          </div>
        </div>

        {/* Top Row: 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total earned (with subtle sky clouds graphic) */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xs relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            {/* Background clouds texture */}
            <div className="absolute inset-0 bg-[url('/images/hero-clouds.jpg')] bg-cover bg-center opacity-20 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#111827]">
                <TrendingUp className="w-4 h-4 text-[#2864EA]" />
                <span>Total earned</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight mt-3">
                €{totalEarned}
              </div>
            </div>

            <div className="relative z-10 text-[11px] text-[#94A3B8] font-medium pt-3">
              {paidCollabsCount} paid collaborations · €{averageEarned} average
            </div>
          </div>

          {/* Card 2: In transit */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="w-6 h-6 flex items-center justify-start text-[#111827]">
                <ArrowRightLeft className="w-4 h-4 text-[#64748B]" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight mt-2">
                €{inTransit}
              </div>
              <div className="text-xs font-bold text-[#111827] mt-1.5">
                In transit
              </div>
            </div>

            <p className="text-[11px] text-[#94A3B8] leading-tight pt-2">
              International transfers usually arrive within 1–7 days, depending on the destination and banking network.
            </p>
          </div>

          {/* Card 3: Available now */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="w-6 h-6 flex items-center justify-start text-[#111827]">
                <Wallet className="w-4 h-4 text-[#64748B]" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight mt-2">
                €{availableNow}
              </div>
              <div className="text-xs font-bold text-[#111827] mt-1.5">
                Available now
              </div>
            </div>

            <p className="text-[11px] text-[#94A3B8] leading-tight pt-2">
              Ready to withdraw to your selected payout method.
            </p>
          </div>
        </div>

        {/* Lower Section: 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN: Earnings over time (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-6">
                <div>
                  <h2 className="text-base font-bold text-[#111827]">
                    Earnings over time
                  </h2>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Net collaboration earnings from the last six months.
                  </p>
                </div>
                <span className="text-xs font-medium text-[#94A3B8] shrink-0">
                  €{totalOver6Months} over 6 months
                </span>
              </div>

              {/* 6-Month Chart */}
              <div className="pt-4 pb-2">
                <div className="grid grid-cols-6 gap-3 sm:gap-4 items-end">
                  {last6Months.map((m, idx) => {
                    const heightPct =
                      m.amount > 0 ? Math.max(15, Math.round((m.amount / maxMonthAmount) * 100)) : 0;

                    return (
                      <div key={idx} className="flex flex-col items-center">
                        {/* Amount label on top */}
                        <span className="text-xs font-semibold text-[#64748B] mb-2">
                          €{m.amount}
                        </span>

                        {/* Tall Gray Container Column */}
                        <div className="w-full h-48 sm:h-52 bg-[#F1F5F9] rounded-2xl flex flex-col justify-end p-1 relative overflow-hidden">
                          {/* Filled bar if earnings exist */}
                          {heightPct > 0 && (
                            <div
                              className="w-full bg-[#2864EA]/20 rounded-xl mb-1 transition-all duration-500"
                              style={{ height: `${heightPct}%` }}
                            />
                          )}

                          {/* Solid Blue Baseline indicator matching reference */}
                          <div className="h-1.5 w-full rounded-full bg-[#2864EA]" />
                        </div>

                        {/* Month label below */}
                        <span
                          className={`text-xs mt-2.5 font-medium ${
                            m.isCurrent
                              ? 'text-[#2864EA] font-bold'
                              : 'text-[#64748B]'
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
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs flex flex-col justify-between">
            <div className="space-y-4">
              {/* Header */}
              <div>
                <h2 className="text-base font-bold text-[#111827]">
                  Withdraw earnings
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Choose where your available balance should be sent.
                </p>
              </div>

              <span className="text-[10px] font-black tracking-wider text-[#94A3B8] uppercase block pt-1">
                PAYOUT METHOD
              </span>

              {/* Method 1: Bank transfer */}
              <div
                onClick={() => setSelectedMethod('bank')}
                className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                  selectedMethod === 'bank'
                    ? 'border-[#2864EA] bg-[#F0F5FF]'
                    : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMethod === 'bank'
                        ? 'border-[#2864EA] bg-[#2864EA]'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'bank' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <Landmark className="w-4 h-4 text-[#111827]" />
                  <span className="text-xs sm:text-sm font-bold text-[#111827]">
                    Bank transfer
                  </span>
                </div>

                <div className="mt-2.5 pl-6 text-xs text-[#64748B] space-y-0.5">
                  <p className="font-medium text-[#64748B]">
                    {bankDetails.accountHolder || 'No account holder on file'}
                  </p>
                  <p className="text-[#94A3B8]">
                    {bankDetails.iban ? `IBAN: ${bankDetails.iban}` : 'No bank details on file'}
                  </p>
                </div>

                <div className="mt-3 pl-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBankModalOpen(true);
                    }}
                    className="px-3.5 py-1 text-xs font-semibold text-[#111827] bg-white border border-[#E2E8F0] hover:bg-slate-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Method 2: Stripe */}
              <div
                onClick={() => setSelectedMethod('stripe')}
                className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                  selectedMethod === 'stripe'
                    ? 'border-[#2864EA] bg-[#F0F5FF]'
                    : 'border-[#E2E8F0] bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedMethod === 'stripe'
                        ? 'border-[#2864EA] bg-[#2864EA]'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedMethod === 'stripe' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <CreditCard className="w-4 h-4 text-[#111827]" />
                  <span className="text-xs sm:text-sm font-bold text-[#111827]">
                    Stripe
                  </span>
                </div>

                <div className="mt-2.5 pl-6 text-xs text-[#64748B] space-y-0.5">
                  <p>
                    <span className="font-semibold text-[#64748B]">Status:</span>{' '}
                    <span
                      className={
                        stripeConnected
                          ? 'text-emerald-600 font-bold'
                          : 'text-[#64748B]'
                      }
                    >
                      {stripeConnected ? 'Connected' : 'Not connected'}
                    </span>
                  </p>
                  <p className="text-[#64748B]">
                    Instant transfer to your connected Stripe account.
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
                    className="px-4 py-1.5 text-xs font-bold text-[#111827] bg-white border border-[#E2E8F0] hover:bg-slate-50 rounded-xl shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? 'Updating...' : stripeConnected ? 'Disconnect Stripe' : 'Connect Stripe'}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Controls: Amount & Withdraw Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#94A3B8]">
                  €
                </span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Amount"
                  max={availableNow}
                  className="w-full pl-7 pr-3 py-2.5 text-xs font-bold text-[#111827] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#2864EA]"
                />
              </div>

              <button
                type="button"
                onClick={handleWithdraw}
                disabled={actionLoading || availableNow <= 0}
                className="px-5 py-2.5 bg-[#2864EA] hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                {actionLoading ? 'Processing...' : 'Withdraw all'}
              </button>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#111827]">
              Recent activity
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Collaboration earnings, withdrawals and invoices in one place.
            </p>
          </div>

          {/* 3 Tabs with active blue underline and count badges */}
          <div className="flex items-center gap-6 border-b border-[#E2E8F0] mt-6">
            <button
              type="button"
              onClick={() => setActiveActivityTab('earnings')}
              className={`pb-3 text-xs font-semibold relative transition-colors cursor-pointer ${
                activeActivityTab === 'earnings'
                  ? 'text-[#2864EA]'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <span>Earnings and withdrawals</span>
              {activeActivityTab === 'earnings' && (
                <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#2864EA] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveActivityTab('awaiting')}
              className={`pb-3 text-xs font-semibold relative flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeActivityTab === 'awaiting'
                  ? 'text-[#2864EA]'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <span>Awaiting release</span>
              <span className="w-5 h-5 rounded-full bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold flex items-center justify-center">
                {awaitingCollabs.length}
              </span>
              {activeActivityTab === 'awaiting' && (
                <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#2864EA] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveActivityTab('invoices')}
              className={`pb-3 text-xs font-semibold relative flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeActivityTab === 'invoices'
                  ? 'text-[#2864EA]'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              <span>Invoices</span>
              <span className="w-5 h-5 rounded-full bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold flex items-center justify-center">
                {paidCollabs.length}
              </span>
              {activeActivityTab === 'invoices' && (
                <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#2864EA] rounded-full" />
              )}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs mt-3">
              <thead>
                <tr className="border-b border-[#F1F5F9] text-[#64748B] text-xs font-medium">
                  <th className="py-3.5 px-4 font-medium">Date</th>
                  <th className="py-3.5 px-4 font-medium">Type</th>
                  <th className="py-3.5 px-4 font-medium">Detail</th>
                  <th className="py-3.5 px-4 font-medium">Amount</th>
                  <th className="py-3.5 px-4 font-medium">Status</th>
                  <th className="py-3.5 px-4 font-medium">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {currentActivityList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-xs text-[#64748B]">
                      No movements yet. Your first payment will appear here.
                    </td>
                  </tr>
                ) : (
                  currentActivityList.map((item: any, i: number) => (
                    <tr
                      key={i}
                      className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC]/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-[#64748B]">{item.date}</td>
                      <td className="py-3.5 px-4 font-medium text-[#111827]">{item.type}</td>
                      <td className="py-3.5 px-4 text-[#4B5563]">{item.detail}</td>
                      <td
                        className={`py-3.5 px-4 font-bold ${
                          item.isPositive ? 'text-emerald-600' : 'text-[#111827]'
                        }`}
                      >
                        {item.amount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${item.statusClass}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B]">
                        {item.invoiceUrl ? (
                          <a
                            href={item.invoiceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#2864EA] hover:underline font-semibold text-[11px]"
                          >
                            Download
                          </a>
                        ) : (
                          '—'
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#111827]">
                Bank Account Details
              </h3>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#64748B]">
              Enter your European or international bank account details for SEPA and wire payouts.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={bankDetails.accountHolder}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, accountHolder: e.target.value })
                  }
                  placeholder="e.g. Umar Draz"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#2864EA]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  IBAN / Account Number
                </label>
                <input
                  type="text"
                  value={bankDetails.iban}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, iban: e.target.value })
                  }
                  placeholder="e.g. FR76 3000 6000 0112 3456 7890 189"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#2864EA]"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBankModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsBankModalOpen(false);
                  setToast({ type: 'success', message: 'Bank details saved.' });
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#2864EA] hover:bg-blue-700 rounded-xl transition cursor-pointer"
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
