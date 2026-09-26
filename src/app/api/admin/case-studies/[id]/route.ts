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

    const updateData: any = {};
    const fields = [
      'company',
      'slug',
      'tagline',
      'industry',
      'metric',
      'metricLabel',
      'quote',
      'author',
      'role',
      'pipelineAdded',
      'impressions',
      'clicks',
      'summary',
      'challenge',
      'strategy',
      'published',
    ];

    for (const f of fields) {
      if (body[f] !== undefined) updateData[f] = body[f];
    }

    if (body.results !== undefined) {
      updateData.results = typeof body.results === 'string' ? body.results : JSON.stringify(body.results);
    }
    if (body.keyTakeaways !== undefined) {
      updateData.keyTakeaways = typeof body.keyTakeaways === 'string' ? body.keyTakeaways : JSON.stringify(body.keyTakeaways);
    }

    const updated = await prisma.caseStudyItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, caseStudy: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update case study' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  const auth = await requireAdminSession();
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    await prisma.caseStudyItem.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Case study deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete case study' }, { status: 500 });
  }
}
