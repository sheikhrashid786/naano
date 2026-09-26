'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/dashboard/Header';
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  X,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Props {
  initialUser: {
    name: string;
    email: string;
  };
  blogs: any[];
}

export default function AdminBlogsClient({ initialUser, blogs: initialItems }: Props) {
  const [blogsList, setBlogsList] = useState<any[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [topic, setTopic] = useState('Creator-led growth');
  const [readTime, setReadTime] = useState('8 min read');
  const [author, setAuthor] = useState('Alexis Jarre');
  const [authorRole, setAuthorRole] = useState('Head of Growth');
  const [summary, setSummary] = useState('');
  const [takeaway1, setTakeaway1] = useState('');
  const [takeaway2, setTakeaway2] = useState('');
  const [contentHeading, setContentHeading] = useState('1. Key Findings & Execution Strategy');
  const [contentBody, setContentBody] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const topics = [
    'ALL',
    'CPL economics',
    'LinkedIn micro-creators',
    'Naano vs alternatives',
    'Creator-led growth',
  ];

  const filteredItems = useMemo(() => {
    return blogsList.filter((b) => {
      const matchesTopic = selectedTopic === 'ALL' || b.topic === selectedTopic;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.title.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q);
      return matchesTopic && matchesSearch;
    });
  }, [blogsList, selectedTopic, searchQuery]);

  async function handleTogglePublished(id: string, current: boolean) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      setBlogsList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, published: !current } : item))
      );
      showToast(!current ? 'Article published to live journal' : 'Article unpublished');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update featured state');

      setBlogsList((prev) =>
        prev.map((item) => (item.id === id ? { ...item, featured: !current } : item))
      );
      showToast(!current ? 'Marked as Featured Journal Article' : 'Unmarked featured article');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: string, artTitle: string) {
    if (!confirm(`Are you sure you want to delete article "${artTitle}"?`)) return;

    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete');

      setBlogsList((prev) => prev.filter((item) => item.id !== id));
      showToast('Article deleted');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');

    try {
      const takeawaysList = [takeaway1, takeaway2].filter(Boolean);
      const contentList = [
        {
          heading: contentHeading,
          paragraphs: [contentBody],
        },
      ];

      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          topic,
          readTime,
          author,
          authorRole,
          summary,
          takeaways: takeawaysList,
          content: contentList,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create article');

      setBlogsList((prev) => [data.blog, ...prev]);
      setIsAddModalOpen(false);
      setTitle('');
      setSlug('');
      setSummary('');
      setTakeaway1('');
      setTakeaway2('');
      setContentBody('');
      showToast(`Created article "${title}"!`);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
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
        {/* Title and Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span>Editorial CMS</span>
              </span>
              <span className="text-xs font-semibold text-[#64748B]">
                {blogsList.length} Research Articles in MySQL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#111827] tracking-tight">
              The Naano Journal CMS
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Draft, edit, and feature research playbooks, pricing indexes, and creator marketing guides shown on /blog.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold rounded-xl shadow-2xs flex items-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Publish New Article</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedTopic === t
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {t === 'ALL' ? 'All Topics' : t}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, author, or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-slate-50/70 text-slate-500 uppercase tracking-wider font-bold text-[11px]">
                  <th className="py-3.5 px-5">Article &amp; URL Slug</th>
                  <th className="py-3.5 px-5">Topic</th>
                  <th className="py-3.5 px-5">Author</th>
                  <th className="py-3.5 px-5">Featured</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/70">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No articles found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Title & Slug */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-[#111827] text-sm leading-snug line-clamp-1">{art.title}</div>
                        <div className="text-[#64748B] font-mono text-[11px]">/blog/{art.slug}</div>
                      </td>

                      {/* Topic */}
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {art.topic}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">{art.readTime}</div>
                      </td>

                      {/* Author */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-800">{art.author}</div>
                        <div className="text-[11px] text-slate-400">{art.authorRole}</div>
                      </td>

                      {/* Featured */}
                      <td className="py-4 px-5">
                        <button
                          type="button"
                          disabled={loadingId === art.id}
                          onClick={() => handleToggleFeatured(art.id, art.featured)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            art.featured
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${art.featured ? 'fill-amber-500 text-amber-500' : ''}`} />
                          <span>{art.featured ? 'Hero Featured' : 'Standard'}</span>
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <button
                          type="button"
                          disabled={loadingId === art.id}
                          onClick={() => handleTogglePublished(art.id, art.published)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            art.published
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {art.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          <span>{art.published ? 'Live' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right space-x-1">
                        <Link
                          href={`/blog/${art.slug}`}
                          target="_blank"
                          title="View live article"
                          className="inline-flex p-2 rounded-xl text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          disabled={loadingId === art.id}
                          onClick={() => handleDelete(art.id, art.title)}
                          title="Delete article"
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add Blog Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Publish New Research Article</h3>
                <p className="text-xs text-slate-500">Live publication directly into the Naano Journal</p>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026 B2B Influencer Pricing Benchmarks"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="b2b-pricing-benchmarks-2026"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category / Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-800"
                  >
                    <option value="CPL economics">CPL economics</option>
                    <option value="LinkedIn micro-creators">LinkedIn micro-creators</option>
                    <option value="Naano vs alternatives">Naano vs alternatives</option>
                    <option value="Creator-led growth">Creator-led growth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    placeholder="8 min read"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Author Name</label>
                  <input
                    type="text"
                    placeholder="Alexis Jarre"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Executive Summary / Abstract</label>
                <textarea
                  rows={2}
                  placeholder="Key findings and real transacted marketplace data..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Key Strategic Takeaway 1</label>
                <input
                  type="text"
                  placeholder="Standardize fixed-fee escrow milestones rather than pay-per-click vanity."
                  value={takeaway1}
                  onChange={(e) => setTakeaway1(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Main Article Content Section</label>
                <textarea
                  rows={4}
                  placeholder="In-depth analysis paragraphs and tactical execution steps..."
                  value={contentBody}
                  onChange={(e) => setContentBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {formSubmitting ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
