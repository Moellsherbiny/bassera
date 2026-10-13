
"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowsExpandVertical,
  Paperclip,
  PaperPlane,
  Persons,
} from "@gravity-ui/icons";
import { Button, Input } from "@heroui/react";



type ConversationType = "DIRECT" | "COURSE" | "LESSON" | "GENERAL";

interface Participant {
  id: string;
  name: string | null;
  role: string;
}

interface MessageItem {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    role: string;
  };
}

interface LessonInfo {
  id: string;
  title: string;
  order: number;
}

interface ConversationData {
  id: string;
  type: ConversationType;
  lesson: LessonInfo | null;
  participants: Participant[];
  messages: MessageItem[];
  currentUserId: string;
  lastReadAt: string | null;
}

interface ConversationClientProps {
  conversation: ConversationData;
}

function getConversationTitle(conversation: ConversationData) {
  switch (conversation.type) {
    case "GENERAL":
      return "المجموعة العامة";

    case "COURSE":
      return "مجموعة الكورس";

    case "LESSON":
      return conversation.lesson?.title ?? "مجموعة الدرس";

    case "DIRECT": {
      const participant = conversation.participants[0];

      return participant?.name ?? "محادثة";
    }

    default:
      return "محادثة";
  }
}

function getConversationSubtitle(conversation: ConversationData) {
  switch (conversation.type) {
    case "GENERAL":
      return "المجموعة العامة";

    case "COURSE":
      return "جميع أعضاء الكورس";

    case "LESSON":
      return conversation.lesson
        ? `الدرس ${conversation.lesson.order}`
        : "مجموعة الدرس";

    case "DIRECT":
      return "محادثة خاصة";

    default:
      return "";
  }
}

function getInitials(name: string | null) {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function formatTime(dateString: string) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function ConversationClient({
  conversation,
}: ConversationClientProps) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const title = useMemo(
    () => getConversationTitle(conversation),
    [conversation],
  );

  const subtitle = useMemo(
    () => getConversationSubtitle(conversation),
    [conversation],
  );

  const isGroup = conversation.type !== "DIRECT";

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const content = message.trim();

    if (!content || isSending) {
      return;
    }

    try {
      setIsSending(true);

      /*
       * هنضيف هنا الـ server action الخاص بإرسال الرسالة.
       *
       * مثال:
       *
       * const result = await sendMessage({
       *   conversationId: conversation.id,
       *   content,
       * });
       *
       * if (!result.success) {
       *   throw new Error(result.error);
       * }
       */

      console.log("Send message:", {
        conversationId: conversation.id,
        content,
      });

      setMessage("");

      router.refresh();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-[600px] flex-col overflow-hidden rounded-2xl border bg-background shadow-sm">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b bg-background px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {/* Back */}
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            className="shrink-0 rounded-xl"
          >
            <Link href="/dashboard/messages">
              <ArrowRight className="h-5 w-5" />
              <span className="sr-only">العودة للمحادثات</span>
            </Link>
          </Button>

          {/* Avatar */}
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              isGroup
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            {isGroup ? (
              <Persons className="h-5 w-5" />
            ) : (
              <span className="text-sm font-semibold">
                {getInitials(conversation.participants[0]?.name ?? null)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold sm:text-base">
              {title}
            </h1>

            <p className="truncate text-xs text-muted-foreground">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Actions */}
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          className="shrink-0 rounded-xl"
        >
          <ArrowsExpandVertical className="h-5 w-5" />
          <span className="sr-only">المزيد</span>
        </Button>
      </header>

      {/* Lesson shortcut */}
      {conversation.type === "LESSON" && conversation.lesson && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b bg-muted/30 px-4 py-2.5 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              مرتبط بالدرس
            </p>

            <p className="truncate text-sm font-semibold">
              {conversation.lesson.title}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            isIconOnly
            className="shrink-0 rounded-lg"
            
          >
            <Link href={`/dashboard/lessons/${conversation.lesson.id}`}>
              فتح الدرس
            </Link>
          </Button>
        </div>
      )}

      {/* Messages */}
      <main className="flex-1 overflow-y-auto bg-muted/10 px-4 py-5 sm:px-6">
        {conversation.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {isGroup ? (
                  <Persons className="h-6 w-6" />
                ) : (
                  <span className="text-lg font-bold">
                    {getInitials(
                      conversation.participants[0]?.name ?? null,
                    )}
                  </span>
                )}
              </div>

              <h2 className="text-base font-semibold">
                ابدأ المحادثة
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                لا توجد رسائل حتى الآن. أرسل أول رسالة لبدء المحادثة.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
            {conversation.messages.map((item, index) => {
              const isMine =
                item.senderId === conversation.currentUserId;

              const previousMessage =
                conversation.messages[index - 1];

              const showDate =
                !previousMessage ||
                new Date(previousMessage.createdAt).toDateString() !==
                  new Date(item.createdAt).toDateString();

              return (
                <div key={item.id}>
                  {/* Date separator */}
                  {showDate && (
                    <div className="my-5 flex items-center justify-center">
                      <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  )}

                  <div
                    className={[
                      "flex w-full gap-2",
                      isMine ? "justify-start" : "justify-end",
                    ].join(" ")}
                  >
                    {/* Other user's avatar */}
                    {!isMine && (
                      <div className="order-2 mt-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {getInitials(item.sender.name)}
                      </div>
                    )}

                    <div
                      className={[
                        "flex max-w-[85%] flex-col sm:max-w-[70%]",
                        isMine ? "items-start" : "items-end",
                      ].join(" ")}
                    >
                      {/* Sender name for groups */}
                      {isGroup && !isMine && (
                        <span className="mb-1 px-1 text-[11px] font-medium text-muted-foreground">
                          {item.sender.name ?? "مستخدم"}
                        </span>
                      )}

                      <div
                        className={[
                          "rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm",
                          isMine
                            ? "rounded-tr-md bg-primary text-primary-foreground"
                            : "rounded-tl-md bg-background",
                        ].join(" ")}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {item.content}
                        </p>
                      </div>

                      <span className="mt-1 px-1 text-[10px] text-muted-foreground">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Composer */}
      <footer className="shrink-0 border-t bg-background p-3 sm:p-4">
        <form
          onSubmit={handleSend}
          className="mx-auto flex w-full max-w-4xl items-center gap-2"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            isIconOnly
            className="hidden shrink-0 rounded-xl sm:flex"
            isDisabled
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">إرفاق ملف</span>
          </Button>

          <Input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="اكتب رسالتك..."
            disabled={isSending}
            className="h-11 rounded-xl border-muted-foreground/20 bg-muted/30 px-4 focus-visible:ring-1"
          />

          <Button
            type="submit"
            size="sm"
            isIconOnly
            isDisabled={!message.trim() || isSending}
            className="h-11 w-11 shrink-0 rounded-xl"
          >
            <PaperPlane className="h-5 w-5" />
            <span className="sr-only">إرسال</span>
          </Button>
        </form>
      </footer>
    </div>
  );
}
