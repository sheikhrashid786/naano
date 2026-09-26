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
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Quote,
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

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

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
        throw new Error(data.error || 'Invalid email or password');
      }

      const destination = redirectParam || data.redirectUrl || '/dashboard';
      window.location.href = destination;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  function handleDemoLogin(role: 'admin' | 'company' | 'creator') {
    if (role === 'admin') {
      setEmail('admin@naano.io');
      setPassword('password123');
      handleLogin(undefined, 'admin@naano.io', 'password123');
    } else if (role === 'company') {
      setEmail('brand@lemlist.com');
      setPassword('password123');
      handleLogin(undefined, 'brand@lemlist.com', 'password123');
    } else {
      setEmail('creator@naano.io');
      setPassword('password123');
      handleLogin(undefined, 'creator@naano.io', 'password123');
    }
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden flex bg-white font-sans antialiased text-slate-900">
      {/* Left Column: Exactly 100vh frame */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-between py-5 px-6 sm:px-10 lg:px-12 xl:px-16 overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center justify-between shrink-0 mb-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="font-black text-lg tracking-tight text-slate-900">
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

        {/* Center Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-2 space-y-3.5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100 uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Sign In to Naano OS</span>
            </div>
            <h1 className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your campaigns, creators, conversations, and payouts
            </p>
          </div>

          {redirectParam && (
            <div className="p-3 rounded-2xl bg-indigo-50/90 border border-indigo-200/90 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold text-indigo-950">Login Required to Continue</h4>
                <p className="text-[10px] text-indigo-700 mt-0.5">
                  Please sign in or use a 1-click demo persona below.
                </p>
              </div>
            </div>
          )}

          {/* Quick 1-Click Demo Login Bar */}
          <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 font-mono">
                1-Click Quick Demo Sign-in:
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-white shadow-2xs transition-all text-center cursor-pointer"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('company')}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-indigo-50 text-[11px] font-bold text-indigo-700 border border-indigo-200/80 shadow-2xs transition-all text-center cursor-pointer"
              >
                🏢 Brand
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('creator')}
                className="py-1.5 px-2 rounded-xl bg-white hover:bg-indigo-50 text-[11px] font-bold text-indigo-700 border border-indigo-200/80 shadow-2xs transition-all text-center cursor-pointer"
              >
                ✍️ Creator
              </button>
            </div>
          </div>

          {/* Social Sign-in Options */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('creator')}
              className="flex items-center justify-center gap-2.5 py-2.5 px-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
            >
              <LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />
              <span>LinkedIn</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('company')}
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
              or with work email
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Work Email
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 placeholder:text-slate-400 transition-all duration-150"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to demo inbox.')}
                  className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-slate-300 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 text-slate-900 placeholder:text-slate-400 transition-all duration-150"
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
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 shrink-0 pt-2">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="text-indigo-600 font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {/* Right Column: Original Dark Gradient Showcase (100vh frame) */}
      <div className="hidden lg:flex w-1/2 h-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-8 xl:p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-600/20 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-md my-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-bold border border-white/10 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guaranteed B2B Performance</span>
          </div>

          <h2 className="text-2xl xl:text-3xl font-black tracking-tight text-white leading-tight">
            The modern way to run LinkedIn creator campaigns.
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Discover verified tech influencers, collaborate with structured briefs, and protect your budget with automated escrow.
          </p>

          {/* Live Metrics Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400 font-mono">Escrow Payouts</div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">€1.4M+</div>
                <div className="text-[10px] text-slate-400 mt-0.5">100% on-time release</div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400 font-mono">Avg. Engagement</div>
                <div className="text-xl font-black text-indigo-300 font-mono mt-0.5">4.8%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Organic reach</div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center gap-2.5">
              <Quote className="w-4 h-4 text-indigo-400 shrink-0 rotate-180" />
              <p className="text-[11px] text-slate-300 italic">
                &quot;Naano gave us direct pipeline access to our exact target SaaS buyers.&quot;
              </p>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-white" />}>
      <LoginContent />
    </Suspense>
  );
}
