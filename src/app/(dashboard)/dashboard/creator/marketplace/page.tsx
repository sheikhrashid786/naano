'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import ApplyCampaignModal from '@/components/dashboard/ApplyCampaignModal';
import { Briefcase, Building2, CheckCircle2, Loader2, Send, X } from 'lucide-react';

export default function CreatorMarketplacePage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaignForApply, setSelectedCampaignForApply] = useState<any | null>(null);
  const [successToast, setSuccessToast] = useState('');

  async function loadCampaigns() {
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title="Browse SaaS Opportunities"
        subtitle="Companies actively recruiting LinkedIn creators with open fixed-fee budgets."
      />

      <main className="p-8 max-w-6xl w-full mx-auto space-y-6">
        {successToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')}>
              <X className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
            <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-[#111827]">No open campaigns right now</h4>
            <p className="text-xs text-[#6B7280] mt-1">Check back soon for newly posted creator briefs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs">
                        {camp.company.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#111827]">{camp.company.name}</div>
                        <div className="text-[10px] text-[#6B7280]">{camp.company.industry}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Open Budget
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#111827]">{camp.title}</h3>
                  <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed">
                    {camp.description}
                  </p>

                  <div className="p-3 bg-[#F9FAFB] rounded-xl text-xs space-y-1">
                    <div className="text-[#6B7280]">
                      Deliverable: <strong className="text-[#111827]">{camp.deliverables}</strong>
                    </div>
                    {camp.targetAudience && (
                      <div className="text-[#6B7280]">
                        Audience: <strong className="text-[#111827]">{camp.targetAudience}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F3F4F6] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#9CA3AF] block">
                      Budget Per Post
                    </span>
                    <span className="text-base font-bold text-[#111827]">
                      €{camp.budgetPerPost}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedCampaignForApply(camp)}
                    className="inline-flex items-center gap-1.5 bg-[#111827] hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply with Pitch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCampaignForApply && (
          <ApplyCampaignModal
            campaign={selectedCampaignForApply}
            onClose={() => setSelectedCampaignForApply(null)}
            onSuccess={() => {
              setSuccessToast(`Application submitted to ${selectedCampaignForApply.company.name}!`);
            }}
          />
        )}
      </main>
    </div>
  );
}
