'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import {
  TrendingUp,
  Search,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Edit2,
  DollarSign,
  Building2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Props {
  initialUser: {
    name: string;
    email: string;
  };
  caseStudies: any[];
}

export default function AdminCaseStudiesClient({ initialUser, caseStudies: initialItems }: Props) {
  const [caseStudiesList, setCaseStudiesList] = useState<any[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [company, setCompany] = useState('');
  const [slug, setSlug] = useState('');
  const [metric, setMetric] = useState('');
  const [metricLabel, setMetricLabel] = useState('');
  const [industry, setIndustry] = useState('AI & Developer Tools');
  const [pipelineAdded, setPipelineAdded] = useState('€25,000 ARR');
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [summary, setSummary] = useState('');
  const [challenge, setChallenge] = useState('');
  const [strategy, setStrategy] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const filteredItems = useMemo(() => {
    return caseStudiesList.filter((cs) => {
      const q = searchQuery.toLowerCase();
      return (
        cs.company.toLowerCase().includes(q) ||
        cs.metric.toLowerCase().includes(q) ||
        cs.industry.toLowerCase().includes(q) ||
        cs.slug.toLowerCase().includes(q)
      );
    });
  }, [caseStudiesList, searchQuery]);

  async function handleTogglePublished(id: string, current: boolean) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/case-studies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      setCaseStudiesList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, published: !current } : item))
      );
      showToast(!current ? 'Case study published to live site' : 'Case study unpublished');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string, compName: string) {
    if (!confirm(`Are you sure you want to delete case study for "${compName}"?`)) return;

    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/case-studies/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setCaseStudiesList((prev) => prev.filter((item) => item.id !== id));
      showToast('Case study deleted');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      const res = await fetch('/api/admin/case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company,
          slug: slug || company.toLowerCase().replace(/\s+/g, '-'),
          metric,
          metricLabel,
          industry,
          pipelineAdded,
          quote,
          author,
          role,
          summary,
          challenge,
          strategy,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create case study');

      setCaseStudiesList((prev) => [data.caseStudy, ...prev]);
      setIsAddModalOpen(false);
      setCompany('');
      setSlug('');
      setMetric('');
      setMetricLabel('');
      setQuote('');
      setSummary('');
      showToast(`Created case study for ${company}!`);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
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
        {/* Title and Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span>Editorial CMS</span>
              </span>
              <span className="text-xs font-semibold text-[#64748B]">
                {caseStudiesList.length} Dynamic Case Studies in MySQL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#111827] tracking-tight">
              Client Case Studies CMS
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Publish verified client success stories, edit ROI metrics, and curate customer acquisition proofs shown on the public site.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-2xs flex items-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Case Study</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company, metric, or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Published case studies automatically update <Link href="/case-studies" target="_blank" className="text-[#2563EB] font-bold hover:underline">/case-studies</Link> in real time.
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-3.5 px-5">Company &amp; Slug</th>
                  <th className="py-3.5 px-5">Headline Metric</th>
                  <th className="py-3.5 px-5">Pipeline Impact</th>
                  <th className="py-3.5 px-5">Industry</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/70">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No case studies found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((cs) => (
                    <tr key={cs.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Company & Slug */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-[#111827] text-sm">{cs.company}</div>
                        <div className="text-[#64748B] font-mono text-[11px]">/case-studies/{cs.slug}</div>
                      </td>

                      {/* Headline Metric */}
                      <td className="py-4 px-5">
                        <div className="font-extrabold text-[#2563EB] font-mono text-base">{cs.metric}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">{cs.metricLabel}</div>
                      </td>

                      {/* Pipeline Impact */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-emerald-600 font-mono">{cs.pipelineAdded}</div>
                        <div className="text-[10px] text-slate-400">{cs.clicks}</div>
                      </td>

                      {/* Industry */}
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {cs.industry}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <button
                          type="button"
                          disabled={loadingId === cs.id}
                          onClick={() => handleTogglePublished(cs.id, cs.published)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            cs.published
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {cs.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{cs.published ? 'Live' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right space-x-1">
                        <Link
                          href={`/case-studies/${cs.slug}`}
                          target="_blank"
                          title="View live page"
                          className="inline-flex p-2 rounded-xl text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={loadingId === cs.id}
                          onClick={() => handleDelete(cs.id, cs.company)}
                          title="Delete case study"
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add Case Study Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Case Study</h3>
                <p className="text-xs text-slate-500">Create a customer story published directly to /case-studies</p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clay.com"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="clay"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Primary Metric *</label>
                  <input
                    type="text"
                    required
                    placeholder="+280%"
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Metric Label</label>
                  <input
                    type="text"
                    placeholder="Demo Bookings"
                    value={metricLabel}
                    onChange={(e) => setMetricLabel(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pipeline Added</label>
                  <input
                    type="text"
                    placeholder="€35,000 ARR"
                    value={pipelineAdded}
                    onChange={(e) => setPipelineAdded(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800"
                >
                  <option value="AI & Developer Tools">AI & Developer Tools</option>
                  <option value="Sales Tech & Outbound">Sales Tech & Outbound</option>
                  <option value="CRM & Cloud">CRM & Cloud</option>
                  <option value="Agencies & Enterprise">Agencies & Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Executive Quote</label>
                <textarea
                  rows={2}
                  placeholder="One post from Naano's creators brought in 40+ sales calls in 48 hours..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Executive Summary / Abstract</label>
                <textarea
                  rows={2}
                  placeholder="How this SaaS scaleup activated technical creators to drive high-intent trial velocity."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {formSubmitting ? 'Publishing...' : 'Publish Case Study'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
