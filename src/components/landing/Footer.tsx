import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#101113] text-white pt-20 pb-12 px-6 sm:px-14 overflow-hidden relative">
      <div className="max-w-[1672px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-[#26272C]">
          {/* Col 1: Brand */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <img
              src="/lp/naano-logo-nav.png"
              alt="naano"
              className="h-7 w-auto object-contain brightness-0 invert"
            />
            <p className="mt-5 text-[15px] leading-relaxed text-[#9A9CA3] max-w-[220px]">
              Turn LinkedIn creators into your best acquisition channel.
            </p>
            <a
              href="https://www.linkedin.com/company/naanooo/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="mt-6 inline-flex items-center justify-center w-10 h-10 bg-[#26272C] hover:bg-[#32343B] text-white rounded-xl transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>

          {/* Col 2: Product */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold tracking-widest text-[#6E7076] uppercase mb-1">
              PRODUCT
            </div>
            <Link href="/#how-it-works" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/#faq" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              FAQs
            </Link>
            <Link href="/creators" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              For creators
            </Link>
            <Link href="/agencies" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              For agencies
            </Link>
          </div>

          {/* Col 3: Company */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold tracking-widest text-[#6E7076] uppercase mb-1">
              COMPANY
            </div>
            <Link href="/#faq" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Help Center
            </Link>
            <Link href="/#terms" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Privacy & Terms
            </Link>
            <Link href="/#quote" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Customer Stories
            </Link>
            <Link href="/login" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Platform Login
            </Link>
          </div>

          {/* Col 4: Press */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold tracking-widest text-[#6E7076] uppercase mb-1">
              PRESS
            </div>
            <a href="https://www.xymag.tv" target="_blank" rel="noopener noreferrer" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Interview Xymag.tv
            </a>
            <a href="https://foundertrace.fr" target="_blank" rel="noopener noreferrer" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Naano on FounderTrace
            </a>
            <a href="https://technicalbeep.com" target="_blank" rel="noopener noreferrer" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Naano on TechnicalBeep
            </a>
          </div>

          {/* Col 5: Resources */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-bold tracking-widest text-[#6E7076] uppercase mb-1">
              RESOURCES
            </div>
            <Link href="/#marketplace" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              LinkedIn creator marketplace
            </Link>
            <Link href="/creators" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Best B2B influencer platform 2026
            </Link>
            <Link href="/agencies" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Agency workspace setup
            </Link>
            <Link href="/#faq" className="text-[14.5px] text-[#AEB0B6] hover:text-white transition-colors">
              Creator-led growth for B2B
            </Link>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13.5px] text-[#8A8C92]">
          <div>© {new Date().getFullYear()} naano. All rights reserved.</div>
          <div className="flex items-center gap-2 text-[#C7C9CF]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#00B67A">
              <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.5l7.1-.6z" />
            </svg>
            <span>Trustpilot 4.5/5 rating</span>
          </div>
        </div>

        {/* Huge background watermark */}
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 -bottom-16 text-center text-[220px] font-black tracking-tighter text-white/[0.03] select-none pointer-events-none"
        >
          naano
        </div>
      </div>
    </footer>
  );
}
