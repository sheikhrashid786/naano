export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminBlogsClient from './AdminBlogsClient';

export default async function AdminBlogsPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const blogs = await prisma.blogItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminBlogsClient
      initialUser={{
        name: session.name || 'Super Admin',
        email: session.email,
      }}
      blogs={blogs}
    />
  );
}
