'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, User, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<'COMPANY' | 'CREATOR'>('COMPANY');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('B2B SaaS');
  const [country, setCountry] = useState('FR');
  const [niche, setNiche] = useState('AI & SaaS');
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          companyName,
          industry,
          country,
          niche,
          headline,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      router.push(data.redirectUrl || '/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Form Column */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-2xl font-bold tracking-tight text-[#17181C]">
              naano<span className="text-blue-600">.</span>
            </Link>
            <Link
              href="/"
              className="text-xs font-semibold text-[#55575E] hover:text-[#17181C] bg-[#F7F6F3] border border-[#EBE9E5] px-3 py-1.5 rounded-full transition-colors"
            >
              Back to website
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Get started with Naano</h1>
            <p className="text-sm text-[#6B7280] mt-1">Create an account to begin</p>
          </div>

          {/* Role Switcher */}
          <div className="mt-6 grid grid-cols-2 gap-3 p-1.5 bg-[#F5F4F0] border border-[#E5E3DF] rounded-2xl">
            <button
              type="button"
              onClick={() => setRole('COMPANY')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'COMPANY'
                  ? 'bg-white text-[#17181C] shadow-sm border border-[#E0DED9]'
                  : 'text-[#6B7280] hover:text-[#17181C]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>I am a Brand / SaaS</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('CREATOR')}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                role === 'CREATOR'
                  ? 'bg-white text-[#17181C] shadow-sm border border-[#E0DED9]'
                  : 'text-[#6B7280] hover:text-[#17181C]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>I am a Creator</span>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-1">
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
              />
            </div>

            {role === 'COMPANY' ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Lemlist"
                      className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-1">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                    >
                      <option value="FR">France (FR)</option>
                      <option value="US">United States (US)</option>
                      <option value="GB">United Kingdom (GB)</option>
                      <option value="DE">Germany (DE)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-1">
                    Industry / Vertical
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                  >
                    <option value="B2B SaaS">B2B SaaS</option>
                    <option value="Sales Tech">Sales Tech &amp; Outbound</option>
                    <option value="AI & Automation">AI &amp; Automation</option>
                    <option value="Fintech">Fintech</option>
                    <option value="DevTools">Developer Tools</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-1">
                    LinkedIn Headline / Tagline
                  </label>
                  <input
                    type="text"
                    required
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Helping B2B tech founders grow organically"
                    className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-1">
                      Primary Niche
                    </label>
                    <input
                      type="text"
                      required
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="e.g. AI & SaaS"
                      className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-1">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
                    >
                      <option value="FR">France (FR)</option>
                      <option value="US">United States (US)</option>
                      <option value="GB">United Kingdom (GB)</option>
                      <option value="DE">Germany (DE)</option>
                      <option value="NL">Netherlands (NL)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create free account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#6B7280]">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Column Value Props */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-neutral-900 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full mb-6 text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join 3,000+ B2B Leaders</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Scale through Creator-Led Growth.</h2>
          <p className="text-neutral-400 text-base leading-relaxed">
            Reach target buyers through the voices they already read on LinkedIn every morning. Fixed
            deliverables, zero hidden retainers.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified B2B audience metrics</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automated Stripe Connect payouts</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Deduplicated, bot-filtered click attribution</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
