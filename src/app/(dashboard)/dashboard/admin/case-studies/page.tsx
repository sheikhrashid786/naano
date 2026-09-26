export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminCaseStudiesClient from './AdminCaseStudiesClient';

export default async function AdminCaseStudiesPage() {
  const session = await getCurrentUser();

  if (!session || session.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const caseStudies = await prisma.caseStudyItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <AdminCaseStudiesClient
      initialUser={{
        name: session.name || 'Super Admin',
        email: session.email,
      }}
      caseStudies={caseStudies}
    />
  );
}
