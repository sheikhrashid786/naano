import React from 'react';
import Header from '@/components/dashboard/Header';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Check, ShieldCheck, CreditCard, Download } from 'lucide-react';

export default async function CompanyFinancesPage() {
  const session = await getCurrentUser();
  if (!session?.companyId) return null;

  const company = await prisma.company.findUnique({
    where: { id: session.companyId },
    include: {
      collaborations: {
        where: { status: 'COMPLETED' },
        include: {
          creator: {
            include: {
              user: { select: { name: true } },
            },
          },
          payment: true,
          campaign: true,
        },
      },
    },
  });

  if (!company) return null;

  const totalSpent = company.collaborations.reduce((sum, c) => sum + c.fixedRate, 0);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Finances & Platform Plans"
        subtitle="Manage your platform subscription and creator payout invoices."
      />

      <main className="p-8 max-w-5xl w-full mx-auto space-y-8">
        {/* Plans Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Self Serve */}
          <div
            className={`bg-white border rounded-2xl p-6 shadow-xs relative ${company.plan === 'Self-Serve' ? 'border-blue-600 ring-2 ring-blue-600/10' : 'border-[#E5E7EB]'
              }`}
          >
            {company.plan === 'Self-Serve' && (
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                Current Plan
              </span>
            )}
            <h4 className="text-lg font-bold text-[#111827]">Self-Serve</h4>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#111827]">€0</span>
              <span className="text-xs text-[#6B7280]">/ month platform fee</span>
            </div>
            <p className="text-xs text-[#4B5563] mt-2">
              Source and book creators on your own. Pay only the creator&apos;s fixed per-post rate.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-[#374151]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>Full access to 3,000+ creator database</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>Direct collaboration messaging &amp; briefs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>Deduplicated click attribution tracking</span>
              </li>
            </ul>
          </div>

          {/* Managed */}
          <div
            className={`bg-white border rounded-2xl p-6 shadow-xs relative ${company.plan === 'Managed' ? 'border-blue-600 ring-2 ring-blue-600/10' : 'border-[#E5E7EB]'
              }`}
          >
            {company.plan === 'Managed' && (
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full">
                Current Plan
              </span>
            )}
            <h4 className="text-lg font-bold text-[#111827]">Done For You (Managed)</h4>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#111827]">€700</span>
              <span className="text-xs text-[#6B7280]">/ month</span>
            </div>
            <p className="text-xs text-[#4B5563] mt-2">
              Naano handles creator selection, angle testing, briefs, reporting, and optimization end-to-end.
            </p>

            <ul className="mt-5 space-y-2 text-xs text-[#374151]">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>Dedicated campaign strategist</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>Custom creator negotiation &amp; deliverable reviews</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>Full funnel lead &amp; pipeline reporting</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Completed Invoices Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-[#F3F4F6] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#111827]">Payout Receipts &amp; Invoices</h3>
              <p className="text-xs text-[#6B7280]">Completed creator payouts via Stripe Connect</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#6B7280]">Total Creator Spend:</span>{' '}
              <strong className="text-base text-[#111827]">€{totalSpent}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F9FAFB] text-[#4B5563] uppercase font-semibold text-[10px] tracking-wider border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3 px-6">Creator</th>
                  <th className="py-3 px-6">Campaign</th>
                  <th className="py-3 px-6">Fee</th>
                  <th className="py-3 px-6">Stripe Transfer</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {company.collaborations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-[#9CA3AF]">
                      No completed payouts yet.
                    </td>
                  </tr>
                ) : (
                  company.collaborations.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-bold text-[#111827]">
                        {c.creator.user.name}
                      </td>
                      <td className="py-4 px-6 text-[#4B5563]">{c.campaign.title}</td>
                      <td className="py-4 px-6 font-bold text-[#111827]">€{c.fixedRate}</td>
                      <td className="py-4 px-6 font-mono text-[11px] text-[#6B7280]">
                        {c.payment?.stripePayoutId || 'Stripe Connect Transfer'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                          Paid
                        </span>
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
