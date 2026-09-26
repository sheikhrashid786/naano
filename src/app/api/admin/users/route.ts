export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuth';
import { hashPassword } from '@/lib/auth';

export async function GET(req: Request) {
  const auth = await requireAdminSession();
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const users = await prisma.user.findMany({
      include: {
        company: {
          select: { id: true, name: true, plan: true },
        },
        creator: {
          select: { id: true, niche: true, followersCount: true, badge: true, featured: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const userRole = role === 'ADMIN' ? 'ADMIN' : role === 'CREATOR' ? 'CREATOR' : 'COMPANY';

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role: userRole,
      },
    });

    // If company role, create default Company profile
    if (userRole === 'COMPANY') {
      await prisma.company.create({
        data: {
          userId: newUser.id,
          name: `${name}'s Company`,
          industry: 'Software',
          plan: 'Self-Serve',
        },
      });
    }

    // If creator role, create default Creator profile
    if (userRole === 'CREATOR') {
      await prisma.creator.create({
        data: {
          userId: newUser.id,
          niche: 'B2B Growth',
          industry: 'Tech',
          country: 'FR',
          followersCount: 5000,
          engagementRate: 3.5,
          pricePerPost: 150,
        },
      });
    }

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}
