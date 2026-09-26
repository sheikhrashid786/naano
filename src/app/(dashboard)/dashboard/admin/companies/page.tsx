export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminCompaniesClient from './AdminCompaniesClient';

export default async function AdminCompaniesPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const companies = await prisma.company.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      campaigns: {
        select: {
          id: true,
          status: true,
        },
      },
      collaborations: {
        select: {
          id: true,
          status: true,
          fixedRate: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminCompaniesClient
      initialUser={{
        name: session.name || 'Super Admin',
        email: session.email,
      }}
      companies={companies}
    />
  );
}
