
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";

import { getConversation } from "@/actions/communication/get-conversation";
import ConversationClient from "@/components/communications/conversation-client";

interface ConversationPageProps {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { conversationId } = await params;

  const result =
    await getConversation(
      conversationId,
    );

  if (
    !result.success ||
    !result.conversation
  ) {
    notFound();
  }

  return (
    <ConversationClient
      conversation={result.conversation}
    />
  );
}
