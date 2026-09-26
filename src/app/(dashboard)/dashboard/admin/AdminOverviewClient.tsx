'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import EscrowMilestoneStepper from '@/components/dashboard/EscrowMilestoneStepper';
import {
  Users,
  Briefcase,
  Store,
  Layers,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Contact,
  Sparkles,
} from 'lucide-react';

interface Props {
  initialUser: {
    name: string;
    email: string;
  };
  metrics: {
    totalUsers: number;
    totalCompanies: number;
    totalCreators: number;
    totalCampaigns: number;
    totalCollabs: number;
    totalGMV: number;
    paidGMV: number;
    pendingGMV: number;
  };
  recentUsers: any[];
  recentCollabs: any[];
  recentPayments: any[];
  featuredCreators: any[];
}

export default function AdminOverviewClient({
  initialUser,
  metrics,
  recentUsers,
  recentCollabs,
  recentPayments,
  featuredCreators,
}: Props) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative font-sans">
      {/* Top Header matching portal styling */}
      <Header
        balance={metrics.totalGMV}
        user={{
          name: initialUser.name,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        }}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* Top Title Row with Admin Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-extrabold tracking-wide shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Super Admin Master Console</span>
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live System Sync</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-950 tracking-tight leading-tight">
              Platform Master Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Full administrative governance across {metrics.totalUsers} users, {metrics.totalCreators} verified creators, and live marketplace campaigns.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard/admin/users"
              className="px-4 py-2.5 bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold rounded-2xl shadow-2xs transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Manage Users</span>
            </Link>
            <Link
              href="/dashboard/admin/creators"
              className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Contact className="w-4 h-4" />
              <span>Curate Creators</span>
            </Link>
          </div>
        </div>

        {/* 4 TOP METRIC CARDS - Luxury Forecaster identity */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. Total Transacted GMV */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Total GMV</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                  Escrow Vault
                </span>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  €{metrics.totalGMV.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-emerald-600">€{metrics.paidGMV}</span> released
                  <span className="text-slate-300">•</span>
                  <span className="font-bold text-amber-600">€{metrics.pendingGMV}</span> pending
                </div>
              </div>
            </div>
          </div>

          {/* 2. Registered Users */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">Total Users</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/70">
                  {metrics.totalCompanies} Brands
                </span>
              </div>
              <div className="border-l-2 border-teal-500 pl-3 py-0.5">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  {metrics.totalUsers}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {metrics.totalCreators} creators • {metrics.totalCompanies} companies
                </div>
              </div>
            </div>
          </div>

          {/* 3. Campaigns Created */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">Campaigns</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/70">
                  Marketplace
                </span>
              </div>
              <div className="border-l-2 border-purple-500 pl-3 py-0.5">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                  {metrics.totalCampaigns}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Active across SaaS, AI &amp; Outbound
                </div>
              </div>
            </div>
          </div>

          {/* 4. Active Collaborations */}
          <div className="bg-white border border-emerald-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] bg-gradient-to-br from-white to-emerald-50/30 rounded-2xl p-5 hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Deliverables</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
                  Collabs
                </span>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight font-mono">
                  {metrics.totalCollabs}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">
                  Contracted briefs &amp; published posts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN SECTION: Recent Activity & Financial Escrow Oversight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* LEFT 2 COLUMNS: Recent System Collaborations & Users */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Recent Collaborations Table */}
            <div className="bg-white border border-slate-200/90 rounded-3xl shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Live Collaborations &amp; Post Deliverables
                    </h2>
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200/80">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time status of brand sponsorships, creator drafts, and proof approvals
                  </p>
                </div>
                <Link
                  href="/dashboard/admin/collabs"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group"
                >
                  <span>View all ({metrics.totalCollabs})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {recentCollabs.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-400">No active collaborations found in escrow.</div>
                ) : (
                  recentCollabs.map((collab) => (
                    <div
                      key={collab.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {collab.creator?.user?.name?.[0] || 'C'}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {collab.creator?.user?.name}
                            <span className="font-normal text-slate-400"> with </span>
                            <span className="text-emerald-700 font-extrabold">{collab.company?.name}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>Campaign: <strong className="text-slate-700 font-semibold">{collab.campaign?.title}</strong></span>
                            <span className="text-slate-300">•</span>
                            <span>Rate: <strong className="font-mono font-bold text-slate-900">€{collab.fixedRate}</strong></span>
                          </div>
                          <div className="mt-2.5 w-full max-w-xs">
                            <EscrowMilestoneStepper
                              status={collab.status}
                              compact={true}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 self-end sm:self-auto">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            collab.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs'
                              : collab.status === 'CONTENT_SUBMITTED'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/80 shadow-2xs'
                              : 'bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs'
                          }`}
                        >
                          {collab.status.replace('_', ' ')}
                        </span>
                        <Link
                          href="/dashboard/admin/collabs"
                          className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Registered Users */}
            <div className="bg-white border border-slate-200/90 rounded-3xl shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Recent User Registrations
                    </h2>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Newly onboarded brands, creators, and platform members
                  </p>
                </div>
                <Link
                  href="/dashboard/admin/users"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group"
                >
                  <span>Manage all users ({metrics.totalUsers})</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200/80 text-slate-700 font-bold text-xs flex items-center justify-center shadow-2xs">
                        {user.name?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>{user.name}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              user.role === 'ADMIN'
                                ? 'bg-slate-900 text-white shadow-2xs'
                                : user.role === 'COMPANY'
                                ? 'bg-teal-50 text-teal-800 border border-teal-200/80'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs font-semibold text-slate-500">
                      {user.company?.name || user.creator?.niche || 'Platform Admin'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Escrow & Fast Creator Curation */}
          <div className="space-y-6 sm:space-y-8">
            {/* Escrow Payouts Queue */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Escrow Payouts Queue</h3>
                </div>
                <Link
                  href="/dashboard/admin/finances"
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3 mt-4">
                {recentPayments.length === 0 ? (
                  <div className="text-xs text-slate-400 text-center py-6">No payment records yet.</div>
                ) : (
                  recentPayments.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between text-xs hover:border-slate-200 transition-colors"
                    >
                      <div>
                        <div className="font-extrabold text-slate-900 font-mono">
                          €{p.amount}{' '}
                          <span className="font-normal font-sans text-slate-500 text-[11px]">
                            to {p.collaboration?.creator?.user?.name || 'Creator'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          From: {p.collaboration?.company?.name || 'Company'}
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          p.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/70'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Featured Creators Highlights */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Featured Creators</h3>
                </div>
                <Link
                  href="/dashboard/admin/creators"
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-3 mt-4">
                {featuredCreators.map((fc) => (
                  <div key={fc.id} className="p-2.5 rounded-2xl hover:bg-slate-50 flex items-center justify-between text-xs transition-colors">
                    <div className="flex items-center gap-3">
                      <img
                        src={fc.avatarUrl || fc.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                        alt={fc.user?.name || 'Creator'}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{fc.user?.name || 'Creator'}</div>
                        <div className="text-[11px] text-slate-400">{fc.niche || 'B2B Influencer'}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-emerald-600 font-mono text-sm">€{fc.pricePerPost ?? 0}</div>
                      <div className="text-[10px] text-slate-400">{((fc.followersCount || 0) / 1000).toFixed(1)}k followers</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Admin Actions Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-slate-50/60 to-white border border-emerald-200/80 shadow-[0_4px_20px_-4px_rgba(5,150,105,0.08)]">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-950 mb-3.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Super Admin Quick Controls</span>
              </h4>
              <div className="space-y-2">
                <Link
                  href="/dashboard/admin/users"
                  className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 text-xs font-bold text-slate-800 hover:text-emerald-800 flex items-center justify-between transition-all shadow-2xs group"
                >
                  <span>Grant / Revoke Admin Role</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
                <Link
                  href="/dashboard/admin/companies"
                  className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 text-xs font-bold text-slate-800 hover:text-emerald-800 flex items-center justify-between transition-all shadow-2xs group"
                >
                  <span>Upgrade Company Subscription Plan</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
                <Link
                  href="/dashboard/admin/campaigns"
                  className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 text-xs font-bold text-slate-800 hover:text-emerald-800 flex items-center justify-between transition-all shadow-2xs group"
                >
                  <span>Review &amp; Override Campaigns</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
