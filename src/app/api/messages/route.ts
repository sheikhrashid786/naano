import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const collabId = searchParams.get('collabId');

    if (collabId) {
      const conversation = await prisma.conversation.findUnique({
        where: { collaborationId: collabId },
        include: {
          messages: {
            include: {
              sender: {
                select: { id: true, name: true, avatarUrl: true, role: true },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
          collaboration: {
            include: {
              campaign: true,
              company: true,
              creator: {
                include: {
                  user: { select: { name: true, avatarUrl: true } },
                },
              },
            },
          },
        },
      });

      return NextResponse.json({ conversation });
    }

    // List all conversations for user
    const whereCondition: any = {};
    if (user.role === 'COMPANY' && user.companyId) {
      whereCondition.collaboration = { companyId: user.companyId };
    } else if (user.role === 'CREATOR' && user.creatorId) {
      whereCondition.collaboration = { creatorId: user.creatorId };
    }

    const conversations = await prisma.conversation.findMany({
      where: whereCondition,
      include: {
        collaboration: {
          include: {
            campaign: true,
            company: true,
            creator: {
              include: {
                user: { select: { name: true, avatarUrl: true } },
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ conversations });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, content } = await req.json();

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'conversationId and content are required' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.userId,
        content,
      },
      include: {
        sender: {
          select: { id: true, name: true, avatarUrl: true, role: true },
        },
      },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
