export const dynamic = 'force-dynamic';

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/landing/Footer';
import AgenciesPageClient from './AgenciesPageClient';

export const metadata: Metadata = {
  title: 'For B2B Marketing Agencies | Naano',
  description: 'Deploy LinkedIn creator campaigns across multiple B2B clients from one operating system. Consolidated billing and white-label reporting.',
};

export default async function AgenciesPage() {
  const session = await getCurrentUser();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <Navbar initialUser={session} />
      <main className="w-full flex-1">
        <AgenciesPageClient />
      </main>
      <Footer />
    </div>
  );
}
