'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Check, ShieldCheck, FileText, ArrowRight, DollarSign, Sparkles } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
  type: 'escrow' | 'draft' | 'invite' | 'system';
}

interface NotificationPopoverProps {
  role?: string | null;
}

export default function NotificationPopover({ role }: NotificationPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Role-appropriate seed notifications
  const initialNotifications: NotificationItem[] =
    role === 'CREATOR'
      ? [
          {
            id: 'n1',
            title: 'Campaign Sponsorship Offer',
            message: 'ScaleGen AI invited you to feature their outbound stack in a sponsored post (€350).',
            time: '10m ago',
            read: false,
            link: '/dashboard/creator/collaborations',
            type: 'invite',
          },
          {
            id: 'n2',
            title: 'Escrow Guarantee Funded',
            message: 'Funds (€250) have been safely deposited in escrow for your upcoming LinkedIn post.',
            time: '2h ago',
            read: false,
            link: '/dashboard/creator/collaborations',
            type: 'escrow',
          },
          {
            id: 'n3',
            title: 'Profile Insights Synced',
            message: 'Public reach and follower impressions velocity updated successfully.',
            time: '1d ago',
            read: true,
            link: '/dashboard/creator/profile',
            type: 'system',
          },
        ]
      : role === 'ADMIN'
      ? [
          {
            id: 'n1',
            title: 'Escrow Payout Authorized',
            message: '€1,200 across 3 completed deliverables pending supervisor release.',
            time: '5m ago',
            read: false,
            link: '/dashboard/admin/finances',
            type: 'escrow',
          },
          {
            id: 'n2',
            title: 'New Creator Profile',
            message: 'Full-stack developer registered with 48.5K followers.',
            time: '1h ago',
            read: false,
            link: '/dashboard/admin/creators',
            type: 'system',
          },
        ]
      : [
          {
            id: 'n1',
            title: 'Post Draft Ready for Review',
            message: 'Eric Nowosielski submitted draft copy for your B2B SaaS campaign.',
            time: '15m ago',
            read: false,
            link: '/dashboard/company/collabs',
            type: 'draft',
          },
          {
            id: 'n2',
            title: 'Escrow Deposit Secured',
            message: 'Escrow protection active for 2 contracted creator deliverables.',
            time: '3h ago',
            read: false,
            link: '/dashboard/company/billing',
            type: 'escrow',
          },
          {
            id: 'n3',
            title: 'Live Post Verified',
            message: 'LinkedIn post has gone live. Real-time impressions indexing active.',
            time: '1d ago',
            read: true,
            link: '/dashboard/company/results',
            type: 'system',
          },
        ];

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'escrow':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-600" />;
      case 'draft':
        return <FileText className="w-3.5 h-3.5 text-emerald-700" />;
      case 'invite':
        return <Sparkles className="w-3.5 h-3.5 text-teal-600" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative w-8 h-8 rounded-xl border border-slate-200/90 bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer active:scale-95"
      >
        <Bell className="w-3.5 h-3.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white animate-pulse" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200/80">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Mark read</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  onClick={() => {
                    markItemAsRead(item.id);
                    setIsOpen(false);
                  }}
                  className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-50/80 block ${
                    !item.read ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs truncate ${
                          !item.read ? 'font-black text-slate-900' : 'font-semibold text-slate-700'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                  {!item.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 self-center" />
                  )}
                </Link>
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-slate-100 bg-slate-50/60 text-center">
            <span className="text-[11px] font-medium text-slate-400">
              Naano Live Real-Time Escrow & Activity Feed
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
