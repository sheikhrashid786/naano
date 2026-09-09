import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function TrustBar() {
  const brands = [
    { name: 'lemlist', type: 'SaaS', highlight: false },
    { name: 'Attio', type: 'CRM', highlight: false },
    { name: 'Folk', type: 'Modern CRM', highlight: false },
    { name: 'Leadbay', type: 'AI Sales', highlight: false },
    { name: 'Ringover', type: 'Telecom', highlight: false },
    { name: 'LaGrowthMachine', type: 'Multichannel', highlight: false },
    { name: 'GojiBerry', type: 'Analytics', highlight: false },
    { name: 'ChatSEO', type: 'AI Search', highlight: false },
  ];

  return (
    <div className="w-full py-6 overflow-hidden border-y border-[#EBE9E5]/60 bg-white/40 backdrop-blur-sm">
      <div className="flex items-center gap-8 animate-marquee">
        {/* Case Study Badge */}
        <Link
          href="#quote"
          className="inline-flex items-center gap-3 bg-white border border-[#E4E1DC] shadow-sm rounded-full py-1.5 pl-4 pr-3 text-xs font-semibold text-[#17181C] hover:border-blue-400 transition-colors shrink-0"
        >
          <span className="font-bold tracking-tight">BlogSEO</span>
          <span className="bg-neutral-100 text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            CASE STUDY <ArrowUpRight className="w-3 h-3" />
          </span>
        </Link>

        {brands.map((brand, idx) => (
          <div
            key={`b1-${idx}`}
            className="flex items-center gap-2 px-6 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <span className="text-xl font-bold tracking-tight text-[#17181C]">{brand.name}</span>
          </div>
        ))}

        {/* Repeat once for seamless infinite loop */}
        <Link
          href="#quote"
          className="inline-flex items-center gap-3 bg-white border border-[#E4E1DC] shadow-sm rounded-full py-1.5 pl-4 pr-3 text-xs font-semibold text-[#17181C] hover:border-blue-400 transition-colors shrink-0"
        >
          <span className="font-bold tracking-tight">BlogSEO</span>
          <span className="bg-neutral-100 text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            CASE STUDY <ArrowUpRight className="w-3 h-3" />
          </span>
        </Link>

        {brands.map((brand, idx) => (
          <div
            key={`b2-${idx}`}
            className="flex items-center gap-2 px-6 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <span className="text-xl font-bold tracking-tight text-[#17181C]">{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
