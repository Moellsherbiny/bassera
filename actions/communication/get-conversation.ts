
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getConversation(
  conversationId: string,
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        conversation: null,
        error: "Unauthorized",
      };
    }

    const userId = session.user.id;

    const conversation =
      await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },

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
                  image: true,
                },
              },
            },
          },

          messages: {
            orderBy: {
              createdAt: "asc",
            },

            select: {
              id: true,
              content: true,
              senderId: true,
              createdAt: true,

              sender: {
                select: {
                  id: true,
                  name: true,
                  role: true,
                  image: true,
                },
              },
            },
          },
        },
      });

    if (!conversation) {
      return {
        success: false,
        conversation: null,
        error: "Conversation not found",
      };
    }

    const currentParticipant =
      conversation.participants.find(
        (participant) =>
          participant.userId === userId,
      );

    return {
      success: true,

      conversation: {
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
          conversation.participants.map(
            (participant) => ({
              id: participant.user.id,
              name: participant.user.name,
              role: participant.user.role,
              image: participant.user.image,
            }),
          ),

        messages: conversation.messages.map(
          (message) => ({
            id: message.id,
            content: message.content,
            senderId: message.senderId,
            createdAt:
              message.createdAt.toISOString(),

            sender: {
              id: message.sender.id,
              name: message.sender.name,
              role: message.sender.role,
              image: message.sender.image,
            },
          }),
        ),

        currentUserId: userId,

        lastReadAt:
          currentParticipant?.lastReadAt
            ?.toISOString() ?? null,
      },
    };
  } catch (error) {
    console.error(
      "getConversation error:",
      error,
    );

    return {
      success: false,
      conversation: null,
      error: "Failed to load conversation",
    };
  }
}
