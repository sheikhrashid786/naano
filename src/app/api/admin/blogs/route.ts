export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/adminAuth';

export async function GET() {
  const auth = await requireAdminSession();
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const blogs = await prisma.blogItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ blogs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireAdminSession();
  if ('errorResponse' in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const {
      title,
      slug,
      topic,
      readTime,
      author,
      authorRole,
      summary,
      takeaways,
      content,
      published,
      featured,
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const existing = await prisma.blogItem.findUnique({
      where: { slug: cleanSlug },
    });
    if (existing) {
      return NextResponse.json({ error: 'An article with this slug already exists' }, { status: 400 });
    }

    const created = await prisma.blogItem.create({
      data: {
        slug: cleanSlug,
        title,
        topic: topic || 'Creator-led growth',
        readTime: readTime || '6 min read',
        date: body.date || 'Sep 2026',
        author: author || 'Naano Editorial',
        authorRole: authorRole || 'Research Team',
        summary: summary || 'Analysis of B2B influencer mechanics and customer acquisition.',
        takeaways: typeof takeaways === 'string' ? takeaways : JSON.stringify(takeaways || ['Key strategic takeaway']),
        contentJson: typeof content === 'string' ? content : JSON.stringify(content || [
          { heading: '1. Executive Analysis', paragraphs: ['Comprehensive breakdown of creator campaigns.'] },
        ]),
        published: published !== undefined ? published : true,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json({ success: true, blog: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create blog post' }, { status: 500 });
  }
}
