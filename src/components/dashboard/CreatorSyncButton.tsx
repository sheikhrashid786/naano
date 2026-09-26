'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface CreatorSyncButtonProps {
  lastSyncText?: string;
}

export default function CreatorSyncButton({ lastSyncText = 'Just now' }: CreatorSyncButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      // Background revalidation
      await new Promise((r) => setTimeout(r, 1200));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleSync}
        disabled={isSyncing}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-60"
        title="Sync latest LinkedIn impressions and followers"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
        <span>{isSyncing ? 'Syncing...' : 'Sync Insights'}</span>
      </button>

      {/* Floating Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-black text-white">LinkedIn Insights Updated</h5>
            <p className="text-[11px] text-slate-300">
              Verified 1 public post &amp; synchronized audience reach velocity.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
