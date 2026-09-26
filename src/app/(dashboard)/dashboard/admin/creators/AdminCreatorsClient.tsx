'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/dashboard/Header';
import {
  Contact,
  Search,
  Star,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Edit2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react';

interface Props {
  initialUser: {
    name: string;
    email: string;
  };
  creators: any[];
}

export default function AdminCreatorsClient({ initialUser, creators: initialCreators }: Props) {
  const [creatorsList, setCreatorsList] = useState<any[]>(initialCreators);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<string>('ALL');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit modal
  const [editingCreator, setEditingCreator] = useState<any | null>(null);
  const [editPrice, setEditPrice] = useState<number>(150);
  const [editFollowers, setEditFollowers] = useState<number>(5000);
  const [editBadge, setEditBadge] = useState<string>('');
  const [editNiche, setEditNiche] = useState<string>('');
  const [modalSubmitting, setModalSubmitting] = useState(false);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const filteredCreators = useMemo(() => {
    return creatorsList.filter((c) => {
      const matchesFeatured =
        filterFeatured === 'ALL' ||
        (filterFeatured === 'FEATURED' && c.featured) ||
        (filterFeatured === 'STANDARD' && !c.featured);

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        c.user?.name?.toLowerCase().includes(query) ||
        c.niche?.toLowerCase().includes(query) ||
        c.industry?.toLowerCase().includes(query) ||
        c.badge?.toLowerCase().includes(query);

      return matchesFeatured && matchesSearch;
    });
  }, [creatorsList, filterFeatured, searchQuery]);

  async function handleToggleFeatured(creatorId: string, currentVal: boolean) {
    setLoadingId(creatorId);
    try {
      const res = await fetch(`/api/admin/creators/${creatorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentVal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update creator');

      setCreatorsList((prev) =>
        prev.map((c) => (c.id === creatorId ? { ...c, featured: !currentVal } : c))
      );
      showToast(!currentVal ? 'Creator marked as Featured on Homepage' : 'Creator unfeatured');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleToggleStripe(creatorId: string, currentVal: boolean) {
    setLoadingId(creatorId);
    try {
      const res = await fetch(`/api/admin/creators/${creatorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripeConnected: !currentVal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update stripe status');

      setCreatorsList((prev) =>
        prev.map((c) => (c.id === creatorId ? { ...c, stripeConnected: !currentVal } : c))
      );
      showToast(!currentVal ? 'Stripe Connect marked active' : 'Stripe status toggled');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  function openEditModal(creator: any) {
    setEditingCreator(creator);
    setEditPrice(creator.pricePerPost);
    setEditFollowers(creator.followersCount);
    setEditBadge(creator.badge || '');
    setEditNiche(creator.niche || '');
  }

  async function handleSaveCreatorDetails(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCreator) return;

    setModalSubmitting(true);
    try {
      const res = await fetch(`/api/admin/creators/${editingCreator.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pricePerPost: Number(editPrice),
          followersCount: Number(editFollowers),
          badge: editBadge,
          niche: editNiche,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save creator details');

      setCreatorsList((prev) =>
        prev.map((c) =>
          c.id === editingCreator.id
            ? {
                ...c,
                pricePerPost: Number(editPrice),
                followersCount: Number(editFollowers),
                badge: editBadge || null,
                niche: editNiche,
              }
            : c
        )
      );

      setEditingCreator(null);
      showToast('Creator rate card & badges updated successfully');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setModalSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] min-h-screen pb-24 relative font-sans">
      <Header
        balance={0}
        user={{
          name: initialUser.name,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        }}
      />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="w-full px-6 sm:px-8 lg:px-10 py-8 space-y-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span>Quality Curation</span>
              </span>
              <span className="text-xs font-semibold text-[#64748B]">
                {creatorsList.length} Verified Creators in Marketplace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#111827] tracking-tight">
              Creator Marketplace Directory
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Control featured placement, assign verified creator badges, set pricing benchmarks, and manage Stripe Connect status.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['ALL', 'FEATURED', 'STANDARD'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterFeatured(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  filterFeatured === f
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {f === 'ALL' ? 'All Creators' : f === 'FEATURED' ? '⭐ Featured Only' : 'Standard'}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search creator name, niche, or badge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>
        </div>

        {/* Creators Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-3.5 px-5">Creator</th>
                  <th className="py-3.5 px-5">Audience &amp; Rate</th>
                  <th className="py-3.5 px-5">Badges &amp; Niche</th>
                  <th className="py-3.5 px-5">Featured Placement</th>
                  <th className="py-3.5 px-5">Stripe Escrow</th>
                  <th className="py-3.5 px-5 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/70">
                {filteredCreators.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No creators match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCreators.map((creator) => (
                    <tr key={creator.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Creator Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={creator.avatarUrl || creator.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                            alt={creator.user?.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-[#111827] text-sm flex items-center gap-1.5">
                              <span>{creator.user?.name}</span>
                              {creator.featured && (
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-[#64748B] font-mono text-[11px]">{creator.user?.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Audience & Rate */}
                      <td className="py-4 px-5">
                        <div className="font-extrabold text-emerald-600 font-mono text-sm">
                          €{creator.pricePerPost}{' '}
                          <span className="text-[10px] font-normal text-slate-400">/ post</span>
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          {(creator.followersCount / 1000).toFixed(1)}k followers • {creator.engagementRate}% ER
                        </div>
                      </td>

                      {/* Badges & Niche */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-800">{creator.niche}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {creator.badge ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {creator.badge}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No badge assigned</span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono uppercase">
                            ({creator.country})
                          </span>
                        </div>
                      </td>

                      {/* Featured Placement Toggle */}
                      <td className="py-4 px-5">
                        <button
                          type="button"
                          disabled={loadingId === creator.id}
                          onClick={() => handleToggleFeatured(creator.id, creator.featured)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            creator.featured
                              ? 'bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${creator.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                          <span>{creator.featured ? 'Featured' : 'Standard'}</span>
                        </button>
                      </td>

                      {/* Stripe Connect Toggle */}
                      <td className="py-4 px-5">
                        <button
                          type="button"
                          disabled={loadingId === creator.id}
                          onClick={() => handleToggleStripe(creator.id, creator.stripeConnected)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            creator.stripeConnected
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border border-red-100 hover:bg-red-100'
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{creator.stripeConnected ? 'Verified' : 'Pending'}</span>
                        </button>
                      </td>

                      {/* Edit Modal Trigger */}
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => openEditModal(creator)}
                          className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Creator Modal */}
      {editingCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setEditingCreator(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <img
                src={editingCreator.avatarUrl || editingCreator.user?.avatarUrl}
                alt={editingCreator.user?.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{editingCreator.user?.name}</h3>
                <p className="text-xs text-slate-500">Edit rate card, badge, and followers</p>
              </div>
            </div>

            <form onSubmit={handleSaveCreatorDetails} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Fixed Price per Post (€)</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    required
                    min={20}
                    max={10000}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Total Followers</label>
                <input
                  type="number"
                  required
                  min={500}
                  value={editFollowers}
                  onChange={(e) => setEditFollowers(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Niche / Primary Topic</label>
                <input
                  type="text"
                  required
                  value={editNiche}
                  onChange={(e) => setEditNiche(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Verification Badge</label>
                <select
                  value={editBadge}
                  onChange={(e) => setEditBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800"
                >
                  <option value="">No Badge</option>
                  <option value="Top Voice">Top Voice</option>
                  <option value="B2B Tech">B2B Tech</option>
                  <option value="RevOps Expert">RevOps Expert</option>
                  <option value="SaaS Growth">SaaS Growth</option>
                  <option value="AI Specialist">AI Specialist</option>
                  <option value="Cold Outbound">Cold Outbound</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCreator(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {modalSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
