'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Calendar,
  Search,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  topic: string;
  readTime: string;
  date: string;
  author: string;
  authorRole: string;
  content?: string;
  keyTakeaways?: string[];
  isFeatured?: boolean;
}

interface BlogClientProps {
  initialArticles?: BlogArticle[];
}

export default function BlogPageClient({ initialArticles = [] }: BlogClientProps) {
  const allArticles = initialArticles;
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const topics = [
    'All',
    'CPL economics',
    'LinkedIn micro-creators',
    'Naano vs alternatives',
    'Creator-led growth',
  ];

  const filteredArticles = useMemo(() => {
    return allArticles.filter((art) => {
      const matchesTopic = selectedTopic === 'All' || art.topic === selectedTopic;
      const matchesSearch =
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [selectedTopic, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 uppercase tracking-wider mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>The Naano Journal</span>
          <span>•</span>
          <span className="font-mono">{allArticles.length} Published Articles</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
          Field Notes on B2B Creator-Led Growth
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
          Comprehensive benchmarks, algorithm teardowns, pricing indices, and execution frameworks from the team building the B2B creator operating system.
        </p>
      </div>

      {/* Featured Article Card */}
      <div className="mb-14 p-8 sm:p-12 rounded-3xl bg-slate-950 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="max-w-2xl relative z-10">
          <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider mb-4 inline-block font-mono">
            Featured Research
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 leading-tight">
            LinkedIn Sponsored Post Price Index (2026 Data)
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Rate cards say $500–$2,500 for a sub-10K creator. Naano’s transacted median was €111. Real prices from 300 marketplace bookings by follower tier, niche, and country.
          </p>
          <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
            <span>By Alexis Jarre, Head of Growth</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-indigo-400" /> 11 min read
            </span>
          </div>
          <div className="mt-8">
            <Link
              href="/blog/price-index"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Read Full Playbook &amp; Rate Tables</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Topic Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 mb-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedTopic === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search all 16 articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
          />
        </div>
      </div>

      {/* Articles Grid - ALL 16 ARTICLES with direct links to single pages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between overflow-hidden group p-7"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                  {art.topic}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{art.readTime}</span>
                </span>
              </div>

              {/* Title */}
              <Link href={`/blog/${art.slug}`}>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-3">
                  {art.title}
                </h3>
              </Link>

              {/* Summary */}
              <p className="text-xs text-slate-600 leading-relaxed mb-6 line-clamp-3">
                {art.summary}
              </p>
            </div>

            <div>
              {/* Author & Date */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={art.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                    alt={art.author}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200"
                  />
                  <span className="font-semibold text-slate-800">{art.author}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{art.date}</span>
              </div>

              {/* Read button pointing to standalone single page */}
              <Link
                href={`/blog/${art.slug}`}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200/80 hover:border-indigo-600 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
