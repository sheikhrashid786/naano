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
    const { featured, badge, followersCount, pricePerPost, engagementRate, stripeConnected, niche } = body;

    const data: any = {};
    if (typeof featured === 'boolean') data.featured = featured;
    if (typeof badge === 'string') data.badge = badge.trim() || null;
    if (typeof followersCount === 'number') data.followersCount = followersCount;
    if (typeof pricePerPost === 'number') data.pricePerPost = pricePerPost;
    if (typeof engagementRate === 'number') data.engagementRate = engagementRate;
    if (typeof stripeConnected === 'boolean') data.stripeConnected = stripeConnected;
    if (typeof niche === 'string') data.niche = niche.trim();

    const updated = await prisma.creator.update({
      where: { id },
      data,
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ success: true, creator: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update creator' }, { status: 500 });
  }
}
