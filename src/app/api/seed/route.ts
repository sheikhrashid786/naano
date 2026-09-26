export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function GET(req: Request) {
  try {
    const result = await seedDatabase();

    return NextResponse.json({
      success: true,
      message: 'Naano database seeded successfully on live server!',
      result,
      accountsAvailable: [
        { role: 'ADMIN', email: 'admin@naano.io', password: 'password123' },
        { role: 'COMPANY', email: 'brand@lemlist.com', password: 'password123' },
        { role: 'COMPANY', email: 'company@lemlist.com', password: 'password123' },
        { role: 'CREATOR', email: 'creator@naano.io', password: 'password123' },
        { role: 'CREATOR', email: 'eric@creator.io', password: 'password123' },
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to seed database',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return GET(req);
}
