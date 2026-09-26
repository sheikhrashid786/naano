'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NaanoLogo from './NaanoLogo';
import {
  LayoutGrid,
  Contact,
  Store,
  Layers,
  TrendingUp,
  Users,
  CreditCard,
  Percent,
  MessageSquare,
  Briefcase,
  BookOpen,
  Settings,
} from 'lucide-react';
import UserProfileDropdown from './UserProfileDropdown';

interface SidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'COMPANY' | 'CREATOR' | 'ADMIN';
    avatarUrl?: string | null;
    company?: {
      name: string;
      industry?: string | null;
      targetIndustries?: string | null;
      logoUrl?: string | null;
    } | null;
    creator?: {
      headline?: string | null;
      niche?: string | null;
      avatarUrl?: string | null;
    } | null;
  };
}

const creatorNav = [
  { label: 'Overview', href: '/dashboard/creator', icon: LayoutGrid },
  { label: 'My card', href: '/dashboard/creator/profile', icon: Contact },
  { label: 'Opportunities', href: '/dashboard/creator/marketplace', icon: Store },
  { label: 'Collaborations', href: '/dashboard/creator/collabs', icon: Layers },
  { label: 'Analytics', href: '/dashboard/creator/analytics', icon: TrendingUp },
  { label: 'Community', href: '/dashboard/creator/community', icon: Users },
  { label: 'Earnings', href: '/dashboard/creator/gains', icon: CreditCard },
  { label: 'Affiliate program', href: '/dashboard/creator/affiliate', icon: Percent },
  { label: 'Messages', href: '/dashboard/creator/messages', icon: MessageSquare },
];

const companyNav = [
  { label: 'Overview', href: '/dashboard/company', icon: LayoutGrid },
  { label: 'Browse Creators', href: '/dashboard/company/marketplace', icon: Users },
  { label: 'Campaigns', href: '/dashboard/company/campaigns', icon: Briefcase },
  { label: 'Collaborations', href: '/dashboard/company/collabs', icon: Layers },
  { label: 'Results', href: '/dashboard/company/results', icon: TrendingUp },
  { label: 'Messages', href: '/dashboard/company/messages', icon: MessageSquare },
  { label: 'Billing', href: '/dashboard/company/billing', icon: CreditCard },
];

const adminNav = [
  { label: 'Overview', href: '/dashboard/admin', icon: LayoutGrid },
  { label: 'Users & Roles', href: '/dashboard/admin/users', icon: Users },
  { label: 'Creators', href: '/dashboard/admin/creators', icon: Contact },
  { label: 'Companies', href: '/dashboard/admin/companies', icon: Briefcase },
  { label: 'Campaigns', href: '/dashboard/admin/campaigns', icon: Store },
  { label: 'Collaborations', href: '/dashboard/admin/collabs', icon: Layers },
  { label: 'Escrow & Payouts', href: '/dashboard/admin/finances', icon: CreditCard },
  { label: 'Journal & Blogs', href: '/dashboard/admin/blogs', icon: BookOpen },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
];

export function getNavLinks(role?: string) {
  if (role === 'ADMIN') return adminNav;
  if (role === 'COMPANY') return companyNav;
  return creatorNav;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const isCompany = user.role === 'COMPANY';
  const links = getNavLinks(user.role);

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`hidden md:flex bg-white/95 backdrop-blur-md border-r border-slate-200/80 flex-col justify-between shrink-0 h-screen sticky top-0 z-40 transition-all duration-200 ease-in-out ${
        isHovered ? 'w-64 shadow-xl' : 'w-[72px]'
      }`}
    >
      <div className="w-full">
        {/* Brand Logo Header */}
        <div
          className={`h-[60px] flex items-center border-b border-slate-200/80 ${
            isHovered ? 'px-6 justify-between' : 'justify-center px-0'
          }`}
        >
          <Link href="/" className="inline-flex items-center transition-all hover:opacity-90">
            {isHovered ? (
              <NaanoLogo />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-emerald-600/25">
                N
              </div>
            )}
          </Link>

          {isHovered && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono">
              {user.role === 'ADMIN' ? 'Admin' : isCompany ? 'Brand' : 'Creator'}
            </span>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`py-4 space-y-1 ${isHovered ? 'px-3' : 'px-2.5 flex flex-col items-center'}`}>
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            if (!isHovered) {
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  title={link.label}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} />
                </Link>
              );
            }

            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all group ${
                  active
                    ? 'text-emerald-800 font-bold bg-emerald-50/80 border-l-2 border-emerald-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-semibold'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-xl transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 group-hover:text-slate-700 group-hover:scale-105'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={active ? 2.2 : 1.8} />
                </div>
                <span className="truncate whitespace-nowrap">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile Section */}
      <div
        className={`border-t border-slate-200/80 bg-slate-50/40 ${
          isHovered ? 'p-3' : 'py-3 flex justify-center'
        }`}
      >
        <UserProfileDropdown
          user={user}
          align="sidebar"
          showName={isHovered}
        />
      </div>
    </aside>
  );
}
