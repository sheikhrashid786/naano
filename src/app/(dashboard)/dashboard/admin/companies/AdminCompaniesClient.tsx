'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/dashboard/Header';
import {
  Briefcase,
  Search,
  CheckCircle2,
  Building2,
  ExternalLink,
  ShieldCheck,
  Globe,
  Layers,
  Store,
  DollarSign,
} from 'lucide-react';

interface Props {
  initialUser: {
    name: string;
    email: string;
  };
  companies: any[];
}

export default function AdminCompaniesClient({ initialUser, companies: initialCompanies }: Props) {
  const [companiesList, setCompaniesList] = useState<any[]>(initialCompanies);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('ALL');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const filteredCompanies = useMemo(() => {
    return companiesList.filter((c) => {
      const matchesPlan = selectedPlan === 'ALL' || c.plan === selectedPlan;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(query) ||
        (c.user?.name && c.user.name.toLowerCase().includes(query)) ||
        (c.industry && c.industry.toLowerCase().includes(query)) ||
        (c.user?.email && c.user.email.toLowerCase().includes(query));
      return matchesPlan && matchesSearch;
    });
  }, [companiesList, selectedPlan, searchQuery]);

  async function handlePlanChange(companyId: string, newPlan: string) {
    setLoadingId(companyId);
    try {
      const res = await fetch(`/api/admin/companies/${companyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update plan');

      setCompaniesList((prev) =>
        prev.map((c) => (c.id === companyId ? { ...c, plan: newPlan } : c))
      );
      showToast(`Company subscription updated to ${newPlan}`);
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
                <span>Client Organizations</span>
              </span>
              <span className="text-xs font-semibold text-[#64748B]">
                {companiesList.length} Active Company Workspaces
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#111827] tracking-tight">
              Company Accounts &amp; Subscription Plans
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Manage enterprise accounts, upgrade pricing plans, and monitor campaign deployment across B2B brands.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['ALL', 'Self-Serve', 'Growth', 'Enterprise'].map((plan) => (
              <button
                key={plan}
                onClick={() => setSelectedPlan(plan)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedPlan === plan
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {plan === 'ALL' ? 'All Plans' : plan}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company, owner, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-3.5 px-5">Company / Workspace</th>
                  <th className="py-3.5 px-5">Account Owner</th>
                  <th className="py-3.5 px-5">Campaigns &amp; Collabs</th>
                  <th className="py-3.5 px-5">Subscription Plan</th>
                  <th className="py-3.5 px-5 text-right">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/70">
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      No companies match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => {
                    const totalSpend = company.collaborations.reduce(
                      (sum: number, c: any) => sum + (c.fixedRate || 0),
                      0
                    );

                    return (
                      <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Company Info */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center shrink-0 border border-indigo-100">
                              {company.name?.[0] || 'C'}
                            </div>
                            <div>
                              <div className="font-bold text-[#111827] text-sm flex items-center gap-1.5">
                                <span>{company.name}</span>
                              </div>
                              <div className="text-[#64748B] text-[11px]">
                                {company.industry || 'B2B Tech'} • {company.country || 'Global'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Owner Info */}
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-800">{company.user?.name}</div>
                          <div className="text-[11px] text-[#64748B] font-mono">{company.user?.email}</div>
                        </td>

                        {/* Campaigns & Collabs */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 font-bold text-slate-800">
                              <Store className="w-3.5 h-3.5 text-blue-500" />
                              <span>{company.campaigns?.length || 0} campaigns</span>
                            </span>
                            <span className="flex items-center gap-1 font-bold text-emerald-600">
                              <Layers className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{company.collaborations?.length || 0} collabs</span>
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                            €{totalSpend.toLocaleString()} total contract pool
                          </div>
                        </td>

                        {/* Subscription Tier Switcher */}
                        <td className="py-4 px-5">
                          <select
                            value={company.plan}
                            disabled={loadingId === company.id}
                            onChange={(e) => handlePlanChange(company.id, e.target.value)}
                            className="bg-white border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer disabled:opacity-50"
                          >
                            <option value="Self-Serve">Self-Serve</option>
                            <option value="Growth">Growth</option>
                            <option value="Enterprise">Enterprise</option>
                          </select>
                        </td>

                        {/* Website Link */}
                        <td className="py-4 px-5 text-right">
                          {company.website ? (
                            <a
                              href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span>Visit</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">No URL</span>
                          )}
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
    </div>
  );
}
