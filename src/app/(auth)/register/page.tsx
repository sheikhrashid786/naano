'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Check,
  ChevronDown,
} from 'lucide-react';

function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.3a1.63 1.63 0 1 0 1.63 1.63A1.63 1.63 0 0 0 7.86 6.3z" />
    </svg>
  );
}

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const [step, setStep] = useState<'select_role' | 'details'>(
    initialRoleParam ? 'details' : 'select_role'
  );

  const [role, setRole] = useState<'COMPANY' | 'CREATOR'>(
    initialRoleParam === 'creator' ? 'CREATOR' : 'COMPANY'
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [niche, setNiche] = useState('AI & SaaS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e?: React.FormEvent, customEmail?: string, customPass?: string) {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const targetEmail = customEmail || email;
    const targetPassword = customPass || password;
    const targetName = name || (role === 'COMPANY' ? companyName || 'Brand Team' : 'Creator Voice');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: targetName,
          email: targetEmail,
          password: targetPassword,
          role,
          companyName: role === 'COMPANY' ? (companyName || targetName) : undefined,
          niche: role === 'CREATOR' ? niche : undefined,
          headline: role === 'CREATOR' ? `LinkedIn Creator in ${niche}` : undefined,
          country: 'FR',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      window.location.href = data.redirectUrl || (role === 'COMPANY' ? '/dashboard/company' : '/dashboard/creator');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  function handleQuickSocial(provider: string) {
    const timestamp = Date.now().toString().slice(-4);
    if (role === 'COMPANY') {
      handleRegister(undefined, `brand.${provider}${timestamp}@lemlist.com`, 'password123');
    } else {
      handleRegister(undefined, `creator.${provider}${timestamp}@creator.io`, 'password123');
    }
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden flex bg-white font-sans antialiased text-slate-900">
      {/* Left Column: Exactly 100vh frame */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between py-5 px-6 sm:px-10 lg:px-12 xl:px-16 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center justify-between shrink-0 mb-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xs shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
              naano
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Back to home
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: DEDICATED ROLE SELECTION SCREEN (100vh Form Factor)               */}
        {/* ========================================================================= */}
        {step === 'select_role' ? (
          <div className="w-full max-w-md mx-auto my-auto py-2 space-y-4 animate-in fade-in duration-150">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block font-mono mb-1">
                Step 1 of 2
              </span>
              <h1 className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight leading-tight">
                How do you plan to use Naano?
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Join the premier B2B LinkedIn creator marketplace
              </p>
            </div>

            {/* 2 Large Dedicated Selection Cards */}
            <div className="space-y-3 pt-1">
              {/* Option 1: Brand */}
              <div
                onClick={() => setRole('COMPANY')}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  role === 'COMPANY'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        role === 'COMPANY'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Building2 className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-black text-slate-900">
                          I&apos;m a Brand
                        </h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono">
                          Company
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Discover verified B2B LinkedIn creators, sponsor targeted briefs, and track pipeline ROI.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                      role === 'COMPANY'
                        ? 'border-emerald-600 bg-emerald-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {role === 'COMPANY' && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[10.5px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>180+ verified creators</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Escrow milestone vault</span>
                  </div>
                </div>
              </div>

              {/* Option 2: Creator */}
              <div
                onClick={() => setRole('CREATOR')}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  role === 'CREATOR'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        role === 'CREATOR'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <User className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-black text-slate-900">
                          I&apos;m a Creator
                        </h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-mono">
                          Partner
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Monetize your audience with prepaid sponsorships from B2B software brands with zero commission fees.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${
                      role === 'CREATOR'
                        ? 'border-emerald-600 bg-emerald-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {role === 'CREATOR' && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[10.5px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Keep 100% of your rate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Guaranteed payouts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="button"
              onClick={() => setStep('details')}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Continue as {role === 'COMPANY' ? 'Brand' : 'Creator'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          /* ========================================================================= */
          /* STEP 2: TAILORED REGISTRATION FORM FOR THE SELECTED ROLE                 */
          /* ========================================================================= */
          <div className="w-full max-w-md mx-auto my-auto py-2 space-y-3.5 animate-in fade-in duration-150">
            {/* Back to Role Selection Trigger */}
            <button
              type="button"
              onClick={() => setStep('select_role')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Change account type</span>
            </button>

            {/* Form Title & Active Role Badge */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {role === 'COMPANY' ? 'Brand Workspace Setup' : 'Claim Creator Card'}
                </h1>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  {role === 'COMPANY'
                    ? 'Launch campaigns and book vetted LinkedIn creators.'
                    : 'Set your rate card and receive verified brand sponsorships.'}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 shrink-0">
                {role === 'COMPANY' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                <span>{role === 'COMPANY' ? 'Brand' : 'Creator'}</span>
              </span>
            </div>

            {/* Social Fast-Track Sign Up */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickSocial('linkedin')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
              >
                <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
                <span>LinkedIn</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSocial('google')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Google</span>
              </button>
            </div>

            <div className="relative my-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/80" />
              </div>
              <span className="relative bg-white px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                or sign up with email
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Main Tailored Form */}
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 placeholder:text-slate-400 transition-all duration-150"
                  />
                </div>
              </div>

              {role === 'COMPANY' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Company Name
                  </label>
                  <div className="relative group">
                    <Building2 className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corp or Leadbay"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 placeholder:text-slate-400 transition-all duration-150"
                    />
                  </div>
                </div>
              )}

              {role === 'CREATOR' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Content Niche
                  </label>
                  <div className="relative group">
                    <select
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="w-full pl-3.5 pr-10 py-2.5 sm:py-3 text-sm bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 font-medium cursor-pointer transition-all duration-150 appearance-none"
                    >
                      <option value="AI & SaaS">AI &amp; SaaS</option>
                      <option value="Sales Tech & Outbound">Sales Tech &amp; Outbound</option>
                      <option value="Growth Marketing">Growth Marketing</option>
                      <option value="RevOps & Engineering">RevOps &amp; Engineering</option>
                      <option value="Founders & Venture">Founders &amp; Venture</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {role === 'COMPANY' ? 'Work Email' : 'Email Address'}
                </label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'COMPANY' ? 'name@company.com' : 'you@creator.io'}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 placeholder:text-slate-400 transition-all duration-150"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 placeholder:text-slate-400 transition-all duration-150"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1.5 rounded-lg transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{role === 'COMPANY' ? 'Create Brand Workspace' : 'Claim Creator Card'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 shrink-0 pt-2">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-600 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Right Column: Visual Showcase (100vh frame) */}
      <div className="hidden lg:flex w-1/2 h-full bg-gradient-to-br from-[#070D0A] via-[#064E3B] to-[#070D0A] text-white p-8 xl:p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-md my-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/10 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Join 180+ Vetted Tech Voices</span>
          </div>

          <h2 className="text-2xl xl:text-3xl font-black tracking-tight text-white leading-tight">
            {role === 'COMPANY'
              ? 'Launch creator campaigns that drive actual pipeline.'
              : 'Turn your LinkedIn audience into predictable recurring ARR.'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {role === 'COMPANY'
              ? 'Discover creators by ICP match score, lock budgets safely in escrow, and trace qualified leads directly to each post.'
              : 'Define your price per post, accept prepaid brand campaigns with zero haggling, and receive escrow deposits upon delivery.'}
          </p>

          {/* Feature Checkmarks */}
          <div className="space-y-2.5 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Stripe Connect Escrow guarantee on every post</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
              <span>Closed-loop UTM parameter attribution tracking</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Zero subscription locks or agency retainer markups</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          © {new Date().getFullYear()} Naano OS. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-white" />}>
      <RegisterContent />
    </Suspense>
  );
}
