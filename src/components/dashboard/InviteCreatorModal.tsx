'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Send, Loader2, Sparkles } from 'lucide-react';

interface Creator {
  id: string;
  pricePerPost: number;
  fitScore: number;
  user: {
    name: string;
  };
}

interface Campaign {
  id: string;
  title: string;
  budgetPerPost: number;
}

interface InviteCreatorModalProps {
  creator: Creator;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InviteCreatorModal({
  creator,
  onClose,
  onSuccess,
}: InviteCreatorModalProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [pitchMessage, setPitchMessage] = useState(
    `Hi ${creator.user.name}, we would love to collaborate with you on our upcoming campaign. Your audience alignment with our target buyers is fantastic.`
  );
  const [customRate, setCustomRate] = useState(creator.pricePerPost.toString());
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const res = await fetch('/api/campaigns');
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.campaigns || []);
          if (data.campaigns?.length > 0) {
            setSelectedCampaignId(data.campaigns[0].id);
          }
        }
      } catch (e) {
      } finally {
        setFetching(false);
      }
    }
    loadCampaigns();
  }, []);

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCampaignId) {
      setError('Please select or create a campaign first');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaignId,
          creatorId: creator.id,
          pitchMessage,
          customRate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{creator.fitScore}% Match Fit</span>
          </span>
        </div>

        <h3 className="text-lg font-bold text-[#111827]">
          Invite {creator.user.name} to Collaborate
        </h3>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Send a direct collaboration request with agreed fixed deliverable rate.
        </p>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSendInvite} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Select Campaign Brief
            </label>
            {fetching ? (
              <div className="h-10 bg-gray-100 animate-pulse rounded-xl" />
            ) : campaigns.length === 0 ? (
              <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                You do not have any active campaigns yet.{' '}
                <Link href="/dashboard/company/campaigns/new" className="font-bold underline">
                  Create one first →
                </Link>
              </div>
            ) : (
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} (€{c.budgetPerPost}/post)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Fixed Fee Offer (€ EUR)
            </label>
            <input
              type="number"
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Personalized Pitch / Invitation Message
            </label>
            <textarea
              rows={3}
              value={pitchMessage}
              onChange={(e) => setPitchMessage(e.target.value)}
              className="w-full bg-white border border-[#D1D5DB] rounded-xl px-4 py-2.5 text-sm text-[#111827] focus:outline-none focus:border-blue-600 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#4B5563] hover:text-[#111827]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || campaigns.length === 0}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Send Invitation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
