'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import { 
  Loader2, 
  Save, 
  CheckCircle2, 
  X,
  AlertCircle
} from 'lucide-react';

function formatFollowers(num: number) {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toLocaleString();
}

function getCountryName(codeOrName: string) {
  if (!codeOrName) return 'Pakistan';
  const mapping: Record<string, string> = {
    PK: 'Pakistan',
    US: 'United States',
    FR: 'France',
    DE: 'Germany',
    UK: 'United Kingdom',
    GB: 'United Kingdom',
    CA: 'Canada',
    NL: 'Netherlands',
    ES: 'Spain',
    IT: 'Italy',
    AU: 'Australia',
  };
  return mapping[codeOrName.toUpperCase()] || codeOrName;
}

export default function CreatorProfilePage() {
  const [creator, setCreator] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [followersCount, setFollowersCount] = useState(5400);
  const [country, setCountry] = useState('PK');
  const [pricePerPost, setPricePerPost] = useState(240);

  async function loadProfile() {
    try {
      const res = await fetch('/api/creator/profile');
      if (res.ok) {
        const data = await res.json();
        const c = data.creator;
        setCreator(c);
        setName(c.user?.name || 'Creator');
        setAvatarUrl(c.user?.avatarUrl || '/lp/avatar-umar.jpg');
        setHeadline(
          c.headline ||
          'Full-Stack Developer | Technical Lead & Business Growth Manager | React.js | Next.js | Node.js | Laravel | WordPress | SaaS & Scalable Web Applications | 70+ Production Systems Delivered'
        );
        setBio(
          c.bio ||
          `I am a Technical Lead & Business Growth Manager with a strong full-stack development background, passionate about building digital products that solve real business challenges and create long-term value.\n\nWith 4+ years of professional experience and 70+ production systems delivered, I lead development teams, drive technical architecture, manage project delivery, and contribute to business growth through client acquisition and Upwork business development.\n\nCore Expertise\n• SaaS Platforms & Multi-Tenant Applications\n• Custom Web Applications\n• WordPress & WooCommerce Development\n• REST API Development & Integrations\n• E-Commerce Solutions\n• Performance Optimization & Technical SEO\n• System Architecture & Technical Leadership`
        );
        setFollowersCount(c.followersCount || 5400);
        setCountry(c.country || 'PK');
        setPricePerPost(c.pricePerPost || 240);
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
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
    setErrorMsg('');

    try {
      const res = await fetch('/api/creator/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          avatarUrl,
          headline,
          bio,
          country,
          pricePerPost,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Profile updated successfully!');
        setMode('preview');
        await loadProfile();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg('Failed to update profile. Please try again.');
      }
    } catch (e) {
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  }

  // Helper to render bio text into formatted paragraphs and bullet points
  function renderFormattedBio(bioText: string) {
    if (!bioText) {
      return (
        <p className="text-xs sm:text-sm text-[#64748B] italic">
          No bio details available. Click Edit to add your experience and expertise.
        </p>
      );
    }

    const sections = bioText.split('\n\n');

    return (
      <div className="text-xs sm:text-[13.5px] text-[#475569] leading-relaxed space-y-4">
        {sections.map((section, idx) => {
          const trimmed = section.trim();
          if (!trimmed) return null;

          // Check if this section contains bullets
          if (trimmed.includes('•') || trimmed.includes('\n-')) {
            const lines = trimmed.split('\n');
            return (
              <div key={idx} className="space-y-1.5 pt-1">
                {lines.map((line, lIdx) => {
                  const lineTrim = line.trim();
                  if (!lineTrim) return null;

                  if (lineTrim.startsWith('•') || lineTrim.startsWith('-')) {
                    return (
                      <div key={lIdx} className="flex items-start gap-2 text-[#475569]">
                        <span className="text-[#64748B] select-none font-bold">•</span>
                        <span>{lineTrim.replace(/^[•\-]\s*/, '')}</span>
                      </div>
                    );
                  }

                  // Non-bullet header inside bullet section like "Core Expertise"
                  return (
                    <h4 key={lIdx} className="font-bold text-[#111827] text-xs sm:text-sm pt-1 mb-1">
                      {lineTrim}
                    </h4>
                  );
                })}
              </div>
            );
          }

          // Check if single line heading
          if (trimmed.length < 40 && !trimmed.endsWith('.')) {
            return (
              <h4 key={idx} className="font-bold text-[#111827] text-xs sm:text-sm pt-1">
                {trimmed}
              </h4>
            );
          }

          // Regular paragraph
          return (
            <p key={idx} className="leading-relaxed">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2864EA]" />
      </div>
    );
  }

  const followersDisplay = formatFollowers(followersCount);
  const countryName = getCountryName(country);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Sticky Header with controls matching reference screenshot */}
      <Header
        user={{
          name: name,
          avatarUrl: avatarUrl,
        }}
        balance={0}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-6">
        {/* Top Controls: Edit / Preview Switch */}
        <div className="flex justify-end items-center">
          <div className="inline-flex items-center p-0.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`px-4 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                mode === 'edit'
                  ? 'bg-white text-[#111827] font-bold shadow-xs border border-[#E2E8F0]'
                  : 'text-[#64748B] hover:text-[#111827] font-medium'
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`px-4 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                mode === 'preview'
                  ? 'bg-white text-[#111827] font-bold shadow-xs border border-[#E2E8F0]'
                  : 'text-[#64748B] hover:text-[#111827] font-medium'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMsg && (
          <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-[#065F46] hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-red-700 hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {mode === 'preview' ? (
          /* PREVIEW MODE: Matching exactly the user's reference screenshots */
          <div className="space-y-6">
            {/* Card 1: Avatar, Name, Headline & Followers */}
            <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-start gap-5 sm:gap-6">
                {/* Circular Profile Avatar */}
                <div className="w-[72px] h-[72px] sm:w-[78px] sm:h-[78px] rounded-full overflow-hidden shrink-0 border border-blue-100 bg-[#2864EA] flex items-center justify-center shadow-xs">
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name & Headline */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <h1 className="text-2xl sm:text-[26px] font-bold text-[#111827] tracking-tight leading-tight">
                    {name}
                  </h1>
                  <p className="text-xs sm:text-[13px] text-[#475569] mt-2 font-normal leading-relaxed">
                    {headline}
                  </p>
                </div>
              </div>

              {/* Followers Stat */}
              <div className="mt-7 pt-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight leading-none">
                  {followersDisplay}
                </div>
                <div className="text-[10px] sm:text-[10.5px] font-bold text-[#8C95A6] uppercase tracking-wider mt-1.5">
                  FOLLOWERS
                </div>
              </div>
            </div>

            {/* Card 2: About & Core Expertise */}
            <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <h2 className="text-sm sm:text-base font-bold text-[#111827] mb-4">
                About
              </h2>

              {renderFormattedBio(bio)}
            </div>

            {/* Card 3: Audience & average metrics */}
            <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <h2 className="text-sm sm:text-base font-bold text-[#111827] mb-5">
                Audience & average metrics
              </h2>

              <div className="flex flex-wrap items-center gap-4">
                {/* Followers Stat Block */}
                <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl py-3.5 px-5 min-w-[135px]">
                  <div className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight leading-none">
                    {followersDisplay}
                  </div>
                  <div className="text-[10px] sm:text-[10.5px] font-bold text-[#8C95A6] uppercase tracking-wider mt-2">
                    FOLLOWERS
                  </div>
                </div>

                {/* Country Stat Block */}
                <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl py-3.5 px-5 min-w-[135px]">
                  <div className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight leading-none">
                    {countryName}
                  </div>
                  <div className="text-[10px] sm:text-[10.5px] font-bold text-[#8C95A6] uppercase tracking-wider mt-2">
                    BASED IN
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Pricing */}
            <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <h2 className="text-sm sm:text-base font-bold text-[#111827] mb-5">
                Pricing
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* Price Per Post Block */}
                <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl p-4 sm:p-5">
                  <div className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight leading-none">
                    €{pricePerPost}
                  </div>
                  <div className="text-[10px] sm:text-[10.5px] font-bold text-[#8C95A6] uppercase tracking-wider mt-2">
                    PRICE PER POST
                  </div>
                </div>

                {/* Bundle Block */}
                <div className="bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl p-4 sm:p-5">
                  <div className="text-sm sm:text-base font-bold text-[#111827] tracking-tight leading-none">
                    None set
                  </div>
                  <div className="text-[10px] sm:text-[10.5px] font-bold text-[#8C95A6] uppercase tracking-wider mt-2">
                    BUNDLE
                  </div>
                </div>
              </div>

              {/* Book a post action button */}
              <div className="mt-5">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2864EA] hover:bg-[#1e52c8] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <span>Book a post</span>
                  <span className="text-sm font-normal">→</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* EDIT MODE: Form to update live profile data */
          <form onSubmit={handleSave} className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-[#E2E8F0] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#111827]">Edit Card Details</h2>
                <p className="text-xs text-[#64748B] mt-0.5">Update your public creator presence and expertise</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode('preview')}
                  className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#111827] border border-[#E2E8F0] rounded-xl bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#2864EA] hover:bg-[#1f54cb] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Changes
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-[#2864EA]"
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
                  placeholder="/lp/avatar-umar.jpg"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-[#2864EA]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1.5">
                  Price Per Post (€ EUR)
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  step={10}
                  value={pricePerPost}
                  onChange={(e) => setPricePerPost(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-[#2864EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#374151] mb-1.5">
                  Audience Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="PK or Pakistan"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-[#2864EA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">
                Headline
              </label>
              <textarea
                rows={2}
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Professional Headline"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-[#2864EA] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#374151] mb-1.5">
                About & Core Expertise
              </label>
              <textarea
                rows={8}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write your background and bullet points..."
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#111827] focus:bg-white focus:outline-none focus:border-[#2864EA] leading-relaxed font-mono text-[11px]"
              />
              <p className="text-[11px] text-[#94A3B8] mt-1">
                Tip: Format sections with blank lines, and bullet lists with &quot;• &quot; for clean preview rendering.
              </p>
            </div>
          </form>
        )}
      </main>

      {/* Floating Chat Bubble Widget in bottom right matching screenshot */}
      <button
        type="button"
        aria-label="Support chat"
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-[#64748B] hover:bg-[#475569] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer z-50 hover:scale-105 active:scale-95"
      >
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.477 3 2 6.94 2 11.8c0 2.76 1.44 5.22 3.7 6.8-.24 1.42-.98 2.68-1.02 2.75-.12.22-.05.49.16.63.1.07.22.1.34.1.1 0 .2-.03.29-.08 2.1-1.22 3.8-2.22 4.34-2.54.71.16 1.45.24 2.19.24 5.523 0 10-3.94 10-8.8S17.523 3 12 3z" />
        </svg>
      </button>
    </div>
  );
}
