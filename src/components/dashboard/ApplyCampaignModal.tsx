'use client';

import React, { useState } from 'react';
import { X, Send, Loader2, Sparkles } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  budgetPerPost: number;
  deliverables?: string | null;
  company: {
    name: string;
  };
}

interface ApplyCampaignModalProps {
  campaign: Campaign;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplyCampaignModal({
  campaign,
  onClose,
  onSuccess,
}: ApplyCampaignModalProps) {
  const [pitchMessage, setPitchMessage] = useState(
    `Hi ${campaign.company.name}! I love your product and would like to cover it in a dedicated case-study LinkedIn post for my audience.`
  );
  const [customRate, setCustomRate] = useState(campaign.budgetPerPost.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign.id,
          pitchMessage,
          customRate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application');
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

        <h3 className="text-lg font-bold text-[#111827]">
          Apply to {campaign.company.name}
        </h3>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Campaign: <span className="font-semibold text-[#111827]">{campaign.title}</span>
        </p>

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5">
              Your Deliverable Rate (€ EUR)
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
              Pitch / Post Idea
            </label>
            <textarea
              rows={4}
              value={pitchMessage}
              onChange={(e) => setPitchMessage(e.target.value)}
              placeholder="What angle will your post take? Why is your audience a strong fit for this brand?"
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
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Send Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
