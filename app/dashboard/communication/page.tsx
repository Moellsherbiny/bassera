
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import CommunicationClient from "@/components/communications/communications-client";

export default async function CommunicationPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const conversations =
    await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
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
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

  return (
    <CommunicationClient
      currentUser={{
        id: userId,
        name: session.user.name ?? "المستخدم",
        image: session.user.image ?? null,
        role: session.user.role,
      }}
      conversations={conversations.map(
        (conversation) => ({
          id: conversation.id,
          courseId: conversation.courseId,
          createdAt: conversation.createdAt,

          participants:
            conversation.participants.map(
              (participant) => ({
                id: participant.user.id,
                name:
                  participant.user.name ??
                  "مستخدم",
                image:
                  participant.user.image ?? null,
                role: participant.user.role,
              }),
            ),

          lastMessage:
            conversation.messages[0]
              ? {
                  id:
                    conversation.messages[0].id,
                  content:
                    conversation.messages[0]
                      .content,
                  senderId:
                    conversation.messages[0]
                      .senderId,
                  createdAt:
                    conversation.messages[0]
                      .createdAt,
                }
              : null,
        }),
      )}
    />
  );
}
