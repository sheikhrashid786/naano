'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Copy, Share2, Check } from 'lucide-react';

interface CreatorCardActionsProps {
  creatorId?: string;
}

export default function CreatorCardActions({ creatorId }: CreatorCardActionsProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/creators`;
    }
    return 'https://naano.com/creators';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    const url = getShareUrl();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'My Naano Creator Card',
          text: 'Book my LinkedIn sponsored posts on Naano',
          url,
        });
        return;
      } catch {
        // Fallback
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-col gap-2 shrink-0 w-[128px]">
      <Link
        href="/dashboard/creator/profile"
        className="w-full px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-semibold text-[#334155] shadow-2xs flex items-center gap-2 transition-colors justify-start"
      >
        <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
        <span className="truncate">Open card</span>
      </Link>
      <button
        type="button"
        onClick={handleCopy}
        className="w-full px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-semibold text-[#334155] shadow-2xs flex items-center gap-2 transition-colors cursor-pointer justify-start"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-emerald-600 truncate">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <span className="truncate">Copy card link</span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={handleShare}
        className="w-full py-1.5 px-3 rounded-xl bg-[#2864EA] hover:bg-[#1f56d4] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors cursor-pointer justify-start"
      >
        {shared ? (
          <>
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Share my card</span>
          </>
        )}
      </button>
    </div>
  );
}
