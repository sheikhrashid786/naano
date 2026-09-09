import React from 'react';
import type { Metadata } from 'next';
import { blogHtml } from '@/data/blogHtml';
import LiveLandingPage from '@/components/landing/LiveLandingPage';

export const metadata: Metadata = {
  title: 'Blog | Naano: B2B LinkedIn Creator Marketing',
  description: 'Insights, playbooks, and case studies on scaling B2B SaaS growth through LinkedIn creator partnerships.',
};

export default function BlogPage() {
  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-[#FCFCFB]">
      <LiveLandingPage html={blogHtml} />
    </main>
  );
}
