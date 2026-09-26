export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminOverviewClient from './AdminOverviewClient';

export default async function AdminOverviewPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Fetch high level system counts and metrics
  const [
    totalUsers,
    totalCompanies,
    totalCreators,
    totalCampaigns,
    totalCollabs,
    payments,
    recentUsers,
    recentCollabs,
    featuredCreators,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.creator.count(),
    prisma.campaign.count(),
    prisma.collaboration.count(),
    prisma.payment.findMany({
      include: {
        collaboration: {
          include: {
            company: true,
            creator: { include: { user: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        company: { select: { name: true, plan: true } },
        creator: { select: { niche: true, followersCount: true, badge: true } },
      },
    }),
    prisma.collaboration.findMany({
      take: 6,
      orderBy: { updatedAt: 'desc' },
      include: {
        campaign: { select: { title: true } },
        company: { select: { name: true } },
        creator: { include: { user: { select: { name: true } } } },
      },
    }),
    prisma.creator.findMany({
      where: { featured: true },
      take: 4,
      include: { user: { select: { name: true, avatarUrl: true } } },
    }),
  ]);

  // Calculate GMV and platform volume
  const totalGMV = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidGMV = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const pendingGMV = payments.filter((p) => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminOverviewClient
      initialUser={{
        name: session.name || 'Super Admin',
        email: session.email,
      }}
      metrics={{
        totalUsers,
        totalCompanies,
        totalCreators,
        totalCampaigns,
        totalCollabs,
        totalGMV,
        paidGMV,
        pendingGMV,
      }}
      recentUsers={recentUsers}
      recentCollabs={recentCollabs}
      recentPayments={payments.slice(0, 5)}
      featuredCreators={featuredCreators}
    />
  );
}
