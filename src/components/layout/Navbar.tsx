'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Compass,
  Briefcase,
  Users,
  Building2,
  BookOpen,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  initialUser?: {
    name?: string;
    role?: string;
    avatarUrl?: string | null;
  } | null;
}

export default function Navbar({ initialUser }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(initialUser || null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Fetch live session if not passed
    if (!initialUser) {
      fetch('/api/auth/me')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            setCurrentUser(data.user);
          }
        })
        .catch(() => {});
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [initialUser]);

  const dashboardUrl =
    currentUser?.role === 'CREATOR' ? '/dashboard/creator' : '/dashboard/company';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-xs border-b border-slate-200/80 py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Mark */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/25 ring-1 ring-black/5 group-hover:scale-105 transition-all">
              <span className="font-black text-lg tracking-tighter">N</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                naano
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/80 uppercase tracking-widest font-mono">
                B2B
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 bg-white/85 backdrop-blur-md border border-slate-200/90 px-3 py-1.5 rounded-full shadow-2xs">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all ${
                pathname === '/'
                  ? 'text-emerald-700 bg-emerald-50/90 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              For Companies
            </Link>

            <Link
              href="/creators"
              className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all ${
                pathname === '/creators'
                  ? 'text-emerald-700 bg-emerald-50/90 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              For Creators
            </Link>

            <Link
              href="/agencies"
              className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-semibold transition-all ${
                pathname === '/agencies'
                  ? 'text-emerald-700 bg-emerald-50/90 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              For Agencies
            </Link>

            <Link
              href="/#how-it-works"
              className="px-3 py-1.5 rounded-full text-xs lg:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all"
            >
              How It Works
            </Link>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs lg:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all cursor-pointer"
              >
                <span>Insights</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${resourcesOpen ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {resourcesOpen && (
                <div
                  onMouseLeave={() => setResourcesOpen(false)}
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl p-2 shadow-xl border border-slate-200/90 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <Link
                    href="/case-studies"
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">All Case Studies</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Verified brand results</div>
                    </div>
                  </Link>

                  <Link
                    href="/blog"
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">All Blog Playbooks</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">16+ benchmarks &amp; guides</div>
                    </div>
                  </Link>

                  <Link
                    href="/#faq"
                    onClick={() => setResourcesOpen(false)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">FAQ & Escrow Terms</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Guaranteed payouts</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <Link
                href={dashboardUrl}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-slate-900 hover:bg-emerald-600 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-800 bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 shadow-2xs hover:shadow-xs transition-all hover:scale-105 active:scale-95"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-6 py-5 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              For Companies
            </Link>
            <Link
              href="/creators"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              For Creators
            </Link>
            <Link
              href="/agencies"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              For Agencies
            </Link>
            <Link
              href="/case-studies"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              All Case Studies
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-xl"
            >
              All Blog Playbooks
            </Link>
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <Link
                href={dashboardUrl}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 shadow-2xs transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white"
                >
                  Create an account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
