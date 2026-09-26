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
      'title',
      'slug',
      'topic',
      'readTime',
      'date',
      'author',
      'authorRole',
      'summary',
      'published',
      'featured',
    ];

    for (const f of fields) {
      if (body[f] !== undefined) updateData[f] = body[f];
    }

    if (body.takeaways !== undefined) {
      updateData.takeaways = typeof body.takeaways === 'string' ? body.takeaways : JSON.stringify(body.takeaways);
    }
    if (body.content !== undefined) {
      updateData.contentJson = typeof body.content === 'string' ? body.content : JSON.stringify(body.content);
    }

    const updated = await prisma.blogItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, blog: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Props) {
  const auth = await requireAdminSession();
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const { id } = await params;
    await prisma.blogItem.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Blog post deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete blog post' }, { status: 500 });
  }
}
