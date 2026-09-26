export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedDatabase } from '@/lib/seed';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shouldForceSeed = url.searchParams.get('seed') === 'true';

    // 1. Test database connectivity
    await prisma.$queryRaw`SELECT 1`;

    // 2. Count existing records
    let [userCount, companyCount, creatorCount, campaignCount, collabCount, adminCount] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.creator.count(),
      prisma.campaign.count(),
      prisma.collaboration.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
    ]);

    // If explicitly requested via ?seed=true or if database lacks admin account, automatically seed
    if (shouldForceSeed || (userCount > 0 && adminCount === 0)) {
      await seedDatabase();
      [userCount, companyCount, creatorCount, campaignCount, collabCount, adminCount] = await Promise.all([
        prisma.user.count(),
        prisma.company.count(),
        prisma.creator.count(),
        prisma.campaign.count(),
        prisma.collaboration.count(),
        prisma.user.count({ where: { role: 'ADMIN' } }),
      ]);
    }

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
          admins: adminCount,
        },
      },
      accountsAvailable: isSeeded
        ? [
            { role: 'ADMIN', email: 'admin@naano.io', password: 'password123' },
            { role: 'COMPANY', email: 'brand@lemlist.com', password: 'password123' },
            { role: 'COMPANY', email: 'company@lemlist.com', password: 'password123' },
            { role: 'CREATOR', email: 'creator@naano.io', password: 'password123' },
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
