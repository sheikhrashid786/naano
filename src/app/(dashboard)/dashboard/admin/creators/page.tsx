export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminCreatorsClient from './AdminCreatorsClient';

export default async function AdminCreatorsPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const creators = await prisma.creator.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
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
    orderBy: [
      { featured: 'desc' },
      { followersCount: 'desc' },
    ],
  });

  return (
    <AdminCreatorsClient
      initialUser={{
        name: session.name || 'Super Admin',
        email: session.email,
      }}
      creators={creators}
    />
  );
}
