import React from 'react';
import type { Metadata } from 'next';
import { agenciesHtml } from '@/data/agenciesHtml';
import LiveLandingPage from '@/components/landing/LiveLandingPage';

export const metadata: Metadata = {
  title: 'For Agencies | Naano',
  description: 'Run LinkedIn creator campaigns for all your clients from one dashboard. Dedicated account manager, pooled budgets, and white-label reporting.',
};

export default function AgenciesPage() {
  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-[#FCFCFB]">
      <LiveLandingPage html={agenciesHtml} />
    </main>
  );
}
