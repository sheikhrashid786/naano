export const dynamic = 'force-dynamic';

import React from 'react';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import LiveCreatorsDirectory from '@/components/landing/LiveCreatorsDirectory';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CaseStudiesShowcase from '@/components/landing/CaseStudiesShowcase';
import FaqSection from '@/components/landing/FaqSection';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Naano | The B2B LinkedIn Creator Operating System & Marketplace',
  description: 'Connect with verified LinkedIn B2B creators, launch high-impact campaigns with escrow protection, and track attributed pipeline.',
};

export default async function HomePage() {
  const session = await getCurrentUser();

  // Fetch real creators dynamically from the MySQL database
  const dbCreators = await prisma.creator.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: [
      { featured: 'desc' },
      { followersCount: 'desc' },
    ],
  });

  // Enriched creators formatted for the directory
  const creators = dbCreators.map((c) => ({
    id: c.id,
    name: c.user?.name || 'Creator',
    headline: c.headline,
    bio: c.bio,
    niche: c.niche,
    industry: c.industry,
    country: c.country,
    followersCount: c.followersCount,
    engagementRate: c.engagementRate,
    pricePerPost: c.pricePerPost,
    badge: c.badge,
    avatarUrl: c.avatarUrl || c.user?.avatarUrl,
    fitScore: Math.min(98, Math.max(78, Math.round(c.engagementRate * 18))),
    user: c.user,
  }));

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar initialUser={session} />
      <main className="w-full flex-1">
        <HeroSection />
        <LiveCreatorsDirectory initialCreators={creators} initialUser={session} />
        <HowItWorksSection />
        <CaseStudiesShowcase />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
