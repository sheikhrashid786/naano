export const dynamic = 'force-dynamic';

import React from 'react';
import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/landing/Footer';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
  title: 'The Naano Journal | B2B LinkedIn Creator Marketing Playbooks',
  description: 'In-depth benchmarks, algorithm teardowns, pricing indices, and execution frameworks on scaling B2B SaaS growth through creators.',
};

export default async function BlogPage() {
  const session = await getCurrentUser();

  const dbItems = await prisma.blogItem.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  const articles = dbItems.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    topic: item.topic,
    readTime: item.readTime,
    date: item.date,
    author: item.author,
    authorRole: item.authorRole,
    authorAvatar: item.authorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    gradient: item.gradient,
    summary: item.summary,
    takeaways: typeof item.takeaways === 'string' ? JSON.parse(item.takeaways) : (item.takeaways || []),
    content: typeof item.contentJson === 'string' ? JSON.parse(item.contentJson) : [],
    featured: item.featured,
  }));

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Navbar initialUser={session} />
      <main className="w-full flex-1 pt-32 pb-24">
        <BlogPageClient initialArticles={articles} />
      </main>
      <Footer />
    </div>
  );
}
