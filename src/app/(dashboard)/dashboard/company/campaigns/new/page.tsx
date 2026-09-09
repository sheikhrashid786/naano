'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import { Sparkles, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('Brand Awareness & Lead Generation');
  const [budgetPerPost, setBudgetPerPost] = useState('250');
  const [targetAudience, setTargetAudience] = useState('Founders, GTM Teams, Sales Leaders');
  const [description, setDescription] = useState('');
  const [deliverables, setDeliverables] = useState('1 In-depth LinkedIn post + tracked link in comments');

  // AI Brief Fields
  const [angle, setAngle] = useState(
    'Highlighting how modern teams solve manual sales bottlenecks with automated workflows.'
  );
  const [hooks, setHooks] = useState([
    "99% of B2B teams do this the hard way. Here is what the top 1% do instead:",
    "We tested 4 different workflows last month. Here is the unexpected result:",
    "Stop wasting 10 hours a week on manual data entry. Here is the automated fix:"
  ]);
  const [keyTalkingPoints, setKeyTalkingPoints] = useState(
    '1. Concrete customer results and before/after metrics.\n2. Ease of setup in under 5 minutes.\n3. Free trial available without credit card.'
  );
  const [dosAndDonts, setDosAndDonts] = useState(
    'DO: Share real screenshots or authentic takeaways.\nDON\'T: Sound like a corporate PR release.\nDON\'T: Put links in the main text.'
  );
  const [trackingUrl, setTrackingUrl] = useState('https://yoursaas.com/?utm_source=naano');
  const [callToAction, setCallToAction] = useState('Comment "GUIDE" below and I will DM you the playbook.');

  function generateAIHooks() {
    setHooks([
      `The #1 mistake tech founders make when scaling ${objective.toLowerCase()} in 2026:`,
      `I audited 50+ B2B teams last week. 90% are losing pipeline right here:`,
      `How to get enterprise results on a startup budget (step-by-step breakdown):`
    ]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          objective,
          budgetPerPost,
          targetAudience,
          description,
          deliverables,
          angle,
          suggestedHooks: hooks,
          keyTalkingPoints,
          dosAndDonts,
          trackingUrl,
          callToAction,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create campaign');
      }

      router.push('/dashboard/company/marketplace');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Create Campaign Brief"
        subtitle="Set your campaign goals, deliverables, budget, and AI-assisted brief."
      >
        <Link
          href="/dashboard/company/campaigns"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#111827] px-3 py-2 rounded-xl border border-[#E5E7EB] bg-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
      </Header>

      <main className="p-8 max-w-4xl w-full mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Campaign Basics */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#111827]">1. Campaign Overview</h3>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                Campaign Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q3 Growth: AI Outbound Launch"
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                  Primary Objective
                </label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600"
                >
                  <option value="Brand Awareness & Reach">Brand Awareness &amp; Reach</option>
                  <option value="Lead Generation & Demos">Lead Generation &amp; Demos</option>
                  <option value="Product Launch & Trials">Product Launch &amp; Trials</option>
                  <option value="Lead Magnet Downloads">Lead Magnet Downloads</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                  Fixed Budget Per Post (€ EUR)
                </label>
                <input
                  type="number"
                  required
                  value={budgetPerPost}
                  onChange={(e) => setBudgetPerPost(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                Campaign Description *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what product or feature you are promoting and the key context creators should know..."
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                  Target Buyer Roles
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                  Deliverables Scope
                </label>
                <input
                  type="text"
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Creator Brief & AI Assistance */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#111827]">2. Creator Brief &amp; Guidelines</h3>
                <p className="text-xs text-[#6B7280]">Creators will follow this brief to craft their posts.</p>
              </div>
              <button
                type="button"
                onClick={generateAIHooks}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Regenerate AI Hooks</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                Content Angle &amp; Narrative
              </label>
              <textarea
                rows={2}
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                Suggested Opening Hooks
              </label>
              <div className="space-y-2">
                {hooks.map((hook, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 font-mono">0{idx + 1}</span>
                    <input
                      type="text"
                      value={hook}
                      onChange={(e) => {
                        const updated = [...hooks];
                        updated[idx] = e.target.value;
                        setHooks(updated);
                      }}
                      className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                  Key Talking Points
                </label>
                <textarea
                  rows={3}
                  value={keyTalkingPoints}
                  onChange={(e) => setKeyTalkingPoints(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                  Do&apos;s &amp; Don&apos;ts
                </label>
                <textarea
                  rows={3}
                  value={dosAndDonts}
                  onChange={(e) => setDosAndDonts(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                  Attribution Tracking Link
                </label>
                <input
                  type="text"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                  Suggested Call to Action
                </label>
                <input
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link
              href="/dashboard/company/campaigns"
              className="text-xs font-semibold text-[#4B5563] hover:text-[#111827]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              <span>Save &amp; Invite Creators</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
