'use client';

import React, { useState } from 'react';
import { Share2, Check, ArrowRight } from 'lucide-react';

interface PublishCardButtonProps {
  creatorId?: string;
}

export default function PublishCardButton({ creatorId }: PublishCardButtonProps) {
  const [copied, setCopied] = useState(false);

  function handlePublish() {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = creatorId ? `${origin}/card/${creatorId}` : `${origin}/dashboard/creator/profile`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handlePublish}
        className="w-full py-3.5 px-5 bg-[#2864EA] hover:bg-[#1e52c8] text-white rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs transition-all cursor-pointer active:scale-98"
      >
        <div className="flex items-center gap-2.5">
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Deal Link copied to clipboard!' : 'Publish my card'}</span>
        </div>
        <ArrowRight className="w-4 h-4" />
      </button>

      {copied && (
        <p className="text-[11px] text-emerald-600 font-semibold text-center mt-2 animate-in fade-in">
          Link copied! Paste it in your LinkedIn &quot;Custom Button&quot; or &quot;Featured&quot; section.
        </p>
      )}
    </div>
  );
}
