'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const [tab, setTab] = useState<'brands' | 'creators'>('brands');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const brandFaqs = [
    {
      q: 'What is Naano?',
      a: 'Naano is the B2B LinkedIn creator marketplace connecting B2B companies with vetted creators (from about 1,000 to 500,000 followers) who publish LinkedIn content that drives measurable traffic, leads, and pipeline.'
    },
    {
      q: 'How does per-post pricing work?',
      a: 'Each creator sets a fixed price per post, shown with deliverables before you book. You only pay for posts that go live — no surprise retainers or CPM spikes. Platform plans range from Self-Serve (€0/month) to Managed Campaigns (€700/month).'
    },
    {
      q: 'What counts as a qualified click?',
      a: 'To protect your budget and data quality, Naano automatically filters out crawlers, scrapers, and bots, and deduplicates visits (one counted visit per IP address per hour).'
    },
    {
      q: 'What happens if a post overperforms?',
      a: 'The price you agreed to is the price you pay. A post that drives 10x more impressions, clicks, or signups costs nothing extra — the fixed per-post fee already covers it.'
    },
    {
      q: 'How does attribution work?',
      a: 'Naano provides tracked links and integration hooks at every stage of your funnel, so each visitor, demo lead, and pipeline opportunity is credited back to the exact creator post that generated it.'
    }
  ];

  const creatorFaqs = [
    {
      q: 'How do I earn money on Naano?',
      a: 'You get paid a flat fee per post. You set your own rate based on your niche and audience quality, and you see the exact payout amount before accepting any collaboration.'
    },
    {
      q: 'How and when do I get paid?',
      a: 'Once your post is published and the deliverables are approved by the brand, your payout is automatically processed via Stripe Connect directly to your bank account.'
    },
    {
      q: 'Is there a minimum follower requirement?',
      a: 'No high barriers. We care about niche engagement, credibility, and professional audience fit rather than raw vanity follower counts. Many top performers have between 2,000 and 25,000 targeted followers.'
    },
    {
      q: 'Am I free to choose what I post on Naano?',
      a: 'Yes. You maintain full editorial control. Brands provide a brief with angles and hooks, but you write the post in your authentic voice. You can decline any collaboration that does not align with your audience.'
    }
  ];

  const currentList = tab === 'brands' ? brandFaqs : creatorFaqs;

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#FCFCFB] border-b border-[#EBE9E5]/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-wider font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full py-1 px-3 inline-block mb-3">
            FAQs
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#17181C]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-[#55575E]">
            Everything you need to know about working with B2B LinkedIn creators on Naano.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex p-1 bg-[#F0EFEB] rounded-full border border-[#E4E1DC]">
            <button
              onClick={() => {
                setTab('brands');
                setOpenIdx(0);
              }}
              className={`px-6 py-2 rounded-full text-xs font-semibold transition-all ${
                tab === 'brands' ? 'bg-white text-[#17181C] shadow-xs' : 'text-[#6B6D74] hover:text-[#17181C]'
              }`}
            >
              For Brands
            </button>
            <button
              onClick={() => {
                setTab('creators');
                setOpenIdx(0);
              }}
              className={`px-6 py-2 rounded-full text-xs font-semibold transition-all ${
                tab === 'creators' ? 'bg-white text-[#17181C] shadow-xs' : 'text-[#6B6D74] hover:text-[#17181C]'
              }`}
            >
              For Creators
            </button>
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {currentList.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E8E6E2] rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-base text-[#17181C] hover:text-blue-600 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#888] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#55575E] leading-relaxed border-t border-[#F5F4F0]">
                    {item.a}
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
