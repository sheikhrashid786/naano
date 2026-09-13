'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Bell } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  balance?: number;
  user?: {
    name?: string;
    avatarUrl?: string | null;
  };
}

export default function Header({ title, subtitle, children, balance = 0, user }: HeaderProps) {
  const [lang, setLang] = useState<'EN' | 'FR'>('EN');
  const [currentUser, setCurrentUser] = useState<any>(user || null);

  useEffect(() => {
    if (user?.avatarUrl && user?.name) {
      setCurrentUser(user);
    }

    // Always fetch live auth profile to guarantee consistency across all pages
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser({
            name: data.user.name,
            avatarUrl: data.user.avatarUrl || data.user.creator?.avatarUrl || data.user.company?.logoUrl || null,
          });
        }
      })
      .catch(() => {});
  }, [user]);

  const activeAvatar = currentUser?.avatarUrl || user?.avatarUrl;
  const activeName = currentUser?.name || user?.name || 'User';

  return (
    <header className="w-full px-6 sm:px-8 lg:px-10 h-[58px] flex items-center justify-between gap-4 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {title ? (
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-2xs text-xs font-semibold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-[#2563EB]" />
            <span className="font-bold tracking-tight text-[#0F172A]">NAANO MCP</span>
            <span className="text-slate-300 font-light">/</span>
            <span className="text-slate-600 hover:text-[#2563EB] cursor-pointer flex items-center gap-0.5">
              Connect &rarr;
            </span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Wallet Balance Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <CreditCard className="w-3.5 h-3.5 text-slate-500" />
          <span>€{balance.toFixed(2)}</span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center p-0.5 rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <button
            type="button"
            onClick={() => setLang('EN')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              lang === 'EN' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('FR')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              lang === 'FR' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            FR
          </button>
        </div>

        {/* Onboarding Progress Pill (Get Started) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl border border-slate-200 bg-white text-xs shadow-2xs">
          <span className="text-blue-500 text-sm">☼</span>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-400 block leading-tight">
              GET STARTED
            </span>
            <span className="text-[11px] font-bold text-slate-700 block truncate max-w-[130px] leading-tight">
              Book or negotiate wi...
            </span>
          </div>
          <span className="w-5 h-5 rounded-full border border-blue-500 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0 ml-1">
            2/7
          </span>
        </div>

        {/* Notification Bell Button with badge */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-slate-600" />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
            1
          </span>
        </div>

        {/* User Profile Avatar with Online Dot */}
        <div className="relative cursor-pointer">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            {activeAvatar ? (
              <img
                src={activeAvatar}
                alt={activeName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <span>{activeName.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        {children}
      </div>
    </header>
  );
}
