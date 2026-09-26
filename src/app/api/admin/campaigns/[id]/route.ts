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
    const { status, budgetPerPost } = body;

    const data: any = {};
    if (status && ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      data.status = status;
    }
    if (typeof budgetPerPost === 'number') {
      data.budgetPerPost = budgetPerPost;
    }

    const updated = await prisma.campaign.update({
      where: { id },
      data,
      include: { company: true },
    });

    return NextResponse.json({ success: true, campaign: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update campaign' }, { status: 500 });
  }
}
