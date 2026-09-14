export const dynamic = 'force-dynamic';

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

    // Resolve creator ID if current user is creator, or fallback to first creator
    let targetCreatorId = user.creatorId;
    if (user.role === 'CREATOR' && !targetCreatorId) {
      const creatorRecord = await prisma.creator.findUnique({
        where: { userId: user.userId },
      });
      targetCreatorId = creatorRecord?.id;
    }

    if (!targetCreatorId && user.role === 'CREATOR') {
      const firstCreator = await prisma.creator.findFirst();
      targetCreatorId = firstCreator?.id;
    }

    // Auto-ensure all collaborations for this creator have a conversation created
    if (targetCreatorId) {
      const collabsWithoutConv = await prisma.collaboration.findMany({
        where: {
          creatorId: targetCreatorId,
          conversation: null,
        },
        include: {
          company: { include: { user: true } },
          campaign: true,
        },
      });

      for (const collab of collabsWithoutConv) {
        await prisma.conversation.create({
          data: {
            collaborationId: collab.id,
            messages: {
              create: {
                senderId: collab.company.userId,
                content: `Hi! We're excited to collaborate with you on our "${collab.campaign.title}" campaign. Please let us know if you have any questions regarding the brief or target audience angles!`,
              },
            },
          },
        });
      }
    }

    // Auto-ensure all collaborations for company have a conversation created
    if (user.role === 'COMPANY' && user.companyId) {
      const companyCollabsWithoutConv = await prisma.collaboration.findMany({
        where: {
          companyId: user.companyId,
          conversation: null,
        },
        include: {
          company: { include: { user: true } },
          campaign: true,
        },
      });

      for (const collab of companyCollabsWithoutConv) {
        await prisma.conversation.create({
          data: {
            collaborationId: collab.id,
            messages: {
              create: {
                senderId: collab.company.userId,
                content: `Hi! We're excited to collaborate with you on our "${collab.campaign.title}" campaign. Please let us know if you have any questions regarding the brief or target audience angles!`,
              },
            },
          },
        });
      }
    }

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

    // List all conversations for current user
    const whereCondition: any = {};
    if (user.role === 'COMPANY' && user.companyId) {
      whereCondition.collaboration = { companyId: user.companyId };
    } else if (targetCreatorId) {
      whereCondition.collaboration = { creatorId: targetCreatorId };
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

    // Optional simulated smart reply from brand if creator sent the message
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        collaboration: {
          include: {
            company: { include: { user: true } },
          },
        },
      },
    });

    if (conversation && conversation.collaboration.company.userId !== user.userId) {
      // Creator sent to company: schedule simulated reply after 1.5s
      const companyUser = conversation.collaboration.company.user;
      setTimeout(async () => {
        try {
          await prisma.message.create({
            data: {
              conversationId,
              senderId: companyUser.id,
              content: `Thanks for the update! Our marketing team has received your message and will review the post details shortly. Let us know when the draft is ready for proofing!`,
            },
          });
          await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
          });
        } catch (err) {
          // ignore background timeout error
        }
      }, 1500);
    }

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
