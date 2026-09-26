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
    const { plan, industry, website, tagline } = body;

    const data: any = {};
    if (plan) data.plan = plan;
    if (industry) data.industry = industry;
    if (website) data.website = website;
    if (tagline) data.tagline = tagline;

    const updated = await prisma.company.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, company: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update company' }, { status: 500 });
  }
}
