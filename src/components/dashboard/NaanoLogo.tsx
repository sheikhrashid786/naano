import React from 'react';

export default function NaanoLogo({ className = 'h-6' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/lp/naano-mark.png"
        alt="naano"
        className="h-6 w-auto object-contain shrink-0"
      />
      <span className="text-xl font-bold tracking-tight text-[#111827] font-sans">
        naano
      </span>
    </div>
  );
}
