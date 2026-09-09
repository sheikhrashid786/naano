'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NaanoLogo from './NaanoLogo';
import {
  LayoutDashboard,
  Contact,
  Store,
  Layers,
  TrendingUp,
  Users,
  Wallet,
  Percent,
  MessageSquare,
  Briefcase,
  Target,
  CreditCard,
} from 'lucide-react';

interface SidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'COMPANY' | 'CREATOR' | 'ADMIN';
    company?: {
      name: string;
      industry?: string | null;
      targetIndustries?: string | null;
    } | null;
    creator?: {
      headline?: string | null;
      niche?: string | null;
    } | null;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isCompany = user.role === 'COMPANY';

  const creatorNav = [
    { label: 'Overview', href: '/dashboard/creator', icon: LayoutDashboard },
    { label: 'My card', href: '/dashboard/creator/profile', icon: Contact },
    { label: 'Opportunities', href: '/dashboard/creator/marketplace', icon: Store },
    { label: 'Collaborations', href: '/dashboard/creator/collabs', icon: Layers },
    { label: 'Analytics', href: '/dashboard/creator/gains', icon: TrendingUp },
    { label: 'Community', href: '/dashboard/creator/community', icon: Users },
    { label: 'Earnings', href: '/dashboard/creator/gains', icon: Wallet },
    { label: 'Affiliate program', href: '/dashboard/creator/affiliate', icon: Percent },
    { label: 'Messages', href: '/dashboard/creator/messages', icon: MessageSquare },
  ];

  const companyNav = [
    { label: 'Overview', href: '/dashboard/company', icon: LayoutDashboard },
    { label: 'Browse Creators', href: '/dashboard/company/marketplace', icon: Users },
    { label: 'Campaigns', href: '/dashboard/company/campaigns', icon: Briefcase },
    { label: 'Collaborations', href: '/dashboard/company/collabs', icon: Layers },
    { label: 'Analytics', href: '/dashboard/company/collabs', icon: TrendingUp },
    { label: 'Messages', href: '/dashboard/company/messages', icon: MessageSquare },
    { label: 'ICP Matching', href: '/dashboard/company/settings', icon: Target },
    { label: 'Finances', href: '/dashboard/company/finances', icon: CreditCard },
  ];

  const links = isCompany ? companyNav : creatorNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-transparent">
          <Link href="/" className="inline-block">
            <NaanoLogo />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-2 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all group ${
                  active
                    ? 'text-blue-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Role Pill at Bottom */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 px-2 py-1">
          <span className="font-semibold text-slate-700 truncate">{user.name}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {user.role}
          </span>
        </div>
      </div>
    </aside>
  );
}
