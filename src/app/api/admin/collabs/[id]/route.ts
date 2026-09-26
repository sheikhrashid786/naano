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
    const { status, submittedPostUrl, postProofText } = body;

    const data: any = {};
    if (status && [
      'INVITED',
      'APPLIED',
      'ACCEPTED',
      'DECLINED',
      'IN_PROGRESS',
      'CONTENT_SUBMITTED',
      'APPROVED',
      'COMPLETED',
      'CANCELLED'
    ].includes(status)) {
      data.status = status;
    }
    if (submittedPostUrl !== undefined) data.submittedPostUrl = submittedPostUrl;
    if (postProofText !== undefined) data.postProofText = postProofText;

    const updated = await prisma.collaboration.update({
      where: { id },
      data,
      include: {
        campaign: true,
        company: true,
        creator: { include: { user: true } },
      },
    });

    return NextResponse.json({ success: true, collaboration: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update collaboration' }, { status: 500 });
  }
}
