"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getConversations() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        conversations: [],
        error: "Unauthorized",
      };
    }

    const userId = session.user.id;

    const conversations =
      await prisma.conversation.findMany({
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              order: true,
            },
          },

          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                },
              },
            },
          },

          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              id: true,
              content: true,
              senderId: true,
              createdAt: true,
            },
          },
        },

        orderBy: [
          {
            type: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
      });

    const result = conversations.map(
      (conversation) => {
        const currentParticipant =
          conversation.participants.find(
            (participant) =>
              participant.userId === userId,
          );

        const lastReadAt =
          currentParticipant?.lastReadAt ?? null;

        const lastMessage =
          conversation.messages[0] ?? null;

        const unread =
          !!lastMessage &&
          lastMessage.senderId !== userId &&
          (!lastReadAt ||
            lastMessage.createdAt > lastReadAt);

        return {
          id: conversation.id,
          type: conversation.type,

          lesson: conversation.lesson
            ? {
                id: conversation.lesson.id,
                title: conversation.lesson.title,
                order: conversation.lesson.order,
              }
            : null,

          createdAt:
            conversation.createdAt.toISOString(),

          participants:
            conversation.participants
              .filter(
                (participant) =>
                  participant.userId !== userId,
              )
              .map((participant) => ({
                id: participant.user.id,
                name: participant.user.name,
                role: participant.user.role,
              })),

          lastMessage: lastMessage
            ? {
                id: lastMessage.id,
                content: lastMessage.content,
                senderId: lastMessage.senderId,
                createdAt:
                  lastMessage.createdAt.toISOString(),
              }
            : null,

          unread,
        };
      },
    );

    return {
      success: true,
      conversations: result,
    };
  } catch (error) {
    console.error(
      "getConversations error:",
      error,
    );

    return {
      success: false,
      conversations: [],
      error: "Failed to load conversations",
    };
  }
}