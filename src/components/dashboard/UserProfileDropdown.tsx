'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CreditCard,
  LogOut,
  User,
  Layers,
  Store,
  MessageSquare,
  LayoutGrid,
  Users,
  Briefcase,
  ChevronRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';

export interface UserProfileData {
  id?: string;
  name?: string;
  email?: string;
  role?: 'CREATOR' | 'COMPANY' | 'ADMIN' | string;
  avatarUrl?: string | null;
  company?: any;
  creator?: any;
}

interface UserProfileDropdownProps {
  user?: UserProfileData | null;
  balance?: number;
  align?: 'right' | 'left' | 'sidebar';
  showName?: boolean;
}

export default function UserProfileDropdown({
  user,
  balance = 0,
  align = 'right',
  showName = false,
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Clear debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close on escape or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 220); // 220ms smooth bridge
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/login';
    }
  };

  // Determine user mode / role
  const isCreatorView =
    user?.role === 'CREATOR' ||
    Boolean(user?.creator) ||
    pathname.startsWith('/dashboard/creator');

  const activeAvatar =
    user?.avatarUrl ||
    user?.creator?.avatarUrl ||
    user?.company?.logoUrl ||
    null;

  const activeName = user?.name || (isCreatorView ? 'Creator' : 'Brand');
  const activeEmail = user?.email || (isCreatorView ? 'creator@naano.io' : 'brand@naano.io');

  // Navigation options based on current dashboard context
  const creatorLinks = [
    {
      label: 'My Public Card',
      desc: 'View and share your media kit',
      href: '/dashboard/creator/profile',
      icon: User,
    },
    {
      label: 'Opportunities',
      desc: 'Discover active brand campaigns',
      href: '/dashboard/creator/marketplace',
      icon: Store,
    },
    {
      label: 'Collaborations',
      desc: 'Track submissions & payouts',
      href: '/dashboard/creator/collabs',
      icon: Layers,
    },
    {
      label: 'Earnings & Gains',
      desc: `Wallet balance €${balance.toFixed(2)}`,
      href: '/dashboard/creator/gains',
      icon: CreditCard,
    },
    {
      label: 'Messages',
      desc: 'Brand conversations & offers',
      href: '/dashboard/creator/messages',
      icon: MessageSquare,
    },
  ];

  const companyLinks = [
    {
      label: 'Brand Overview',
      desc: 'Key performance metrics',
      href: '/dashboard/company',
      icon: LayoutGrid,
    },
    {
      label: 'Browse Creators',
      desc: 'Explore and hire verified talent',
      href: '/dashboard/company/marketplace',
      icon: Users,
    },
    {
      label: 'Campaigns',
      desc: 'Manage briefs and budgets',
      href: '/dashboard/company/campaigns',
      icon: Briefcase,
    },
    {
      label: 'Collaborations',
      desc: 'Review submitted content',
      href: '/dashboard/company/collabs',
      icon: Layers,
    },
    {
      label: 'Billing & Wallet',
      desc: `Account funds €${balance.toFixed(2)}`,
      href: '/dashboard/company/billing',
      icon: CreditCard,
    },
    {
      label: 'Messages',
      desc: 'Direct creator communications',
      href: '/dashboard/company/messages',
      icon: MessageSquare,
    },
  ];

  const links = isCreatorView ? creatorLinks : companyLinks;

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${showName ? 'w-full block' : 'inline-block'}`}
    >
      {/* Trigger Avatar Button */}
      {showName ? (
        <button
          type="button"
          onClick={handleToggle}
          aria-label="User Profile Menu"
          aria-expanded={isOpen}
          className={`w-full relative flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all duration-200 outline-none cursor-pointer text-left ${
            isOpen
              ? 'bg-blue-50/80 text-slate-900 ring-1 ring-blue-200 shadow-2xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {activeAvatar ? (
                <img
                  src={activeAvatar}
                  alt={activeName}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <span className="tracking-tight">{activeName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>
          <div className="min-w-0 flex-1 truncate">
            <div className="text-xs font-bold text-slate-800 truncate leading-tight">
              {activeName}
            </div>
            <div className="text-[10px] text-slate-400 font-medium truncate leading-tight mt-0.5">
              {isCreatorView ? 'Creator' : 'Brand'}
            </div>
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          aria-label="User Profile Menu"
          aria-expanded={isOpen}
          className={`relative flex items-center justify-center rounded-full p-0.5 transition-all duration-200 outline-none cursor-pointer group ${
            isOpen
              ? 'ring-2 ring-[#2563EB] ring-offset-2 ring-offset-white scale-105'
              : 'hover:ring-2 hover:ring-slate-300 hover:ring-offset-1 ring-offset-white'
          }`}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] text-white font-bold flex items-center justify-center text-xs shadow-xs">
            {activeAvatar ? (
              <img
                src={activeAvatar}
                alt={activeName}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <span className="tracking-tight">{activeName.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          {/* Online Indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </button>
      )}

      {/* Invisible hover bridge to prevent cursor dropout */}
      {isOpen && (
        <div
          className={
            align === 'sidebar'
              ? 'absolute top-0 left-full w-4 h-full'
              : 'absolute top-full right-0 h-3 w-full'
          }
          aria-hidden="true"
        />
      )}

      {/* Profile Popup Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 w-76 sm:w-80 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.16)] overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
            align === 'sidebar'
              ? 'left-full bottom-0 ml-3.5 mb-0'
              : align === 'left'
              ? 'left-0 top-full mt-2.5'
              : 'right-0 top-full mt-2.5'
          }`}
        >
          {/* Header Card: User Info */}
          <div className="p-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
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
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-slate-900 text-sm tracking-tight truncate">
                    {activeName}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{activeEmail}</p>
              </div>
            </div>

            {/* Account Type Badge & Wallet Pill */}
            <div className="mt-3 flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100/80">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-tight border ${
                  isCreatorView
                    ? 'bg-purple-50/80 text-purple-700 border-purple-200/70'
                    : 'bg-blue-50/80 text-blue-700 border-blue-200/70'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCreatorView ? 'bg-purple-600' : 'bg-blue-600'
                  }`}
                />
                {isCreatorView ? 'Creator Account' : 'Brand Account'}
              </span>

              <Link
                href={isCreatorView ? '/dashboard/creator/gains' : '/dashboard/company/billing'}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs transition-colors"
                title="View wallet & billing"
              >
                <CreditCard className="w-3 h-3 text-slate-400" />
                <span>€{balance.toFixed(2)}</span>
              </Link>
            </div>
          </div>

          {/* Quick Nav Items */}
          <div className="p-2 space-y-0.5">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick Navigation
            </div>
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all group ${
                    isActive
                      ? 'bg-blue-50/70 text-[#2563EB] font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-[#2563EB]'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="truncate leading-tight">{item.label}</div>
                      <div className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                      isActive
                        ? 'text-[#2563EB]'
                        : 'text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 my-1" />

          {/* Logout Action Row */}
          <div className="p-2 pt-0.5">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 transition-all group cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-100/70 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-100 group-hover:scale-105 transition-all">
                  <LogOut className="w-3.5 h-3.5" />
                </div>
                <span>{isLoggingOut ? 'Logging out...' : 'Log out'}</span>
              </div>
              <span className="text-[11px] text-rose-400 group-hover:text-rose-600 font-medium">
                End session &rarr;
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
