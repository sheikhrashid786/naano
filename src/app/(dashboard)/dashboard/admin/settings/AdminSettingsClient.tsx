'use client';

import React, { useState } from 'react';
import Header from '@/components/dashboard/Header';
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  Percent,
  DollarSign,
  Mail,
  Lock,
  Globe,
  Save,
  Server,
} from 'lucide-react';

interface Props {
  initialUser: {
    name: string;
    email: string;
  };
  settings: any[];
}

export default function AdminSettingsClient({ initialUser, settings: initialSettings }: Props) {
  const getSetting = (key: string, def: string) => {
    const s = initialSettings.find((item) => item.key === key);
    return s ? s.value : def;
  };

  const [platformFee, setPlatformFee] = useState(getSetting('platform_fee_percent', '15'));
  const [minRate, setMinRate] = useState(getSetting('min_creator_rate_eur', '50'));
  const [supportEmail, setSupportEmail] = useState(getSetting('support_contact_email', 'support@naano.io'));
  const [marketplaceOpen, setMarketplaceOpen] = useState(getSetting('marketplace_open', 'true') === 'true');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  async function saveSetting(key: string, value: string, desc: string) {
    setSavingKey(key);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, description: desc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save setting');

      showToast(`Setting "${key}" updated successfully!`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingKey(null);
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
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Global Configuration</span>
              </span>
              <span className="text-xs font-semibold text-[#64748B]">System Parameters</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#111827] tracking-tight">
              Platform Settings &amp; Governance
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Configure marketplace financial take rates, escrow limits, public discovery controls, and administrative policies.
            </p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {/* 1. Take Rate */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Platform Commission Fee (%)</h3>
                <p className="text-xs text-slate-500">Margin deducted from completed escrow payouts</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="number"
                min={0}
                max={50}
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                className="w-32 px-3.5 py-2 border border-slate-200 rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600"
              />
              <button
                type="button"
                disabled={savingKey === 'platform_fee_percent'}
                onClick={() => saveSetting('platform_fee_percent', platformFee, 'Platform fee percentage')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* 2. Minimum Creator Deliverable Rate */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Minimum Deliverable Rate (€)</h3>
                <p className="text-xs text-slate-500">Floor price per creator deliverable proposal</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="number"
                min={10}
                max={1000}
                value={minRate}
                onChange={(e) => setMinRate(e.target.value)}
                className="w-32 px-3.5 py-2 border border-slate-200 rounded-xl font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600"
              />
              <button
                type="button"
                disabled={savingKey === 'min_creator_rate_eur'}
                onClick={() => saveSetting('min_creator_rate_eur', minRate, 'Minimum deliverable rate EUR')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* 3. Support Email */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Official Support Contact Email</h3>
                <p className="text-xs text-slate-500">Recipient of escalation alerts &amp; platform disputes</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600"
              />
              <button
                type="button"
                disabled={savingKey === 'support_contact_email'}
                onClick={() => saveSetting('support_contact_email', supportEmail, 'Support email address')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* 4. Public Marketplace Access */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Marketplace Public Access</h3>
                <p className="text-xs text-slate-500">Allow visitors to view creator rates without logging in</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-700">
                {marketplaceOpen ? '✅ Public Discovery Enabled' : '🔒 Authenticated Users Only'}
              </span>
              <button
                type="button"
                disabled={savingKey === 'marketplace_open'}
                onClick={() => {
                  const newVal = !marketplaceOpen;
                  setMarketplaceOpen(newVal);
                  saveSetting('marketplace_open', String(newVal), 'Marketplace public access');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  marketplaceOpen ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {marketplaceOpen ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
