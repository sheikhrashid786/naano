'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'Protection',
      q: 'How does escrow protection guarantee our campaign budget?',
      a: 'When you invite a creator, your campaign funds are secured in an escrow holding vault. The creator does not receive payout until they submit the live LinkedIn post URL and proof of publication for your review and approval. If a creator fails to publish, you receive a 100% refund immediately.',
    },
    {
      category: 'Creators',
      q: 'How are creators vetted before appearing on Naano?',
      a: 'We review LinkedIn creator accounts across 4 key criteria: organic engagement authenticity (no automated pods), verified professional background in B2B tech, historical post consistency, and audience ICP overlap. Only ~12% of applicants pass our vetting process.',
    },
    {
      category: 'Attribution',
      q: 'How does attribution and UTM tracking work on LinkedIn?',
      a: 'LinkedIn’s algorithm penalizes external links inside the main post body. Naano creators follow B2B best practices by sharing authentic insights in the post and placing your tracked link with custom UTM parameters in the first comment, driving 3-5x higher engagement and clear attribution in your analytics.',
    },
    {
      category: 'Pricing',
      q: 'Are rates fixed or negotiable?',
      a: 'Every creator on Naano defines their own transparent, fixed rate per post (typically €150 to €500 depending on audience size and seniority). You can also propose custom rates when creating targeted campaign briefs.',
    },
    {
      category: 'Compliance',
      q: 'Do sponsored posts comply with LinkedIn guidelines?',
      a: 'Yes. All collaborations follow standard commercial influencer disclosures (#ad / #sponsored / #partnership), ensuring full compliance with LinkedIn terms of service and European/US advertising standards.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#EBF1EE] border-b border-slate-200/80 section-even scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Everything you need to know about working with B2B LinkedIn creators on Naano.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all duration-200 hover:border-emerald-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 uppercase tracking-wider">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
