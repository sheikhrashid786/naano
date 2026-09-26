export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminCollabsClient from './AdminCollabsClient';

export default async function AdminCollabsPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const collabs = await prisma.collaboration.findMany({
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
              avatarUrl: true,
            },
          },
        },
      },
      payment: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <AdminCollabsClient
      initialUser={{
        name: session.name || 'Super Admin',
        email: session.email,
      }}
      collaborations={collabs}
    />
  );
}
