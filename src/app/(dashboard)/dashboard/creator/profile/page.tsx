'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import { 
  User, 
  Save, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  DollarSign, 
  Globe, 
  TrendingUp,
  ShieldCheck,
  Eye
} from 'lucide-react';

export default function CreatorProfilePage() {
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [niche, setNiche] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('US');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [pricePerPost, setPricePerPost] = useState(350);

  async function loadProfile() {
    try {
      const res = await fetch('/api/creator/profile');
      if (res.ok) {
        const data = await res.json();
        const c = data.creator;
        setCreator(c);
        setName(c.user?.name || '');
        setAvatarUrl(c.user?.avatarUrl || '');
        setHeadline(c.headline || '');
        setBio(c.bio || '');
        setNiche(c.niche || 'SaaS Growth');
        setIndustry(c.industry || 'B2B SaaS');
        setCountry(c.country || 'US');
        setLinkedinUrl(c.linkedinUrl || '');
        setPricePerPost(c.pricePerPost || 350);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/creator/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          avatarUrl,
          headline,
          bio,
          niche,
          industry,
          country,
          linkedinUrl,
          pricePerPost,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Your creator profile & deliverable pricing have been updated!');
        await loadProfile();
      }
    } catch (e) {
    } finally {
      setSaving(false);
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
        title="Creator Profile"
        subtitle="Manage your public marketplace presence, LinkedIn credentials, and rate card for SaaS brands."
      />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </span>
            <button onClick={() => setSuccessMsg('')} className="underline text-xs cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Edit Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#111827]">Edit Public Profile</h3>
                  <p className="text-xs text-[#6B7280]">Update information visible to SaaS marketing leaders</p>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>

              {/* Name & Avatar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1.5">
                  Professional Headline
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. B2B SaaS Growth & LinkedIn Ghostwriter | Ex-Gong"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1.5">
                  About & Background
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell SaaS marketers about your audience demographics, past viral campaigns, and preferred sponsorship themes..."
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-emerald-600 leading-relaxed"
                />
              </div>

              {/* Rate per post & Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5 flex items-center justify-between">
                    <span>Rate Per Post (€ EUR)</span>
                    <span className="text-[10px] text-emerald-600 font-bold">100% Escrow protected</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#9CA3AF]">€</span>
                    <input
                      type="number"
                      required
                      min={50}
                      step={25}
                      value={pricePerPost}
                      onChange={(e) => setPricePerPost(parseInt(e.target.value, 10))}
                      className="w-full pl-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs font-bold text-[#111827] focus:bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5">
                    Audience Primary Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value="US">United States (US)</option>
                    <option value="FR">France (FR)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="UK">United Kingdom (UK)</option>
                    <option value="CA">Canada (CA)</option>
                    <option value="NL">Netherlands (NL)</option>
                    <option value="ES">Spain (ES)</option>
                  </select>
                </div>
              </div>

              {/* Niche & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5">
                    Creator Niche
                  </label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g. SaaS Growth, AI DevTools, Cold Outreach"
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5">
                    Target Industry
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. B2B SaaS, SalesTech, Cloud Infrastructure"
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1.5">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <svg className="w-4 h-4 text-blue-600 absolute left-3.5 top-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full pl-10 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Marketplace Live Preview Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-4 pb-2 border-b border-[#E5E7EB]">
                <Eye className="w-4 h-4 text-emerald-600" />
                Live Brand Card Preview
              </div>

              {/* Creator Card */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-xs relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={name}
                      className="w-13 h-13 rounded-full object-cover border border-[#E5E7EB]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-[#111827] text-sm">{name || 'Creator Name'}</span>
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-[11px] text-[#6B7280] font-medium block truncate max-w-[160px]">
                        {headline || 'B2B SaaS Creator'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-1 rounded-full border border-emerald-200">
                    €{pricePerPost} <span className="font-normal text-[10px] text-emerald-600">/ post</span>
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F3F4F6] grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-[#F9FAFB] p-2 rounded-xl">
                    <span className="text-[10px] text-[#6B7280] block font-medium">Followers</span>
                    <span className="font-bold text-[#111827]">
                      {creator?.followersCount ? (creator.followersCount / 1000).toFixed(1) + 'k' : '12.4k'}
                    </span>
                  </div>
                  <div className="bg-[#F9FAFB] p-2 rounded-xl">
                    <span className="text-[10px] text-[#6B7280] block font-medium">Engagement</span>
                    <span className="font-bold text-emerald-600">
                      {creator?.engagementRate || 4.2}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md">
                    {niche || 'SaaS'}
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-md">
                    {industry || 'Technology'}
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-md">
                    {country}
                  </span>
                </div>

                <p className="mt-3 text-[11px] text-[#6B7280] line-clamp-3 leading-relaxed">
                  {bio || 'Bio preview will appear here...'}
                </p>

                <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> 94% ICP Match
                  </span>
                  <button
                    type="button"
                    className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs"
                  >
                    Invite to Campaign
                  </button>
                </div>
              </div>
            </div>

            {/* LinkedIn Verification Badge Box */}
            <div className="bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB]">
              <div className="flex items-center gap-2 font-bold text-xs text-[#111827] mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Creator Status
              </div>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Your profile is verified with authentic LinkedIn audience analytics. SaaS brands see your verified metrics when assessing campaign fit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
