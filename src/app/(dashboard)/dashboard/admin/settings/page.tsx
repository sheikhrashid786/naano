export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminSettingsClient from './AdminSettingsClient';

export default async function AdminSettingsPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const settings = await prisma.platformSetting.findMany();

  return (
    <AdminSettingsClient
      initialUser={{
        name: session.name || 'Super Admin',
        email: session.email,
      }}
      settings={settings}
    />
  );
}
