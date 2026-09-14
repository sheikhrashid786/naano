export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, COOKIE_NAME } from '@/lib/auth';
import { Role } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, companyName, industry, country, niche, headline } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const assignedRole = role === 'CREATOR' ? Role.CREATOR : Role.COMPANY;

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role: assignedRole,
        company:
          assignedRole === Role.COMPANY
            ? {
                create: {
                  name: companyName || `${name}'s Company`,
                  industry: industry || 'B2B SaaS',
                  country: country || 'US',
                  targetIndustries: industry || 'B2B SaaS',
                  targetCountries: country || 'US',
                  targetRoles: 'Founders,GTM teams,Sales leaders',
                },
              }
            : undefined,
        creator:
          assignedRole === Role.CREATOR
            ? {
                create: {
                  headline: headline || 'B2B LinkedIn Creator & Growth Specialist',
                  niche: niche || 'AI & SaaS',
                  industry: industry || 'Sales Tech',
                  country: country || 'FR',
                  followersCount: 5000,
                  engagementRate: 4.2,
                  pricePerPost: 150,
                  badge: 'Verified B2B',
                },
              }
            : undefined,
      },
      include: {
        company: true,
        creator: true,
      },
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.company?.id,
      creatorId: user.creator?.id,
    });

    const redirectUrl =
      user.role === Role.CREATOR ? '/dashboard/creator' : '/dashboard/company';

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.company?.id,
        creatorId: user.creator?.id,
      },
      redirectUrl,
    });

    const isHttps =
      req.headers.get('x-forwarded-proto') === 'https' ||
      req.url.startsWith('https://');

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
