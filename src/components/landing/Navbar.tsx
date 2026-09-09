'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  user?: {
    name: string;
    role: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      <div className="max-w-[1672px] mx-auto px-6 sm:px-14 py-4 flex items-center justify-between">
        {/* Left: Real Naano Nav Logo */}
        <Link href="/" className="block">
          <img
            src="/lp/naano-logo-nav.png"
            alt="naano"
            className="h-[30px] w-auto object-contain block"
          />
        </Link>

        {/* Center: Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-2">
          <nav className="flex items-center gap-8 mr-6">
            <Link
              href="/"
              className="text-[15px] font-medium text-[#17181C] hover:text-black transition-colors"
            >
              For companies
            </Link>
            <Link
              href="/#for-creators"
              className="text-[15px] font-medium text-[#17181C] hover:text-black transition-colors"
            >
              For creators
            </Link>
            <Link
              href="/#for-agencies"
              className="text-[15px] font-medium text-[#17181C] hover:text-black transition-colors"
            >
              For agencies
            </Link>
            <Link
              href="/#how-it-works"
              className="text-[15px] font-medium text-[#17181C] hover:text-black transition-colors"
            >
              How it works
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#17181C] hover:text-black transition-colors cursor-pointer"
              >
                <span>Resources</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-150 ${resourcesOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {resourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl p-2 shadow-xl border border-gray-100 z-50">
                  <Link
                    href="/#faq"
                    onClick={() => setResourcesOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-[#17181C] hover:bg-gray-50 rounded-xl"
                  >
                    Frequently Asked Questions
                  </Link>
                  <Link
                    href="/#what-people-think"
                    onClick={() => setResourcesOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-[#17181C] hover:bg-gray-50 rounded-xl"
                  >
                    Case Study: Zmirov
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Language Switcher */}
          <button
            type="button"
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border-none bg-transparent hover:bg-black/5 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#6B6D74]" />
            <span className="text-[13px] font-semibold text-[#17181C] uppercase tracking-wider">
              EN
            </span>
          </button>

          {/* Auth Actions */}
          <div className="flex items-center gap-2.5 ml-2">
            {user ? (
              <Link
                href={user.role === 'CREATOR' ? '/dashboard/creator' : '/dashboard/company'}
                className="inline-flex items-center gap-2 bg-[#17181C] text-white text-[15px] font-semibold px-5 py-2.5 rounded-full hover:bg-black transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[15px] font-semibold text-[#17181C] bg-white border border-[#E8E6E2] rounded-full px-5 py-2 hover:bg-gray-50 transition-all shadow-2xs"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-[15px] font-semibold text-white bg-[#17181C] hover:bg-black rounded-full px-5 py-2.5 transition-all shadow-xs"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 rounded-full bg-white border border-[#E8E6E2] text-[#17181C] flex items-center justify-center cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-4 space-y-3 shadow-xl">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block text-[15px] font-medium text-[#17181C]"
          >
            For companies
          </Link>
          <Link
            href="/#for-creators"
            onClick={() => setMobileOpen(false)}
            className="block text-[15px] font-medium text-[#17181C]"
          >
            For creators
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block text-[15px] font-medium text-[#17181C]"
          >
            How it works
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full text-center py-2.5 bg-white border border-gray-200 rounded-full text-[15px] font-semibold text-[#17181C]"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="w-full text-center py-2.5 bg-[#17181C] text-white rounded-full text-[15px] font-semibold"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
