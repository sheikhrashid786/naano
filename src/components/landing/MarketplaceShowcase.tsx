import React from 'react';
import Link from 'next/link';
import { Lock, Users, Globe2, TrendingUp } from 'lucide-react';

export default function MarketplaceShowcase() {
  return (
    <section id="marketplace" className="py-24 bg-[#FAF9F6] border-y border-[#EBE9E5]/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 rounded-full py-1 px-3 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>The Naano creator marketplace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17181C]">
            Work with all the best creators.
          </h2>
          <p className="mt-4 text-lg text-[#55575E]">
            Find the right B2B voices, compare their audience fit, and book every collaboration from one place.
          </p>
        </div>

        {/* Product Shell with Real Clean Screenshot */}
        <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(23,24,28,0.12)] border border-[#E4E1DC] bg-white mb-14">
          {/* macOS Browser Chrome */}
          <div className="bg-[#F6F5F2] border-b border-[#E8E6E2] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>

            <div className="flex items-center gap-2 bg-white border border-[#E0DED9] rounded-lg px-4 py-1 text-xs text-[#55575E] font-mono shadow-2xs">
              <Lock className="w-3 h-3 text-[#9CA3AF]" />
              <span>naano.com/marketplace</span>
            </div>

            <div className="w-10" />
          </div>

          {/* Genuine Marketplace Screenshot */}
          <div className="relative bg-[#F8FAFC]">
            <img
              src="/lp/marketplace-screenshot-clean-v2.png"
              alt="Naano B2B Creator Marketplace"
              className="w-full h-auto block object-cover"
            />
          </div>
        </div>

        {/* 3 Value Proposition Signal Cards with Avatars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 3,000+ vetted creators */}
          <div className="bg-white rounded-2xl border border-[#E8E6E2] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center -space-x-2 mb-4">
                <img src="/lp/avatar-a.png" alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <img src="/lp/avatar-b.png" alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <img src="/lp/avatar-c.png" alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <img src="/lp/avatar-d.png" alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                <img src="/lp/avatar-e.png" alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              </div>
              <h4 className="text-base font-bold text-[#17181C]">3,000+ vetted creators</h4>
              <p className="text-xs sm:text-sm text-[#55575E] mt-1.5 leading-relaxed">
                Specialist B2B voices, ready to collaborate.
              </p>
            </div>
          </div>

          {/* Card 2: Across 100 countries */}
          <div className="bg-white rounded-2xl border border-[#E8E6E2] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#17181C]">Across 100 countries</h4>
              <p className="text-xs sm:text-sm text-[#55575E] mt-1.5 leading-relaxed">
                Local expertise with genuinely global reach.
              </p>
            </div>
          </div>

          {/* Card 3: Matched to your buyers */}
          <div className="bg-white rounded-2xl border border-[#E8E6E2] p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[#17181C]">Matched to your buyers</h4>
              <p className="text-xs sm:text-sm text-[#55575E] mt-1.5 leading-relaxed">
                Audience fit comes before follower count.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
