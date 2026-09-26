'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, Menu, X } from 'lucide-react';
import UserProfileDropdown from './UserProfileDropdown';
import NotificationPopover from './NotificationPopover';
import NaanoLogo from './NaanoLogo';
import { getNavLinks } from './Sidebar';

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
  const [currentUser, setCurrentUser] = useState<any>(user || null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (user) {
      setCurrentUser((prev: any) => ({ ...prev, ...user }));
    }
  }, [user?.id, user?.name, user?.avatarUrl]);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.user) {
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

    return () => {
      isMounted = false;
    };
  }, []);

  const activeAvatar = currentUser?.avatarUrl || user?.avatarUrl;
  const activeName = currentUser?.name || user?.name || 'User';
  const links = getNavLinks(currentUser?.role);

  return (
    <>
      <header className="w-full px-4 sm:px-6 lg:px-10 h-[60px] flex items-center justify-between gap-4 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shrink-0 sticky top-0 z-40 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            aria-label="Toggle mobile menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden w-8 h-8 rounded-xl border border-slate-200/90 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 shadow-2xs active:scale-95 transition-all"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Title or Brand on mobile */}
          <div className="md:hidden">
            <Link href="/" className="inline-flex items-center">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                naano
              </span>
            </Link>
          </div>

          {title && (
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 ml-auto">
          {/* Wallet Balance Pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white/90 text-xs font-bold text-slate-800 shadow-2xs font-mono hover:border-slate-300 transition-colors">
            <div className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-3 h-3 stroke-[2.2]" />
            </div>
            <span>€{balance % 1 === 0 ? balance.toLocaleString() : balance.toFixed(2)}</span>
          </div>


          {/* Interactive Notifications Popover */}
          <NotificationPopover role={currentUser?.role} />

          {/* User Profile Avatar Dropdown */}
          <UserProfileDropdown
            user={currentUser}
            balance={balance}
            align="right"
          />

          {children}
        </div>
      </header>

      {/* Slide-out Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Pane */}
          <aside className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-10 flex flex-col justify-between p-5 animate-in slide-in-from-left duration-200 overflow-y-auto">
            <div className="space-y-6">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center"
                >
                  <NaanoLogo />
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-xl border border-slate-200/80 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const active = pathname === link.href;

                  return (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                        active
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Profile Section */}
            <div className="border-t border-slate-100 pt-4 mt-6">
              <UserProfileDropdown
                user={currentUser}
                align="sidebar"
                showName={true}
              />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
