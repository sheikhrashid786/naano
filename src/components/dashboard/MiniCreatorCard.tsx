'use client';

import React, { useState } from 'react';
import { Calendar, Share2, Check } from 'lucide-react';

interface MiniCreatorCardProps {
  creatorId?: string;
  creatorName: string;
  creatorAvatar: string;
  creatorCountry: string;
  creatorNiche: string;
  creatorHeadline: string;
  formattedFollowers: string;
  creatorPrice: number | string;
}

export default function MiniCreatorCard({
  creatorId,
  creatorName,
  creatorAvatar,
  creatorCountry,
  creatorNiche,
  creatorHeadline,
  formattedFollowers,
  creatorPrice,
}: MiniCreatorCardProps) {
  const [copied, setCopied] = useState(false);

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = creatorId ? `${origin}/card/${creatorId}` : `${origin}/dashboard/creator/profile`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  return (
    <div className="w-full max-w-[320px] mx-auto mt-6 rounded-3xl bg-white shadow-[0_12px_35px_rgba(0,0,0,0.08)] border border-[#E2E8F0] overflow-hidden text-center pb-4 transition-all hover:shadow-lg relative">
      {/* Top curved blue gradient banner */}
      <div className="bg-gradient-to-b from-[#2864EA] to-[#3B82F6] h-20 p-3 relative flex items-start justify-between">
        {/* LinkedIn icon */}
        <div className="w-6 h-6 rounded-md bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-2xs">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z" />
          </svg>
        </div>

        {/* naano logo in center */}
        <div className="flex items-center gap-1 text-white font-black text-sm tracking-tight">
          <span>naano</span>
          <div className="w-1 h-1 rounded-full bg-white/90" />
        </div>

        {/* Country pill & Share button */}
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[10px] font-bold uppercase">
            {creatorCountry}
          </span>
          <button
            type="button"
            onClick={handleShare}
            title={copied ? 'Link copied!' : 'Copy deal link'}
            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs flex items-center justify-center text-white cursor-pointer transition-all active:scale-95"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Share2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Overlapping circular avatar */}
      <div className="-mt-8 mx-auto relative z-10 w-16 h-16 rounded-full border-[3px] border-white shadow-md overflow-hidden bg-slate-100">
        <img
          src={creatorAvatar}
          alt={creatorName}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Creator Name */}
      <h3 className="text-base font-extrabold text-[#111827] mt-2">
        {creatorName}
      </h3>

      {/* Niche */}
      <p className="text-xs font-semibold text-[#64748B] mt-0.5">
        {creatorNiche}
      </p>

      {/* Headline */}
      <p className="text-[11px] text-[#64748B] px-4 mt-2 line-clamp-2 leading-relaxed">
        {creatorHeadline}
      </p>

      {/* Post data status pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5F9] text-[#64748B] text-[10px] font-medium mt-3">
        <Calendar className="w-3 h-3 text-[#94A3B8]" />
        <span>No post data available</span>
      </div>

      {/* Stats Divider & Columns */}
      <div className="h-px bg-[#F1F5F9] mt-4 mb-3" />
      <div className="grid grid-cols-3 divide-x divide-[#F1F5F9] text-center pb-1">
        <div>
          <span className="font-extrabold text-[#111827] text-sm block">
            {formattedFollowers}
          </span>
          <span className="text-[10px] text-[#94A3B8] font-medium block mt-0.5">
            Followers
          </span>
        </div>
        <div>
          <span className="font-extrabold text-[#111827] text-sm block">—</span>
          <span className="text-[10px] text-[#94A3B8] font-medium block mt-0.5">
            Est. impressions
          </span>
        </div>
        <div>
          <span className="font-extrabold text-[#111827] text-sm block">
            €{creatorPrice}
          </span>
          <span className="text-[10px] text-[#94A3B8] font-medium block mt-0.5">
            Chosen cost
          </span>
        </div>
      </div>

      {/* Toast popup when link copied */}
      {copied && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[10px] font-semibold py-1 px-3 rounded-full shadow-lg z-20 animate-in fade-in">
          Deal Link copied!
        </div>
      )}
    </div>
  );
}
