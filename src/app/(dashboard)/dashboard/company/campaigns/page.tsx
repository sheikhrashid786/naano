import React from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Plus, Users, ArrowRight, Target, ExternalLink } from 'lucide-react';

export default async function CompanyCampaignsPage() {
  const session = await getCurrentUser();
  if (!session?.companyId) return null;

  const campaigns = await prisma.campaign.findMany({
    where: { companyId: session.companyId },
    include: {
      brief: true,
      collaborations: {
        include: {
          creator: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      },
      _count: {
        select: { collaborations: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Campaigns"
        subtitle="Manage your creator briefs, fixed budgets, and collaboration targets."
      >
        <Link
          href="/dashboard/company/campaigns/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </Link>
      </Header>

      <main className="p-8 max-w-7xl w-full mx-auto space-y-6">
        {campaigns.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
            <Target className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-[#111827]">No campaigns created yet</h4>
            <p className="text-xs text-[#6B7280] mt-1 mb-5">
              Create your first campaign brief to begin inviting creators.
            </p>
            <Link
              href="/dashboard/company/campaigns/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      {camp.status}
                    </span>
                    <span className="text-xs text-[#6B7280]">Objective: {camp.objective}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#111827]">{camp.title}</h3>
                  <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
                    {camp.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280] pt-1">
                    <div>
                      Budget: <strong className="text-[#111827]">€{camp.budgetPerPost}</strong> / post
                    </div>
                    <div>•</div>
                    <div>
                      Creators: <strong className="text-[#111827]">{camp._count.collaborations}</strong> active
                    </div>
                    {camp.targetAudience && (
                      <>
                        <div>•</div>
                        <div>Target: {camp.targetAudience}</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/dashboard/company/marketplace"
                    className="inline-flex items-center gap-1.5 bg-[#111827] hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Invite Creators</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
