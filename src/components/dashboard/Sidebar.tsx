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

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const isCompany = user.role === 'COMPANY';

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

  const links = isCompany ? companyNav : creatorNav;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white border-r border-[#E2E8F0] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-40 transition-all duration-200 ease-in-out ${
        isHovered ? 'w-60 shadow-xl' : 'w-[68px]'
      }`}
    >
      <div className="w-full">
        {/* Brand Logo Header matching Header height (58px) and border */}
        <div
          className={`h-[58px] flex items-center border-b border-[#E2E8F0] ${
            isHovered ? 'px-6 justify-start' : 'justify-center px-0'
          }`}
        >
          <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-85">
            {isHovered ? (
              <NaanoLogo />
            ) : (
              <img
                src="/lp/naano-mark.png"
                alt="naano"
                className="h-6 w-auto object-contain shrink-0"
              />
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className={`py-3 space-y-1 ${isHovered ? 'px-3.5' : 'px-2.5 flex flex-col items-center'}`}>
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            if (!isHovered) {
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  title={link.label}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    active
                      ? 'bg-[#EFF6FF] text-[#2864EA]'
                      : 'text-[#64748B] hover:text-[#111827] hover:bg-slate-50'
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
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                  active
                    ? 'text-[#2864EA] font-bold'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-slate-50/80 font-medium'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                    active ? 'bg-[#EFF6FF] text-[#2864EA]' : 'text-[#64748B]'
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
        className={`border-t border-[#E2E8F0] ${
          isHovered ? 'p-2.5' : 'py-3 flex justify-center'
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
