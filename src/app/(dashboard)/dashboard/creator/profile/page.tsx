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
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-16 font-sans">
      <Header
        user={{
          name: name,
          avatarUrl: avatarUrl,
        }}
        balance={0}
      />

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* Top Controls & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Public Media Kit & Live Rate Card</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Creator Profile Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Configure how decision-makers discover your positioning, audience reach, and sponsorship pricing.
            </p>
          </div>

          <div className="inline-flex items-center p-1 bg-white border border-slate-200/90 rounded-2xl shadow-2xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'preview'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Preview
            </button>
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'edit'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Edit Card Data
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-rose-700 hover:opacity-75">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {mode === 'preview' ? (
          /* PREVIEW MODE: Forecaster & Luxury Aesthetic Layout */
          <div className="space-y-6">
            {/* Card 1: Avatar, Name, Headline & Followers */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
              <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-indigo-100 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md relative">
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200 font-mono">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                    {headline}
                  </p>
                </div>
              </div>

              {/* Followers Stat Block */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="border-l-2 border-indigo-500 pl-3.5 py-0.5">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">
                    {followersDisplay}
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Verified LinkedIn Followers
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: About & Core Expertise */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
              <h3 className="text-base font-black text-slate-900 mb-4 tracking-tight">
                About &amp; Core Positioning
              </h3>
              {renderFormattedBio(bio)}
            </div>

            {/* Card 3: Audience & average metrics */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
              <h3 className="text-base font-black text-slate-900 mb-4 tracking-tight">
                Audience Demographics &amp; Geographic Reach
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4">
                  <div className="border-l-2 border-indigo-500 pl-3">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                      {followersDisplay}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      Network Size
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4">
                  <div className="border-l-2 border-blue-500 pl-3">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                      {countryName}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      Audience Origin
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4">
                  <div className="border-l-2 border-emerald-500 pl-3">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                      ~12.4K
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      Avg. Reach / Post
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4">
                  <div className="border-l-2 border-violet-500 pl-3">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                      3.8%
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      Engagement Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Pricing */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)]">
              <h3 className="text-base font-black text-slate-900 mb-4 tracking-tight">
                Sponsorship Pricing &amp; Packages
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="border-l-2 border-emerald-500 pl-3.5">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                      €{pricePerPost}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-1">
                      Single Sponsored LinkedIn Post
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Includes 1 thought-leadership post, 1 round of revisions, and escrow holding protection.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
                  <div className="border-l-2 border-indigo-500 pl-3.5">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                      €{Math.round(pricePerPost * 2.7)}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-1">
                      3-Post Narrative Series (10% Off)
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Sustained 3-week campaign building deep brand familiarity and pipeline interest with decision-makers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EDIT MODE: Luxury Studio Form */
          <form onSubmit={handleSave} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.04)] space-y-6">
            <div className="border-b border-slate-100 pb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Edit Profile &amp; Pricing</h2>
                <p className="text-xs text-slate-500 mt-0.5">Keep your bio, links, and rates current for automated brand matching.</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setMode('preview')}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Changes
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="/lp/avatar-umar.jpg"
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Price Per Post (€ EUR)
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  step={10}
                  value={pricePerPost}
                  onChange={(e) => setPricePerPost(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Audience Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="PK or Pakistan"
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Headline Positioning
              </label>
              <textarea
                rows={2}
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Professional Headline"
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 leading-relaxed transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                About &amp; Core Expertise
              </label>
              <textarea
                rows={8}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write your background and bullet points..."
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 leading-relaxed font-mono text-[11px] transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Tip: Format sections with blank lines, and bullet lists with &quot;• &quot; for clean preview rendering.
              </p>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
