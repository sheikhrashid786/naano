export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminCampaignsClient from './AdminCampaignsClient';

export default async function AdminCampaignsPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const campaigns = await prisma.campaign.findMany({
    include: {
      company: {
        select: {
          id: true,
          name: true,
          industry: true,
        },
      },
      brief: true,
      collaborations: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminCampaignsClient
      initialUser={{
        name: session.name || 'Super Admin',
        email: session.email,
      }}
      campaigns={campaigns}
    />
  );
}
