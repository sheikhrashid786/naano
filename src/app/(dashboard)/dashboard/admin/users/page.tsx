export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await prisma.user.findMany({
    include: {
      company: {
        select: { id: true, name: true, plan: true, industry: true },
      },
      creator: {
        select: { id: true, niche: true, followersCount: true, badge: true, featured: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminUsersClient
      initialUser={{
        name: session.name || 'Super Admin',
        email: session.email,
      }}
      users={users}
    />
  );
}
