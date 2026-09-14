import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'CREATOR' || !user.creatorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const creator = await prisma.creator.findUnique({
      where: { id: user.creatorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    return NextResponse.json({ creator });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch creator profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'CREATOR' || !user.creatorId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      avatarUrl,
      headline,
      bio,
      niche,
      industry,
      country,
      linkedinUrl,
      pricePerPost,
    } = body;

    // Update user info
    if (name || avatarUrl) {
      await prisma.user.update({
        where: { id: user.userId },
        data: {
          ...(name && { name }),
          ...(avatarUrl && { avatarUrl }),
        },
      });
    }

    // Update creator profile
    const updatedCreator = await prisma.creator.update({
      where: { id: user.creatorId },
      data: {
        ...(headline !== undefined && { headline }),
        ...(bio !== undefined && { bio }),
        ...(niche !== undefined && { niche }),
        ...(industry !== undefined && { industry }),
        ...(country !== undefined && { country }),
        ...(linkedinUrl !== undefined && { linkedinUrl }),
        ...(pricePerPost !== undefined && { pricePerPost: parseInt(pricePerPost, 10) || 150 }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, creator: updatedCreator });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
