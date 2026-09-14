'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Globe } from 'lucide-react';

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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e?: React.FormEvent, customEmail?: string, customPass?: string) {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const targetEmail = customEmail || email;
    const targetPassword = customPass || password;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      window.location.href = data.redirectUrl || '/dashboard/company';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  function handleDemoLogin(role: 'company' | 'creator') {
    if (role === 'company') {
      setEmail('company@lemlist.com');
      setPassword('password123');
      handleLogin(undefined, 'company@lemlist.com', 'password123');
    } else {
      setEmail('eric@creator.io');
      setPassword('password123');
      handleLogin(undefined, 'eric@creator.io', 'password123');
    }
  }

  return (
    <div
      className="w-full h-screen max-h-screen flex flex-row font-sans bg-white overflow-hidden select-none"
      style={{ height: '100vh', maxHeight: '100vh' }}
    >
      {/* Left Column: Exactly 50% width White Panel, Equal Top & Bottom Margins */}
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

          {/* Form Content Area: Centered with Equal Margin Above and Below */}
          <div className="w-full my-auto py-4">
            <div>
              <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#111827]">
                Welcome back
              </h1>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-1">Sign in to your account</p>
            </div>

            {/* Social Sign In Buttons */}
            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('company')}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs sm:text-sm font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all cursor-pointer"
              >
                <LinkedInIcon className="w-4 h-4 shrink-0" />
                <span>Continue with LinkedIn</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('company')}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs sm:text-sm font-medium text-[#1E293B] shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all cursor-pointer"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4 sm:my-5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]" />
              </div>
              <div className="relative bg-white px-3 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                OR CONTINUE WITH EMAIL
              </div>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
                {error}
              </div>
            )}

            {/* Email / Password Form */}
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-1 ml-0.5">
                  EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full bg-white border border-[#E2E8F0] focus:border-[#2864EA] focus:ring-4 focus:ring-[#2864EA]/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1 ml-0.5">
                  <label className="block text-[10px] sm:text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link will be sent to your email.')}
                    className="text-xs font-medium text-[#2864EA] hover:text-[#1D4ED8] hover:underline cursor-pointer bg-transparent border-0 p-0"
                  >
                    Forgot password?
                  </button>
                </div>
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1.5 bg-[#2864EA] hover:bg-[#1f56d4] text-white font-semibold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm shadow-[0_4px_14px_rgba(40,100,234,0.32)] hover:shadow-[0_6px_20px_rgba(40,100,234,0.42)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-4 text-center text-xs text-[#6B7280]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#2864EA] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Bottom Footer (Height 32px, Exact Match to Top Header for True Vertical Symmetry) */}
          <div className="flex items-center justify-center w-full shrink-0 h-8 text-[10px] sm:text-[11px] text-[#94A3B8] gap-2">
            <span>Demo:</span>
            <button
              type="button"
              onClick={() => handleDemoLogin('company')}
              className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#2864EA] border border-slate-200 transition-all cursor-pointer font-medium"
            >
              Brand (lemlist)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('creator')}
              className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#2864EA] border border-slate-200 transition-all cursor-pointer font-medium"
            >
              Creator (Eric)
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Exactly 50% width Solid Royal Blue Panel (#2864EA), max 100vh */}
      <div
        className="w-1/2 min-w-0 h-full max-h-screen flex flex-col justify-center items-center p-8 md:p-12 xl:p-20 bg-[#2864EA] text-white relative select-none overflow-hidden"
        style={{ width: '50%', flexBasis: '50%', height: '100vh', maxHeight: '100vh', backgroundColor: '#2864EA' }}
      >
        <div className="max-w-md w-full px-4">
          <h2 className="text-2xl sm:text-3xl xl:text-4xl font-bold tracking-tight text-white mb-3 sm:mb-4 leading-tight">
            Welcome back.
          </h2>
          <p className="text-blue-50/95 text-xs sm:text-sm xl:text-base font-normal leading-relaxed">
            Sign in to manage your campaigns, creators and payouts, all in one place.
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
    </div>
  );
}
