'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2, Sparkles, Building2, User } from 'lucide-react';

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

      router.push(data.redirectUrl || '/dashboard/company');
      router.refresh();
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
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
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
            <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Welcome back</h1>
            <p className="text-sm text-[#6B7280] mt-1.5">Sign in to your account</p>
          </div>

          {/* Quick 1-Click Demo Login Box */}
          <div className="mt-6 p-4 rounded-2xl bg-[#F8FAFC] border border-blue-100/80 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wide mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Demo Logins</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('company')}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-white border border-[#CBD5E1] hover:border-blue-500 hover:text-blue-600 text-[#334155] py-2 px-3 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>lemlist (Brand)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('creator')}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-white border border-[#CBD5E1] hover:border-blue-500 hover:text-blue-600 text-[#334155] py-2 px-3 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Eric (Creator)</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl animate-in fade-in">
              {error}
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5 ml-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl text-sm shadow-[0_4px_12px_rgba(37,99,235,0.24)] hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-[#6B7280]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <div className="text-xs text-[#9CA3AF] text-center pt-8">
          Protected by enterprise security &amp; Stripe Connect
        </div>
      </div>

      {/* Right Brand Panel (Identical to Live Naano) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 opacity-90" />
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full mb-6 text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Naano Platform</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 tracking-tight leading-tight">Welcome back.</h2>
          <p className="text-blue-100 text-base leading-relaxed">
            Sign in to manage your campaigns, creators, and payouts — all in one centralized B2B
            marketplace.
          </p>
          <div className="mt-8 pt-8 border-t border-white/15 flex items-center gap-6 text-xs text-blue-100">
            <div>
              <div className="text-xl font-bold text-white">3,000+</div>
              <div>B2B Creators</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <div className="text-xl font-bold text-white">€0 Retainer</div>
              <div>Fixed Per Post</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
