import React from 'react';

export default function NaanoLogo({ className = "h-6" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Authentic Naano Dual-Wing / Ribbon Mark */}
        <path
          d="M6 10C6 7.79086 7.79086 6 10 6H16L12 14H6V10Z"
          fill="#000000"
        />
        <path
          d="M26 22C26 24.2091 24.2091 26 22 26H16L20 18H26V22Z"
          fill="#000000"
        />
        <path
          d="M12 14L20 18H14L10 14H12Z"
          fill="#000000"
        />
      </svg>
      <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
        naano
      </span>
    </div>
  );
}
