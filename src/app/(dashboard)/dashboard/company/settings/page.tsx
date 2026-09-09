'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import { Target, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

export default function CompanyIcpSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('FR');
  const [targetIndustries, setTargetIndustries] = useState('');
  const [targetCountries, setTargetCountries] = useState('FR, US, GB');
  const [targetRoles, setTargetRoles] = useState('Founders, GTM teams, Sales leaders');

  useEffect(() => {
    async function loadIcp() {
      try {
        const res = await fetch('/api/company/icp');
        if (res.ok) {
          const data = await res.json();
          if (data.company) {
            setIndustry(data.company.industry || '');
            setCountry(data.company.country || 'FR');
            setTargetIndustries(data.company.targetIndustries || '');
            setTargetCountries(data.company.targetCountries || 'FR, US, GB');
            setTargetRoles(data.company.targetRoles || '');
          }
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadIcp();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/company/icp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry,
          country,
          targetIndustries,
          targetCountries,
          targetRoles,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update ICP settings');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="ICP Matching Settings"
        subtitle="Define your target buyer personas and geography to calibrate creator match scores."
      />

      <main className="p-8 max-w-3xl w-full mx-auto space-y-6">
        {/* Info Banner */}
        <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl text-white shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full text-blue-200 mb-2">
            <Sparkles className="w-3 h-3" />
            <span>AI Matching Engine</span>
          </div>
          <h3 className="text-xl font-bold">How ICP Matching Works</h3>
          <p className="text-xs text-blue-100 mt-1 leading-relaxed">
            Naano calculates fit percentage (65%–98%) by scoring every creator&apos;s verified LinkedIn audience,
            past campaign topics, and geographic distribution against your configured settings below.
          </p>
        </div>

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Target ICP saved successfully. Marketplace match scores have been updated!</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-[#111827]">Ideal Customer Profile (ICP)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                Your Company Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. B2B SaaS & Outbound"
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
                Headquarters Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-blue-600"
              >
                <option value="FR">France (FR)</option>
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="DE">Germany (DE)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Target Creator Niches / Industries (comma separated)
            </label>
            <input
              type="text"
              value={targetIndustries}
              onChange={(e) => setTargetIndustries(e.target.value)}
              placeholder="e.g. B2B Outbound, Sales Tech, AI & Automation, GTM Strategy"
              className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-blue-600"
            />
            <p className="text-[11px] text-[#9CA3AF] mt-1">Creators in these categories will receive a high fit match.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Target Buyer Countries (comma separated ISO codes)
            </label>
            <input
              type="text"
              value={targetCountries}
              onChange={(e) => setTargetCountries(e.target.value)}
              placeholder="e.g. FR, US, GB, DE"
              className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Target Buyer Job Roles
            </label>
            <input
              type="text"
              value={targetRoles}
              onChange={(e) => setTargetRoles(e.target.value)}
              placeholder="e.g. Founders, GTM Leaders, SDR Managers, VP Sales"
              className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Target className="w-3.5 h-3.5" />}
              <span>Save ICP Preferences</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
