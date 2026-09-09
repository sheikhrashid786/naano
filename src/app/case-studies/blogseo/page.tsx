import React from 'react';
import type { Metadata } from 'next';
import { caseStudyBlogSeoHtml } from '@/data/caseStudyBlogSeoHtml';
import LiveLandingPage from '@/components/landing/LiveLandingPage';

export const metadata: Metadata = {
  title: 'BlogSEO Case Study: Scaling B2B Lead Gen with LinkedIn Creators | Naano',
  description: 'How BlogSEO scaled targeted creator campaigns with guaranteed attribution and fixed pricing through Naano.',
};

export default function BlogSeoCaseStudyPage() {
  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-[#FCFCFB]">
      <LiveLandingPage html={caseStudyBlogSeoHtml} />
    </main>
  );
}
