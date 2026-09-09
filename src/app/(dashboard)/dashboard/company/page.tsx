import React from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Layers,
  Users,
  MousePointerClick,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
  Mic,
  ArrowRight
} from 'lucide-react';

export default async function CompanyOverviewPage() {
  const session = await getCurrentUser();
  if (!session?.companyId) return null;

  const company = await prisma.company.findUnique({
    where: { id: session.companyId },
    include: {
      campaigns: {
        include: {
          _count: { select: { collaborations: true } },
        },
      },
      collaborations: {
        include: {
          campaign: true,
          creator: {
            include: {
              user: { select: { name: true, avatarUrl: true } },
            },
          },
          payment: true,
        },
        orderBy: { updatedAt: 'desc' },
      },
    },
  });

  if (!company) return null;

  // Compute real metrics from MySQL
  const activeCollabs = company.collaborations.filter(
    (c) => c.status === 'IN_PROGRESS' || c.status === 'CONTENT_SUBMITTED'
  );
  const pendingRequests = company.collaborations.filter(
    (c) => c.status === 'INVITED' || c.status === 'APPLIED'
  );
  const totalClicks = company.collaborations.reduce((sum, c) => sum + c.clicksCount, 0);
  const totalLeads = company.collaborations.reduce((sum, c) => sum + c.leadsCount, 0);

  const activeCampaign = company.campaigns[0];
  const companyCountry = company.country || 'FR';

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-20 relative">
      {/* Top Header Controls (Wallet, Language, Notifications, Avatar) */}
      <Header user={{ name: session.name }} />

      <main className="px-8 sm:px-12 max-w-7xl w-full mx-auto space-y-6">
        {/* Welcome Section */}
        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Brand workspace
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your campaign activity, at a glance.
          </p>
        </div>

        {/* 4 Metrics Cards Grid (Exact same styling as creator side) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. ACTIVE COLLABORATIONS */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Active Collaborations</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{activeCollabs.length}</div>
            <p className="mt-1 text-xs text-slate-400">Creators actively creating or submitted</p>
          </div>

          {/* 2. PENDING REQUESTS */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Pending Requests</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{pendingRequests.length}</div>
            <p className="mt-1 text-xs text-slate-400">Invitations and creator applications</p>
          </div>

          {/* 3. ATTRIBUTED CLICKS */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
              <span>Attributed Clicks</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {totalClicks > 0 ? totalClicks.toLocaleString() : '—'}
            </div>
            <p className="mt-1 text-xs text-slate-400">100% Deduplicated visits</p>
          </div>

          {/* 4. ATTRIBUTED LEADS */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              <span>Attributed Leads</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {totalLeads > 0 ? totalLeads.toLocaleString() : '0'}
            </div>
            <p className="mt-1 text-xs text-slate-400">Verified signups &amp; booked demos</p>
          </div>
        </div>

        {/* Middle Two Panels: Brand Campaign Card & Launch Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Panel: Your brand campaign card */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your brand campaign card</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This is how creators discover your brand, deliverables, and fixed-fee offers.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/dashboard/company/campaigns"
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>Open briefs</span>
                </Link>
                <Link
                  href="/dashboard/company/marketplace"
                  className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Browse creators</span>
                </Link>
              </div>
            </div>

            {/* Brand Card Preview Mockup */}
            <div className="mt-6 max-w-sm mx-auto border border-slate-200 rounded-3xl shadow-sm overflow-hidden bg-white">
              {/* Blue Gradient Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 h-24 p-4 flex items-start justify-between text-white relative">
                {/* LinkedIn Badge */}
                <div className="w-6 h-6 rounded bg-white text-[#0A66C2] flex items-center justify-center font-bold text-xs shadow-xs">
                  in
                </div>

                {/* White Naano Wordmark */}
                <div className="flex items-center gap-1 text-white font-extrabold text-sm tracking-tight">
                  <span className="text-base">naano</span>
                </div>

                {/* Country Pill & Share Button */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/30 text-white uppercase">
                    {companyCountry}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                    <Share2 className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Brand Profile Avatar */}
              <div className="-mt-9 flex justify-center">
                <div className="w-18 h-18 rounded-full border-4 border-white shadow-md bg-slate-900 text-white font-bold flex items-center justify-center text-xl overflow-hidden">
                  <span>{company.name.slice(0, 2).toUpperCase()}</span>
                </div>
              </div>

              {/* Brand Details */}
              <div className="text-center px-4 pt-2 pb-5">
                <h4 className="text-base font-bold text-slate-900">{company.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{company.industry || 'B2B SaaS'}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                  {activeCampaign ? (
                    <div>
                      <span className="font-semibold text-slate-900 block">{activeCampaign.title}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        Fixed rate: €{activeCampaign.budgetPerPost}/post
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400">
                      Create your first campaign brief to display deliverables here.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Your launch guide */}
          <div className="bg-white border border-slate-100/80 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your launch guide</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Personalized for your Campaign setup status
                </p>
              </div>

              <Link
                href="/dashboard/company/settings"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Configure ICP
              </Link>
            </div>

            {/* Checklist Item 1: Card and brief ready */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900">Card and brief ready</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your company profile and deliverables are active.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Complete
                </span>
                <Link
                  href="/dashboard/company/campaigns"
                  className="w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Checklist Item 2: ICP matching calibrated */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900">ICP matching calibrated</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target buyer industries and geographic filters are ready.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Complete
                </span>
                <Link
                  href="/dashboard/company/settings"
                  className="w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Checklist Item 3: Escrow wallet ready */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900">Escrow payouts ready</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fixed creator fees are held securely until deliverables are approved.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Ready
                </span>
                <Link
                  href="/dashboard/company/finances"
                  className="w-7 h-7 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Collaborations Table */}
        <div className="bg-white border border-slate-100/80 rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Collaborations</h3>
              <p className="text-xs text-slate-500 mt-0.5">Campaign deliverables and submitted content</p>
            </div>
            <Link
              href="/dashboard/company/collabs"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View all collabs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCFCFB] text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Creator</th>
                  <th className="py-3.5 px-6">Campaign</th>
                  <th className="py-3.5 px-6">Deliverable Rate</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Performance</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {company.collaborations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No collaborations active yet. Start by inviting creators from the marketplace!
                    </td>
                  </tr>
                ) : (
                  company.collaborations.slice(0, 6).map((collab) => {
                    const isSubmitted = collab.status === 'CONTENT_SUBMITTED';
                    const isCompleted = collab.status === 'COMPLETED';

                    return (
                      <tr key={collab.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                              {collab.creator.user.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{collab.creator.user.name}</div>
                              <div className="text-[11px] text-slate-500">{collab.creator.niche}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-900 font-medium max-w-[200px] truncate">
                          {collab.campaign.title}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          €{collab.fixedRate}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isSubmitted
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {collab.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-[11px]">
                            <span className="font-bold text-slate-900">{collab.clicksCount}</span> clicks ·{' '}
                            <span className="font-bold text-emerald-600">{collab.leadsCount}</span> leads
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            href="/dashboard/company/collabs"
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                              isSubmitted
                                ? 'bg-[#2563EB] text-white hover:bg-blue-700'
                                : 'text-blue-600 hover:underline'
                            }`}
                          >
                            {isSubmitted ? 'Review & Pay' : 'Details'}
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Floating AI Helper Search Pill at Bottom Center */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-lg hover:shadow-xl rounded-full px-4 py-2.5 flex items-center gap-3 w-96 max-w-[90vw] transition-all">
          <Sparkles className="w-4 h-4 text-slate-600 shrink-0" />
          <input
            type="text"
            placeholder="What can I help you find?"
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <Mic className="w-4 h-4 text-slate-400 hover:text-slate-700 cursor-pointer shrink-0" />
        </div>
      </div>
    </div>
  );
}
