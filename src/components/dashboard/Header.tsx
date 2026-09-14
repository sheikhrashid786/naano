'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Bell } from 'lucide-react';
import UserProfileDropdown from './UserProfileDropdown';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  balance?: number;
  user?: {
    id?: string;
    name?: string;
    avatarUrl?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export default function Header({ title, subtitle, children, balance = 0, user }: HeaderProps) {
  const [lang, setLang] = useState<'EN' | 'FR'>('EN');
  const [currentUser, setCurrentUser] = useState<any>(user || null);

  useEffect(() => {
    if (user) {
      setCurrentUser((prev: any) => ({ ...prev, ...user }));
    }

    // Always fetch live auth profile to guarantee consistency across all pages
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setCurrentUser({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            avatarUrl: data.user.avatarUrl || data.user.creator?.avatarUrl || data.user.company?.logoUrl || null,
            company: data.user.company,
            creator: data.user.creator,
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
        {title && (
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Wallet Balance Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <CreditCard className="w-3.5 h-3.5 text-slate-500" />
          <span>€{balance % 1 === 0 ? balance : balance.toFixed(2)}</span>
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

        {/* Notification Bell Button */}
        <button
          type="button"
          aria-label="Notifications"
          className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5 text-slate-600" />
        </button>

        {/* User Profile Avatar with Online Dot and Hover Popup Menu */}
        <UserProfileDropdown
          user={currentUser}
          balance={balance}
          align="right"
        />

        {children}
      </div>
    </header>
  );
}
