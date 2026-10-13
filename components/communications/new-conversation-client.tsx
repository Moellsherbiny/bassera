"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  PaperPlane,
  Person,
} from "@gravity-ui/icons";

import { Button, Input } from "@heroui/react";

type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

interface ConversationUser {
  id: string;
  name: string | null;
  role: UserRole;
}

interface NewConversationClientProps {
  user: ConversationUser;
}

export default function NewConversationClient({
  user,
}: NewConversationClientProps) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const roleLabel =
    user.role === "TEACHER"
      ? "مدرس"
      : user.role === "STUDENT"
        ? "طالب"
        : "مدير";

  const handleBack = () => {
    router.back();
  };

  const handleSend = async () => {
    const content = message.trim();

    if (!content || sending) {
      return;
    }

    setSending(true);

    try {
      /*
       * هنضيف هنا Server Action إرسال الرسالة.
       *
       * الـ Action هو اللي هيعمل:
       * 1. البحث عن Conversation موجودة بين الطرفين.
       * 2. لو موجودة يستخدمها.
       * 3. لو مش موجودة ينشئ Conversation.
       * 4. ينشئ المشاركين.
       * 5. يحفظ أول Message.
       * 6. يرجع conversationId.
       */

      console.log("SEND MESSAGE", {
        recipientId: user.id,
        content,
      });

      /*
       * مؤقتًا فقط:
       * بعد ما نعمل الـ Server Action هنستبدل الجزء ده
       * بـ router.replace(`/dashboard/messages/${conversationId}`)
       */

      setMessage("");
    } catch (error) {
      console.error("SEND_MESSAGE_ERROR:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-120px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-4">
        <Button
          isIconOnly
          variant="tertiary"
          aria-label="رجوع"
          onPress={handleBack}
        >
          <ArrowLeft />
        </Button>

        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-default">
          <Person className="size-5" />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">
            {user.name || "مستخدم"}
          </h1>

          <p className="text-xs text-muted">
            {roleLabel}
          </p>
        </div>
      </div>

      {/* Empty conversation */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-default">
            <Person className="size-7 text-muted" />
          </div>

          <h2 className="text-base font-semibold">
            ابدأ المحادثة
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            لم تبدأ هذه المحادثة بعد. أرسل أول رسالة
            للبدء في التواصل مع {user.name || "هذا المستخدم"}.
          </p>
        </div>
      </div>

      {/* Composer */}
      <div className="border-t bg-background p-4">
        <div className="flex items-end gap-2">
          <Input
            fullWidth
            variant="secondary"
            aria-label="اكتب رسالتك"
            placeholder="اكتب رسالتك..."
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                handleSend();
              }
            }}
            disabled={sending}
            className="min-h-11"
          />

          <Button
            variant="primary"
            isIconOnly
            aria-label="إرسال الرسالة"
            onPress={handleSend}
            isDisabled={!message.trim() || sending}
          >
            <PaperPlane />
          </Button>
        </div>

        <p className="mt-2 px-1 text-[11px] text-muted">
          اضغط Enter لإرسال الرسالة
        </p>
      </div>
    </div>
  );
}