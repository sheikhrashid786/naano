export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Test database connectivity
    await prisma.$queryRaw`SELECT 1`;

    // 2. Count existing records
    const [userCount, companyCount, creatorCount, campaignCount, collabCount] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.creator.count(),
      prisma.campaign.count(),
      prisma.collaboration.count(),
    ]);

    const isSeeded = userCount >= 2 && creatorCount >= 1;

    return NextResponse.json({
      status: 'ok',
      backend: 'healthy',
      database: {
        status: 'connected',
        seeded: isSeeded,
        counts: {
          users: userCount,
          companies: companyCount,
          creators: creatorCount,
          campaigns: campaignCount,
          collaborations: collabCount,
        },
      },
      accountsAvailable: isSeeded
        ? [
            { role: 'COMPANY', email: 'company@lemlist.com', password: 'password123' },
            { role: 'CREATOR', email: 'eric@creator.io', password: 'password123' },
          ]
        : [],
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'degraded',
        backend: 'running',
        database: {
          status: 'disconnected',
          error: error.message || 'Database connection error',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
