import React from 'react';
import type { Metadata } from 'next';
import { creatorsHtml } from '@/data/creatorsHtml';
import LiveLandingPage from '@/components/landing/LiveLandingPage';

export const metadata: Metadata = {
  title: 'For LinkedIn Creators | Naano',
  description: 'Get booked by top B2B companies for sponsored LinkedIn posts at your own fixed price. Zero outreach, guaranteed escrow payouts.',
};

export default function CreatorsPage() {
  return (
    <main className="w-full min-h-screen overflow-x-hidden bg-[#FCFCFB]">
      <LiveLandingPage html={creatorsHtml} />
    </main>
  );
}
