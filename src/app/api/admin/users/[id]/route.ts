export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuth';

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Props) {
  const auth = await requireAdminSession();
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, role } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      include: { company: true, creator: true },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase().trim();
    if (role && ['COMPANY', 'CREATOR', 'ADMIN'].includes(role)) {
      updateData.role = role;

      // If transitioning to CREATOR and doesn't have profile
      if (role === 'CREATOR' && !existingUser.creator) {
        await prisma.creator.create({
          data: {
            userId: id,
            niche: 'B2B Creator',
            industry: 'Tech',
            country: 'FR',
            followersCount: 5000,
            engagementRate: 3.5,
            pricePerPost: 150,
          },
        });
      }

      // If transitioning to COMPANY and doesn't have profile
      if (role === 'COMPANY' && !existingUser.company) {
        await prisma.company.create({
          data: {
            userId: id,
            name: `${existingUser.name}'s Company`,
            industry: 'Software',
            plan: 'Self-Serve',
          },
        });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  const auth = await requireAdminSession();
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { id } = await params;

    // Prevent deleting oneself
    if (auth.user.userId === id) {
      return NextResponse.json({ error: 'You cannot delete your own admin account' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 });
  }
}
