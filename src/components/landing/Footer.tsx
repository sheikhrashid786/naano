'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top CTA Row */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-indigo-950/80 border border-indigo-500/20 mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Ready to scale your pipeline?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Start working with verified LinkedIn creators today.
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl">
              Zero upfront subscription fees. Only pay creators when deliverables are approved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all text-center"
            >
              Sign Up for Free
            </Link>
            <Link
              href="/#creators"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/10 transition-all text-center"
            >
              Browse Creators
            </Link>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Col 1: Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-base">
                N
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                naano
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-sm leading-relaxed">
              The premier B2B LinkedIn creator marketplace & operating system. Connecting high-growth software companies with vetted industry influencers.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Stripe Connect Escrow Protected</span>
            </div>
          </div>

          {/* Col 2: For Brands */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              For Brands
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/#creators" className="hover:text-white transition-colors">
                  Creator Directory
                </Link>
              </li>
              <li>
                <Link href="/dashboard/company/campaigns" className="hover:text-white transition-colors">
                  Create a Campaign
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  Escrow Guarantee
                </Link>
              </li>
              <li>
                <Link href="/case-studies/blogseo" className="hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Creators & Agencies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Partners
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/creators" className="hover:text-white transition-colors">
                  Creator Onboarding
                </Link>
              </li>
              <li>
                <Link href="/agencies" className="hover:text-white transition-colors">
                  Agency Solutions
                </Link>
              </li>
              <li>
                <Link href="/dashboard/creator" className="hover:text-white transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Partner Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Growth Blog
                </Link>
              </li>
              <li>
                <Link href="/case-studies/blogseo" className="hover:text-white transition-colors">
                  BlogSEO Case Study
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Platform FAQs
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Account Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Naano Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/#faq" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/#faq" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/#faq" className="hover:text-slate-400 transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
