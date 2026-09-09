'use client';

import React, { useState } from 'react';
import NotificationDrawer from './NotificationDrawer';
import { CreditCard } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  user?: {
    name?: string;
    avatarUrl?: string | null;
  };
}

export default function Header({ title, subtitle, children, user }: HeaderProps) {
  const [lang, setLang] = useState<'EN' | 'FR'>('EN');

  return (
    <header className="px-8 py-4 flex items-center justify-between gap-4 bg-transparent">
      {/* Optional Left Title/Subtitle */}
      <div>
        {title && (
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
        )}
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Wallet Balance Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-2xs text-xs font-semibold text-slate-700">
          <CreditCard className="w-3.5 h-3.5 text-slate-500" />
          <span>€0</span>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center p-0.5 rounded-full border border-slate-200 bg-white shadow-2xs text-[11px] font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setLang('EN')}
            className={`px-2 py-1 rounded-full transition-all ${
              lang === 'EN' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('FR')}
            className={`px-2 py-1 rounded-full transition-all ${
              lang === 'FR' ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:text-slate-900'
            }`}
          >
            FR
          </button>
        </div>

        {/* Notification Drawer */}
        <NotificationDrawer />

        {/* User Avatar with Online Dot */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name || 'User'} className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name ? user.name.slice(0, 2).toUpperCase() : 'UD'}</span>
            )}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        {children}
      </div>
    </header>
  );
}
