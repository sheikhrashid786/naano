export const dynamic = 'force-dynamic';

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/landing/Footer';
import CreatorsPageClient from './CreatorsPageClient';

export const metadata: Metadata = {
  title: 'For B2B LinkedIn Creators | Naano',
  description: 'Get booked by top tech and B2B SaaS brands for sponsored LinkedIn posts at your own fixed price. Guaranteed escrow payouts.',
};

export default async function CreatorsPage() {
  const session = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar initialUser={session} />
      <main className="w-full flex-1">
        <CreatorsPageClient />
      </main>
      <Footer />
    </div>
  );
}
