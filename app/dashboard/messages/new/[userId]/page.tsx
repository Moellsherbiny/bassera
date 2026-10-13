import { redirect, notFound } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import NewConversationClient from "@/components/communications/new-conversation-client";

interface NewConversationPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function NewConversationPage({
  params,
}: NewConversationPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { userId } = await params;

  const currentUserId = session.user.id;

  // منع مراسلة النفس
  if (currentUserId === userId) {
    redirect("/dashboard/messages");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <NewConversationClient
      user={user}
    />
  );
}


