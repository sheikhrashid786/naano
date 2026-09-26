export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminFinancesClient from './AdminFinancesClient';

export default async function AdminFinancesPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const payments = await prisma.payment.findMany({
    include: {
      collaboration: {
        include: {
          campaign: {
            select: {
              id: true,
              title: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
            },
          },
          creator: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalGMV = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter((p) => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);

  return (
    <AdminFinancesClient
      initialUser={{
        name: session.name || 'Super Admin',
        email: session.email,
      }}
      payments={payments}
      stats={{
        totalGMV,
        paidAmount,
        pendingAmount,
        estimatedFees: Math.round(totalGMV * 0.15),
      }}
    />
  );
}
