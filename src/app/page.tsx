import React from 'react';
import type { Metadata } from 'next';
import { homeHtml } from '@/data/homeHtml';
import LiveLandingPage from '@/components/landing/LiveLandingPage';

export const metadata: Metadata = {
  title: 'Naano: B2B LinkedIn Creator Marketplace',
  description: 'Naano helps B2B SaaS brands run fixed-price LinkedIn creator campaigns and trace attributed clicks and leads back to each post.',
};

export default function HomePage() {
  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-[#FCFCFB]">
      <LiveLandingPage html={homeHtml} />
    </main>
  );
}
