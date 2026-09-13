'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function CardShareIcon() {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const url = typeof window !== 'undefined' ? `${window.location.origin}/creators` : 'https://naano.com/creators';
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Share card"
      title={copied ? 'Copied!' : 'Copy card link'}
      className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white cursor-pointer hover:bg-white/30 transition-colors"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Share2 className="w-3 h-3" />}
    </button>
  );
}
