'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import { 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  ArrowUpRight, 
  Download, 
  Loader2, 
  ExternalLink 
} from 'lucide-react';

export default function CreatorGainsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadGains() {
    try {
      const res = await fetch('/api/creator/gains');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGains();
  }, []);

  async function handleToggleStripe() {
    setActionLoading(true);
    try {
      const res = await fetch('/api/creator/gains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'TOGGLE_STRIPE' }),
      });
      if (res.ok) {
        await loadGains();
      }
    } catch (e) {
    } finally {
      setActionLoading(false);
    }
  }

  async function handleWithdraw() {
    setActionLoading(true);
    try {
      const res = await fetch('/api/creator/gains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'WITHDRAW' }),
      });
      if (res.ok) {
        setMessage('Payout initiated! Funds will arrive in your bank account in 1-2 business days.');
        await loadGains();
      }
    } catch (e) {
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Gains & Payouts"
        subtitle="Track your LinkedIn sponsorship revenue, escrow balances, and Stripe Connect payouts."
      />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="underline text-xs cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Top 4 Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B7280]">Available for Payout</span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#111827] mt-3">
              €{data?.availablePayout || 0}
            </div>
            <div className="mt-3">
              <button
                onClick={handleWithdraw}
                disabled={actionLoading || (data?.availablePayout || 0) === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                {actionLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Withdraw to Bank
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B7280]">Locked in Escrow</span>
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#111827] mt-3">
              €{data?.pendingInEscrow || 0}
            </div>
            <p className="text-[11px] text-[#6B7280] mt-2">
              Secured from SaaS brands, releases upon post approval.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B7280]">Lifetime Earnings</span>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#111827] mt-3">
              €{data?.totalEarned || 0}
            </div>
            <p className="text-[11px] text-[#6B7280] mt-2">
              Total gross revenue generated on Naano.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B7280]">Base Rate Per Post</span>
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#111827] mt-3">
              €{data?.pricePerPost || 650}
            </div>
            <p className="text-[11px] text-[#6B7280] mt-2">
              Configured in your creator profile settings.
            </p>
          </div>
        </div>

        {/* Stripe Connect & Escrow Protection Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                Naano Escrow Guarantee
              </div>
              <h3 className="text-lg font-bold">You Never Write Unpaid</h3>
              <p className="text-xs text-gray-300 mt-2 leading-relaxed max-w-xl">
                Before any collaboration commences, Naano automatically locks 100% of the campaign funds into a segregated European escrow account. When you submit your post proof and the brand approves, the funds are instantly released directly to you.
              </p>
            </div>
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-700/60 text-xs text-gray-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Payment Delays
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 0% Creator Commission
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Direct SEPA / IBAN
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6B7280]">Payout Method</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  data?.stripeConnected ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {data?.stripeConnected ? 'Connected' : 'Action Required'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center">
                  S
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">Stripe Connect</h4>
                  <p className="text-[11px] text-[#6B7280]">Direct bank transfers via SEPA</p>
                </div>
              </div>
              <p className="text-xs text-[#4B5563] mt-3">
                {data?.stripeConnected 
                  ? 'Your bank account ending in •••• 4242 is verified and ready for instant automated payouts.'
                  : 'Connect your bank account via Stripe to receive instant payouts when posts are approved.'}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={handleToggleStripe}
                disabled={actionLoading}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                  data?.stripeConnected
                    ? 'bg-[#F9FAFB] hover:bg-gray-100 text-[#4B5563] border border-[#E5E7EB]'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {actionLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : data?.stripeConnected ? (
                  'Disconnect Account'
                ) : (
                  <>
                    Connect Stripe Account
                    <ExternalLink className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Transactions / Collaborations Payout History */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Payout & Escrow History</h3>
              <p className="text-xs text-[#6B7280]">All transactions and campaign compensations</p>
            </div>
            <button
              onClick={() => alert('Exporting statement CSV...')}
              className="px-3 py-1.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#4B5563] hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#6B7280] font-bold border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3.5 px-6">SaaS Brand & Campaign</th>
                  <th className="py-3.5 px-6">Collaboration Status</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Payout Status</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {!data?.collaborations || data.collaborations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#9CA3AF]">
                      No transactions recorded yet
                    </td>
                  </tr>
                ) : (
                  data.collaborations.map((c: any) => {
                    const isPaid = c.payment?.status === 'PAID';
                    const isEscrow = ['ACCEPTED', 'CONTENT_SUBMITTED'].includes(c.status);
                    const isPendingRelease = c.status === 'APPROVED' && !isPaid;

                    return (
                      <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-[#111827]">{c.company?.name}</div>
                          <div className="text-[11px] text-[#6B7280]">{c.campaign?.title}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-[11px] font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                            {c.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-extrabold text-[#111827]">
                          €{c.fixedRate}
                        </td>
                        <td className="py-4 px-6">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Paid Out
                            </span>
                          ) : isPendingRelease ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                              <DollarSign className="w-3 h-3" /> Ready for Payout
                            </span>
                          ) : isEscrow ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              <Clock className="w-3 h-3" /> Locked in Escrow
                            </span>
                          ) : (
                            <span className="text-[11px] text-gray-500 font-bold">
                              Invited / Applied
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-[#6B7280]">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => alert(`Invoice receipt for €${c.fixedRate} downloaded.`)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
