import { auth } from "@/auth";
import { redirect } from "next/navigation";

import MessagesClient from "@/components/communications/messages-client";
import { getConversations } from "@/actions/communication/conversations";

export default async function MessagesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const result = await getConversations();

  return (
    <MessagesClient
      conversations={
        result.success
          ? result.conversations
          : []
      }
    />
  );
}