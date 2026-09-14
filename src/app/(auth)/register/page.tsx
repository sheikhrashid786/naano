'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Globe, ArrowLeft, Eye, EyeOff, Mail } from 'lucide-react';

function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        d="M6.5 9h2.8v8H6.5V9zm1.4-1.2a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zM10.8 9h2.7v1.1h.04c.38-.72 1.32-1.48 2.72-1.48 2.91 0 3.44 1.91 3.44 4.4V17h-2.8v-4.07c0-.97-.02-2.22-1.35-2.22-1.36 0-1.57 1.06-1.57 2.15V17h-2.8V9z"
        fill="#FFFFFF"
      />
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

function ChatBubbleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.94 2 11.8c0 2.76 1.44 5.22 3.7 6.8-.24 1.42-.98 2.68-1.02 2.75-.12.22-.05.49.16.63.1.07.22.1.34.1.1 0 .2-.03.29-.08 2.1-1.22 3.8-2.22 4.34-2.54.71.16 1.45.24 2.19.24 5.523 0 10-3.94 10-8.8S17.523 3 12 3z" />
    </svg>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialParam = searchParams.get('role');
  const initialStep =
    initialParam === 'creator' ? 'creator' : initialParam === 'brand' ? 'brand' : 'choose';

  const [step, setStep] = useState<'choose' | 'creator' | 'brand' | 'creator-email' | 'brand-email'>(
    initialStep
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('FR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(roleType: 'CREATOR' | 'COMPANY', customEmail?: string, customPass?: string) {
    setLoading(true);
    setError('');

    const targetEmail = customEmail || email || (roleType === 'CREATOR' ? 'creator@example.com' : 'brand@example.com');
    const targetPass = customPass || password || 'password123';
    const targetName = name || (roleType === 'CREATOR' ? 'Creator Partner' : 'Brand Team');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: targetName,
          email: targetEmail,
          password: targetPass,
          role: roleType,
          companyName: roleType === 'COMPANY' ? (companyName || 'SaaS Co') : undefined,
          country,
          niche: roleType === 'CREATOR' ? 'AI & SaaS' : undefined,
          headline: roleType === 'CREATOR' ? 'B2B LinkedIn Creator' : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      window.location.href = data.redirectUrl || (roleType === 'COMPANY' ? '/dashboard/company' : '/dashboard/creator');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div
      className="w-full h-screen max-h-screen flex flex-row font-sans bg-white overflow-hidden select-none"
      style={{ height: '100vh', maxHeight: '100vh' }}
    >
      {/* ========================================================
          LEFT COLUMN: Strictly 50% width White Panel
          ======================================================== */}
      <div
        className="w-1/2 min-w-0 h-full max-h-screen bg-white flex flex-col justify-between px-6 sm:px-10 lg:px-14 xl:px-16 py-8 sm:py-10 overflow-y-auto"
        style={{ width: '50%', flexBasis: '50%', height: '100vh', maxHeight: '100vh' }}
      >
        <div className="w-full max-w-[420px] mx-auto flex flex-col justify-between h-full">
          {/* Top Header (Height 32px) */}
          <div className="flex items-center justify-between w-full shrink-0 h-8">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <img
                src="/lp/naano-mark.png"
                alt="Naano"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#4B5563] cursor-pointer hover:text-[#111827] transition-colors py-1 px-2 rounded-lg hover:bg-slate-50">
              <Globe className="w-3.5 h-3.5 text-[#6B7280]" strokeWidth={1.8} />
              <span>EN</span>
            </div>
          </div>

          {/* Center Content Area (Centered with equal top & bottom margins) */}
          <div className="w-full my-auto py-4">
            {/* ----------------------------------------------------
                CASE 1: CREATOR ONBOARDING (Step 1 of 4)
                ---------------------------------------------------- */}
            {step === 'creator' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#2864EA] tracking-wider uppercase">
                    STEP 1 OF 4
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('choose')}
                    className="text-[11px] text-[#9CA3AF] hover:text-[#111827] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#111827]">
                    Join Naano
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5">
                    Get paid to create LinkedIn content for B2B brands you actually use.
                  </p>
                </div>

                {error && (
                  <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
                    {error}
                  </div>
                )}

                {/* 3 Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => handleRegister('CREATOR', 'creator.linkedin@naano.co', 'password123')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-2xl text-xs sm:text-sm font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all cursor-pointer disabled:opacity-60"
                  >
                    <LinkedInIcon className="w-4 h-4 shrink-0" />
                    <span>Sign up with LinkedIn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRegister('CREATOR', 'creator.google@naano.co', 'password123')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-2xl text-xs sm:text-sm font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all cursor-pointer disabled:opacity-60"
                  >
                    <GoogleIcon className="w-4 h-4 shrink-0" />
                    <span>Sign up with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('creator-email')}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-2xl text-xs sm:text-sm font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#64748B] shrink-0" strokeWidth={1.8} />
                    <span>Sign up with email</span>
                  </button>
                </div>

                <p className="mt-7 text-center text-xs text-[#6B7280]">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#2864EA] font-semibold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            )}

            {/* ----------------------------------------------------
                CASE 2: BRAND ONBOARDING (Matches user screenshot)
                ---------------------------------------------------- */}
            {step === 'brand' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#2864EA] tracking-wider uppercase opacity-0 select-none">
                    BRAND
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep('choose')}
                    className="text-[11px] text-[#9CA3AF] hover:text-[#111827] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#111827]">
                    Join Naano
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-[#2864EA] mt-1.5">
                    Creators. Brands. Results.
                  </p>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-2 leading-relaxed">
                    The #1 platform to run LinkedIn creator campaigns that drive real business.
                  </p>
                </div>

                {error && (
                  <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
                    {error}
                  </div>
                )}

                {/* 3 Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => handleRegister('COMPANY', 'brand.linkedin@lemlist.com', 'password123')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-2xl text-xs sm:text-sm font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all cursor-pointer disabled:opacity-60"
                  >
                    <LinkedInIcon className="w-4 h-4 shrink-0" />
                    <span>Sign up with LinkedIn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRegister('COMPANY', 'brand.google@lemlist.com', 'password123')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-2xl text-xs sm:text-sm font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all cursor-pointer disabled:opacity-60"
                  >
                    <GoogleIcon className="w-4 h-4 shrink-0" />
                    <span>Sign up with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('brand-email')}
                    className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-2xl text-xs sm:text-sm font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-[#64748B] shrink-0" strokeWidth={1.8} />
                    <span>Sign up with email</span>
                  </button>
                </div>

                <p className="mt-7 text-center text-xs text-[#6B7280]">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#2864EA] font-semibold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            )}

            {/* ----------------------------------------------------
                CASE 3: CREATOR EMAIL DETAILS FORM
                ---------------------------------------------------- */}
            {step === 'creator-email' && (
              <div>
                <button
                  type="button"
                  onClick={() => setStep('creator')}
                  className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#111827] mb-3 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
                    Creator account
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-1">Enter your details to create your creator profile</p>
                </div>

                {error && (
                  <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
                    {error}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister('CREATOR');
                  }}
                  className="mt-4 space-y-3"
                >
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1 ml-0.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Eric Smith"
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#2864EA] focus:ring-4 focus:ring-[#2864EA]/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1 ml-0.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eric@creator.io"
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#2864EA] focus:ring-4 focus:ring-[#2864EA]/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1 ml-0.5">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-[#E2E8F0] focus:border-[#2864EA] focus:ring-4 focus:ring-[#2864EA]/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] p-1 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-[#2864EA] hover:bg-[#1f56d4] text-white font-semibold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm shadow-[0_4px_14px_rgba(40,100,234,0.32)] hover:shadow-[0_6px_20px_rgba(40,100,234,0.42)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue to profile'}
                  </button>
                </form>
              </div>
            )}

            {/* ----------------------------------------------------
                CASE 4: BRAND EMAIL DETAILS FORM
                ---------------------------------------------------- */}
            {step === 'brand-email' && (
              <div>
                <button
                  type="button"
                  onClick={() => setStep('brand')}
                  className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#111827] mb-3 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
                    Brand account
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-1">Enter your company information to get started</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister('COMPANY');
                  }}
                  className="mt-4 space-y-3"
                >
                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1 ml-0.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Lemlist"
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#2864EA] focus:ring-4 focus:ring-[#2864EA]/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1 ml-0.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#2864EA] focus:ring-4 focus:ring-[#2864EA]/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1 ml-0.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#E2E8F0] focus:border-[#2864EA] focus:ring-4 focus:ring-[#2864EA]/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 bg-[#2864EA] hover:bg-[#1f56d4] text-white font-semibold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm shadow-[0_4px_14px_rgba(40,100,234,0.32)] hover:shadow-[0_6px_20px_rgba(40,100,234,0.42)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create brand account'}
                  </button>
                </form>
              </div>
            )}

            {/* ----------------------------------------------------
                CASE 5: INITIAL ROLE SELECTION ("First, who are you here as?")
                ---------------------------------------------------- */}
            {step === 'choose' && (
              <div>
                <div>
                  <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#111827]">
                    Create your account
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-1.5">
                    First, who are you here as?
                  </p>
                </div>

                <div className="mt-7 space-y-3.5">
                  <button
                    type="button"
                    onClick={() => setStep('creator')}
                    className="w-full p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] hover:border-[#2864EA] hover:shadow-[0_4px_16px_rgba(40,100,234,0.08)] bg-white transition-all text-left group cursor-pointer"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-[#111827] group-hover:text-[#2864EA] transition-colors">
                      I&apos;m a creator
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#6B7280] mt-1.5 leading-relaxed">
                      Get paid to create LinkedIn content for B2B brands you actually use.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('brand')}
                    className="w-full p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] hover:border-[#2864EA] hover:shadow-[0_4px_16px_rgba(40,100,234,0.08)] bg-white transition-all text-left group cursor-pointer"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-[#111827] group-hover:text-[#2864EA] transition-colors">
                      I&apos;m a brand
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#6B7280] mt-1.5 leading-relaxed">
                      Find creators, launch campaigns, and trace real pipeline back to each post.
                    </p>
                  </button>
                </div>

                <p className="mt-8 text-center text-xs text-[#6B7280]">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#2864EA] font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Bottom Footer Anchor (Height 32px for exact vertical symmetry) */}
          <div className="h-8 shrink-0" />
        </div>
      </div>

      {/* ========================================================
          RIGHT COLUMN: Exactly 50% width Panel
          ======================================================== */}
      {step === 'creator' || step === 'creator-email' ? (
        /* Creator Right Panel: Light Ice-Blue with Live Marketplace Card Preview */
        <div
          className="w-1/2 min-w-0 h-full max-h-screen flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 xl:p-16 bg-gradient-to-br from-[#F5F8FE] via-[#F0F5FD] to-[#E8F1FC] relative select-none overflow-hidden"
          style={{ width: '50%', flexBasis: '50%', height: '100vh', maxHeight: '100vh' }}
        >
          {/* Header Copy above card */}
          <div className="text-center max-w-md w-full mb-6">
            <span className="text-[11px] font-bold tracking-wider text-[#2864EA] uppercase block mb-1">
              YOUR MARKETPLACE CARD
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] leading-tight">
              Build a card brands can trust.
            </h2>
            <p className="text-[#6B7280] text-xs sm:text-[13px] font-normal mt-1 leading-relaxed">
              It updates live with your profile, analytics, positioning and price.
            </p>
          </div>

          {/* The Marketplace Creator Card Preview */}
          <div className="w-full max-w-[400px] bg-white rounded-[26px] shadow-[0_24px_54px_-16px_rgba(28,78,178,0.18)] border border-white/80 overflow-hidden">
            {/* Blue Banner */}
            <div className="h-28 sm:h-32 bg-gradient-to-r from-[#2167EA] via-[#2864EA] to-[#3B82F6] relative p-4 flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                <span className="font-bold text-xs tracking-tighter">in</span>
              </div>

              <div className="flex items-center gap-1.5 text-white">
                <svg width="18" height="18" viewBox="0 0 334 259" fill="none">
                  <path
                    d="M0 45C0 20.1472 20.1472 0 45 0H144.5C209.947 0 263 53.0533 263 118.5C263 133.964 250.464 146.5 235 146.5H135.5C70.0533 146.5 17 93.4467 17 28"
                    fill="white"
                  />
                  <path
                    d="M334 214C334 238.853 313.853 259 289 259H189.5C124.053 259 71 205.947 71 140.5C71 125.036 83.536 112.5 99 112.5H198.5C263.947 112.5 317 165.553 317 231"
                    fill="white"
                  />
                  <circle cx="317" cy="242" r="17" fill="#60A5FA" />
                </svg>
                <span className="font-extrabold text-base tracking-tight text-white font-sans">
                  naano
                </span>
              </div>
            </div>

            {/* Overlapping Initial Avatar */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#F3F4F6] border-4 border-white shadow-md flex items-center justify-center text-xl sm:text-2xl font-bold text-[#4B5563] mx-auto -mt-8 sm:-mt-9 relative z-10">
              Y
            </div>

            {/* Card Body */}
            <div className="px-6 pt-2 pb-4 text-center">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827]">
                Your name
              </h3>
              <p className="text-xs sm:text-[13px] text-[#6B7280] mt-1 px-4 leading-relaxed">
                Your LinkedIn headline and topics will appear here.
              </p>
            </div>

            {/* Progress / Status Bar */}
            <div className="px-6 py-3 flex items-center justify-between text-xs text-[#9CA3AF] border-t border-[#F1F5F9]">
              <span className="font-medium text-[11px]">Data</span>
              <div className="flex-1 mx-3 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div className="w-0 h-full bg-[#2864EA] rounded-full" />
              </div>
              <span className="font-medium text-[11px]">Pending</span>
            </div>

            {/* Bottom 3 Stats Grid */}
            <div className="grid grid-cols-3 border-t border-[#F1F5F9] py-3.5 px-2 text-center bg-[#FAFAFC]">
              <div className="px-2">
                <div className="text-lg font-bold text-[#111827] tracking-tight">—</div>
                <div className="text-[10px] sm:text-[11px] text-[#6B7280] mt-0.5 font-medium">
                  Followers
                </div>
              </div>
              <div className="px-2 border-x border-[#EBECEF]">
                <div className="text-lg font-bold text-[#111827] tracking-tight">—</div>
                <div className="text-[10px] sm:text-[11px] text-[#6B7280] mt-0.5 font-medium">
                  Est. impressions
                </div>
              </div>
              <div className="px-2">
                <div className="text-lg font-bold text-[#111827] tracking-tight">—</div>
                <div className="text-[10px] sm:text-[11px] text-[#6B7280] mt-0.5 font-medium">
                  Cost / post
                </div>
              </div>
            </div>
          </div>

          {/* Floating Chat Bubble Widget in bottom right */}
          <button
            type="button"
            aria-label="Open support chat"
            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#64748B] hover:bg-[#475569] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChatBubbleIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      ) : step === 'brand' || step === 'brand-email' ? (
        /* Brand Right Panel: Solid Royal Blue matching brand mockup */
        <div
          className="w-1/2 min-w-0 h-full max-h-screen flex flex-col justify-center items-center p-8 md:p-12 xl:p-20 bg-[#2864EA] text-white relative select-none overflow-hidden"
          style={{ width: '50%', flexBasis: '50%', height: '100vh', maxHeight: '100vh', backgroundColor: '#2864EA' }}
        >
          <div className="max-w-md w-full px-4">
            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
              Creators. Brands. Results.
            </h2>
            <p className="text-blue-50/95 text-xs sm:text-sm xl:text-base font-normal leading-relaxed">
              Run LinkedIn creator campaigns that drive real business - discover creators, track performance, pay in one click.
            </p>
            <div className="mt-8 text-blue-200/90 text-xs sm:text-sm font-medium">
              Built for B2B marketing teams
            </div>
          </div>

          {/* Floating Chat Bubble Widget in bottom right */}
          <button
            type="button"
            aria-label="Open support chat"
            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0C357E] hover:bg-[#092B66] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChatBubbleIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      ) : (
        /* Default Role Choice Right Panel: Solid Royal Blue (#2864EA) */
        <div
          className="w-1/2 min-w-0 h-full max-h-screen flex flex-col justify-center items-center p-8 md:p-12 xl:p-20 bg-[#2864EA] text-white relative select-none overflow-hidden"
          style={{ width: '50%', flexBasis: '50%', height: '100vh', maxHeight: '100vh', backgroundColor: '#2864EA' }}
        >
          <div className="max-w-md w-full px-4">
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold tracking-tight text-white mb-3 sm:mb-4 leading-tight">
              One platform. Two sides.
            </h2>
            <p className="text-blue-50/95 text-xs sm:text-sm xl:text-base font-normal leading-relaxed">
              Creators get paid to post. B2B brands get real pipeline. Pick where you fit and we&apos;ll set the rest up in a couple of minutes.
            </p>
          </div>

          {/* Floating Chat Bubble Widget Trigger in bottom right */}
          <button
            type="button"
            aria-label="Open support chat"
            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0C357E] hover:bg-[#092B66] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChatBubbleIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-white" />}>
      <RegisterContent />
    </Suspense>
  );
}
