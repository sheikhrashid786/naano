'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import {
  HelpCircle,
  Plus,
  ArrowRight,
  CheckCircle2,
  X,
  CreditCard,
  Download,
  Receipt,
  FileText,
  Loader2,
  Building2,
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  reference: string;
  date: string;
  type: 'Top-up' | 'Booking';
  amount: number;
  status: 'Completed' | 'Pending' | 'Paid';
  receiptUrl?: string | null;
}

export default function CompanyBillingPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab filter: 'All' | 'Top-ups' | 'Bookings'
  const [activeTab, setActiveTab] = useState<'all' | 'topups' | 'bookings'>('all');

  // Add Budget Modal
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('2500');
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Need Help Modal
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Fetch current user & company
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch collaborations to dynamically create booking invoices if completed
  useEffect(() => {
    setLoading(true);
    fetch('/api/collaborations')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.collaborations) {
          const bookingInvoices: InvoiceItem[] = data.collaborations
            .filter((c: any) => c.status === 'COMPLETED' || c.status === 'APPROVED')
            .map((c: any, index: number) => ({
              id: c.id,
              reference: `INV-BKG-${c.id.slice(-6).toUpperCase()}`,
              date: c.updatedAt || c.createdAt,
              type: 'Booking',
              amount: -(c.payment?.amount || c.campaign?.budgetPerPost || 0),
              status: 'Paid',
            }));
          setInvoices(bookingInvoices);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Handle Add Budget submission
  async function handleAddBudget(e: React.FormEvent) {
    e.preventDefault();
    const amountNum = parseFloat(topUpAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setIsProcessingTopUp(true);
    setTimeout(() => {
      setWalletBalance((prev) => prev + amountNum);
      const newInvoice: InvoiceItem = {
        id: `topup-${Date.now()}`,
        reference: `INV-TOP-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString(),
        type: 'Top-up',
        amount: amountNum,
        status: 'Completed',
      };
      setInvoices((prev) => [newInvoice, ...prev]);
      setIsProcessingTopUp(false);
      setIsTopUpModalOpen(false);
      setSuccessToast(`Successfully added €${amountNum.toLocaleString()} to your budget.`);
      setTimeout(() => setSuccessToast(''), 4000);
    }, 800);
  }

  // Filter invoices by tab
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (activeTab === 'topups') return inv.type === 'Top-up';
      if (activeTab === 'bookings') return inv.type === 'Booking';
      return true;
    });
  }, [invoices, activeTab]);

  // Format date helper
  function formatDate(dateStr: string) {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative">
      <Header balance={walletBalance} user={currentUser} />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        {/* Toast Notification */}
        {successToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between animate-in fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')}>
              <X className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. TITLE & SUBTITLE ROW (Matches Reference Screenshot)                     */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
              Billing
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your budget, plan and invoices.
            </p>
          </div>

          {/* Need help? Button */}
          <button
            type="button"
            onClick={() => setIsHelpModalOpen(true)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>Need help?</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. AVAILABLE BALANCE CARD (Matches Reference Screenshot)                   */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xs p-6 sm:p-7 relative">
          {/* Top-Right Euro Blue Icon */}
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-base flex items-center justify-center absolute right-6 top-6 shadow-2xs">
            €
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            AVAILABLE BALANCE
          </span>

          <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2">
            €{walletBalance.toFixed(2)}
          </div>

          <p className="text-xs text-slate-500 mt-1.5 font-normal">
            Ready to spend across your campaigns.
          </p>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <button
              type="button"
              onClick={() => {
                setTopUpAmount('2500');
                setIsTopUpModalOpen(true);
              }}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              Add budget
            </button>

            <button
              type="button"
              onClick={() => {
                setTopUpAmount('2500');
                setIsTopUpModalOpen(true);
              }}
              className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              + €2,500
            </button>

            <button
              type="button"
              onClick={() => {
                setTopUpAmount('10000');
                setIsTopUpModalOpen(true);
              }}
              className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              + €10,000
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. INVOICES CARD (Matches Reference Screenshot)                           */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xs p-6 sm:p-7 overflow-hidden">
          <h2 className="text-base font-bold text-[#0F172A]">Invoices</h2>

          {/* Sub-Tabs: All, Top-ups, Bookings */}
          <div className="border-b border-slate-100 flex items-center gap-6 mt-4 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`pb-2.5 transition-colors relative cursor-pointer ${
                activeTab === 'all'
                  ? 'text-[#2563EB] font-bold'
                  : 'text-slate-500 hover:text-[#0F172A] font-medium'
              }`}
            >
              <span>All</span>
              {activeTab === 'all' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('topups')}
              className={`pb-2.5 transition-colors relative cursor-pointer ${
                activeTab === 'topups'
                  ? 'text-[#2563EB] font-bold'
                  : 'text-slate-500 hover:text-[#0F172A] font-medium'
              }`}
            >
              <span>Top-ups</span>
              {activeTab === 'topups' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`pb-2.5 transition-colors relative cursor-pointer ${
                activeTab === 'bookings'
                  ? 'text-[#2563EB] font-bold'
                  : 'text-slate-500 hover:text-[#0F172A] font-medium'
              }`}
            >
              <span>Bookings</span>
              {activeTab === 'bookings' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
              )}
            </button>
          </div>

          {/* Table Header */}
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                  <th className="py-3 px-2">Reference</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Type</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>

              {/* Table Content */}
              <tbody className="divide-y divide-slate-100 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin text-[#2563EB] mx-auto mb-1" />
                      Loading invoices...
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  /* Exact Empty State from Screenshot */
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-xs text-slate-400 font-normal"
                    >
                      No invoices or entries yet.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-[#0F172A]">
                        {inv.reference}
                      </td>
                      <td className="py-3.5 px-2 text-slate-600 font-medium">
                        {formatDate(inv.date)}
                      </td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            inv.type === 'Top-up'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-[#2563EB]'
                          }`}
                        >
                          {inv.type}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-2 font-bold ${
                          inv.amount > 0 ? 'text-emerald-600' : 'text-slate-800'
                        }`}
                      >
                        {inv.amount > 0 ? `+€${inv.amount.toLocaleString()}` : `-€${Math.abs(inv.amount).toLocaleString()}`}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{inv.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button
                          type="button"
                          onClick={() => alert(`Receipt ${inv.reference} downloaded.`)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                          title="Download receipt"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* ADD BUDGET MODAL                                                          */}
      {/* ========================================================================= */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#2563EB] tracking-wider block">
                  Top Up Wallet
                </span>
                <h3 className="text-base font-bold text-[#0F172A] mt-0.5">
                  Add budget for campaigns
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTopUpModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBudget} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#0F172A] block mb-1.5">
                  Select or enter amount (EUR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                    €
                  </span>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-[#0F172A] focus:bg-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {['1000', '2500', '10000'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      topUpAmount === amt
                        ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    €{parseInt(amt).toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <label className="font-bold text-[#0F172A] block mb-1.5">
                  Payment Method
                </label>
                <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-[#2563EB]" />
                    <span className="font-bold text-slate-700 text-xs">
                      Credit / Debit Card (Stripe)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Instant
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTopUpModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingTopUp || !topUpAmount}
                  className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessingTopUp ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Confirm Top-up</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NEED HELP MODAL                                                           */}
      {/* ========================================================================= */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0F172A]">Billing Support</h3>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                <span className="font-bold text-[#0F172A] block mb-1">
                  How does budget allocation work?
                </span>
                <p className="leading-relaxed">
                  Funds added to your balance remain safely in your account. When you book a creator, the campaign amount is committed and only released once you approve their submitted post draft.
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                <span className="font-bold text-[#0F172A] block mb-1">
                  VAT &amp; Company Invoices
                </span>
                <p className="leading-relaxed">
                  All top-up transactions automatically generate compliant PDF tax receipts with your company details.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/dashboard/company/messages"
                className="text-xs font-bold text-[#2563EB] hover:underline"
              >
                Ask NaanoBot in Chat &rarr;
              </Link>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="px-4 py-2 bg-[#111827] text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
