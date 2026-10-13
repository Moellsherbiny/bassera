
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  Comment,
  Persons,
  Person,
} from "@gravity-ui/icons";

import {
  Button,
  Input,
  Label,
  SearchField,
  Tabs,
} from "@heroui/react";

import NewConversationDialog from "./new-conversation-dialog";

/* =========================================
   Types
========================================= */

type ConversationType =
  | "DIRECT"
  | "COURSE"
  | "LESSON"
  | "GENERAL";

type ConversationParticipant = {
  id: string;
  name: string | null;
  role: string;
};

type LastMessage = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
};

export type ConversationItem = {
  id: string;
  type: ConversationType;

  lesson: {
    id: string;
    title: string;
    order: number;
  } | null;

  createdAt: string;

  participants: ConversationParticipant[];

  lastMessage: LastMessage | null;

  unread: boolean;
};

interface MessagesClientProps {
  conversations: ConversationItem[];
}

type FilterType = "ALL" | "DIRECT" | "GROUP";

/* =========================================
   Helpers
========================================= */

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return (
      parts[0]?.slice(0, 2).toUpperCase() || "؟"
    );
  }

  return `${parts[0]?.[0] || ""}${
    parts[parts.length - 1]?.[0] || ""
  }`.toUpperCase();
}

/* =========================================
   Conversation Type
========================================= */

function getConversationType(
  conversation: ConversationItem,
): "DIRECT" | "GROUP" {
  return conversation.type === "DIRECT"
    ? "DIRECT"
    : "GROUP";
}

/* =========================================
   Conversation Name
========================================= */

function getConversationName(
  conversation: ConversationItem,
) {
  switch (conversation.type) {
    case "GENERAL":
      return "المجموعة العامة";

    case "COURSE":
      return "مجموعة الدورة التعليمية";

    case "LESSON":
      return (
        conversation.lesson?.title ||
        "مجموعة الدرس"
      );

    case "DIRECT": {
      const participants =
        conversation.participants;

      if (participants.length === 0) {
        return "محادثة";
      }

      if (participants.length === 1) {
        return (
          participants[0]?.name || "مستخدم"
        );
      }

      const names = participants
        .slice(0, 3)
        .map(
          (participant) =>
            participant.name || "مستخدم",
        );

      if (participants.length > 3) {
        return `${names.join("، ")} +${
          participants.length - 3
        }`;
      }

      return names.join("، ");
    }

    default:
      return "محادثة";
  }
}

/* =========================================
   Message Date
========================================= */

function formatMessageDate(
  dateString: string,
) {
  const date = new Date(dateString);
  const now = new Date();

  const diff =
    now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "الآن";

  if (diff < hour) {
    return `منذ ${Math.floor(
      diff / minute,
    )} د`;
  }

  if (diff < day) {
    return `منذ ${Math.floor(
      diff / hour,
    )} س`;
  }

  if (diff < 2 * day) return "أمس";

  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
  }).format(date);
}

/* =========================================
   Message Preview
========================================= */

function getMessagePreview(
  conversation: ConversationItem,
) {
  if (!conversation.lastMessage) {
    return "ابدأ المحادثة";
  }

  return conversation.lastMessage.content;
}

/* =========================================
   Component
========================================= */

export default function MessagesClient({
  conversations,
}: MessagesClientProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<FilterType>("ALL");

  /* =========================================
     Counts
  ========================================= */

  const counts = useMemo(() => {
    let direct = 0;
    let group = 0;

    for (const conversation of conversations) {
      if (
        getConversationType(conversation) ===
        "DIRECT"
      ) {
        direct += 1;
      } else {
        group += 1;
      }
    }

    return {
      ALL: conversations.length,
      DIRECT: direct,
      GROUP: group,
    };
  }, [conversations]);

  /* =========================================
     Filtering
  ========================================= */

  const filteredConversations =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      return conversations
        .filter((conversation) => {
          const type =
            getConversationType(
              conversation,
            );

          const matchesFilter =
            filter === "ALL" ||
            type === filter;

          if (!matchesFilter) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          const conversationName =
            getConversationName(
              conversation,
            ).toLowerCase();

          const lastMessage =
            conversation.lastMessage?.content?.toLowerCase() ||
            "";

          return (
            conversationName.includes(
              normalizedSearch,
            ) ||
            lastMessage.includes(
              normalizedSearch,
            )
          );
        })
        .sort((a, b) => {
          /*
           * ترتيب المجموعات:
           * GENERAL
           * COURSE
           * LESSON حسب ترتيب الدرس
           * ثم DIRECT
           */

          const order = {
            GENERAL: 0,
            COURSE: 1,
            LESSON: 2,
            DIRECT: 3,
          };

          const aOrder =
            order[a.type];

          const bOrder =
            order[b.type];

          if (aOrder !== bOrder) {
            return aOrder - bOrder;
          }

          if (
            a.type === "LESSON" &&
            b.type === "LESSON"
          ) {
            return (
              (a.lesson?.order ?? 0) -
              (b.lesson?.order ?? 0)
            );
          }

          const aDate = new Date(
            a.lastMessage?.createdAt ||
              a.createdAt,
          ).getTime();

          const bDate = new Date(
            b.lastMessage?.createdAt ||
              b.createdAt,
          ).getTime();

          return bDate - aDate;
        });
    }, [
      conversations,
      filter,
      search,
    ]);

  /* =========================================
     Unread
  ========================================= */

  const unreadCount =
    conversations.filter(
      (conversation) =>
        conversation.unread,
    ).length;

  /* =========================================
     Render
  ========================================= */

  return (
    <main
      dir="rtl"
      className="mx-auto w-full px-4 py-8"
    >
      {/* =====================================
          Header
      ===================================== */}

      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs text-default-400">
            <span>التواصل</span>

            <span className="text-default-300">
              /
            </span>

            <span className="text-default-500">
              الرسائل
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
              الرسائل
            </h1>

            {unreadCount > 0 && (
              <span className="flex size-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {unreadCount}
              </span>
            )}
          </div>

          <p className="mt-1.5 text-sm text-default-500">
            تواصلك مع الطلاب والمعلمين
            في مكان واحد.
          </p>
        </div>

        <NewConversationDialog />
      </header>

      {/* =====================================
          Inbox
      ===================================== */}

      <section className="overflow-hidden rounded-2xl border border-default-200 bg-background">
        {/* ===================================
            Toolbar
        =================================== */}

        <div className="flex flex-col gap-3 border-b border-default-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <Tabs
            variant="secondary"
            selectedKey={filter}
            onSelectionChange={(key) =>
              setFilter(
                key as FilterType,
              )
            }
          >
            <Tabs.ListContainer>
              <Tabs.List aria-label="تصفية المحادثات">
                <Tabs.Tab id="ALL">
                  الكل

                  <span className="ms-1.5 text-xs text-default-400">
                    {counts.ALL}
                  </span>

                  <Tabs.Indicator />
                </Tabs.Tab>

                <Tabs.Tab id="DIRECT">
                  فردية

                  <span className="ms-1.5 text-xs text-default-400">
                    {counts.DIRECT}
                  </span>

                  <Tabs.Indicator />
                </Tabs.Tab>

                <Tabs.Tab id="GROUP">
                  مجموعات

                  <span className="ms-1.5 text-xs text-default-400">
                    {counts.GROUP}
                  </span>

                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>

          <SearchField
            value={search}
            onChange={setSearch}
            className="w-full sm:w-64"
          >
            <Label className="sr-only">
              البحث في المحادثات
            </Label>

            <Input placeholder="ابحث بالاسم أو الرسالة..." />
          </SearchField>
        </div>

        {/* ===================================
            Conversation List
        =================================== */}

        {filteredConversations.length >
        0 ? (
          <ul className="divide-y divide-default-100">
            {filteredConversations.map(
              (conversation) => {
                const type =
                  getConversationType(
                    conversation,
                  );

                const name =
                  getConversationName(
                    conversation,
                  );

                const firstParticipant =
                  conversation
                    .participants[0];

                const preview =
                  getMessagePreview(
                    conversation,
                  );

                const isGroup =
                  type === "GROUP";

                return (
                  <li
                    key={
                      conversation.id
                    }
                  >
                    <Link
                      href={`/dashboard/messages/${conversation.id}`}
                      className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-default-50 sm:px-5"
                    >
                      {/* Avatar */}

                      <div className="relative shrink-0">
                        <div
                          className={[
                            "flex size-11 items-center justify-center rounded-full text-sm font-semibold",
                            isGroup
                              ? "bg-accent/10 text-accent"
                              : "bg-default-100 text-default-600",
                          ].join(" ")}
                        >
                          {isGroup ? (
                            <Persons className="size-4.5" />
                          ) : (
                            <span>
                              {getInitials(
                                firstParticipant?.name ||
                                  "مستخدم",
                              )}
                            </span>
                          )}
                        </div>

                        {conversation.unread && (
                          <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-background bg-accent" />
                        )}
                      </div>

                      {/* Content */}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <h2
                            className={[
                              "truncate text-sm sm:text-[15px]",
                              conversation.unread
                                ? "font-semibold text-foreground"
                                : "font-medium text-foreground",
                            ].join(" ")}
                          >
                            {name}
                          </h2>

                          {conversation.lastMessage && (
                            <time
                              dateTime={
                                conversation
                                  .lastMessage
                                  .createdAt
                              }
                              className="shrink-0 text-xs text-default-400"
                            >
                              {formatMessageDate(
                                conversation
                                  .lastMessage
                                  .createdAt,
                              )}
                            </time>
                          )}
                        </div>

                        {/* Lesson subtitle */}

                        {conversation.type ===
                          "LESSON" &&
                          conversation.lesson && (
                            <p className="mt-0.5 truncate text-xs text-default-400">
                              الدرس{" "}
                              {
                                conversation
                                  .lesson
                                  .order
                              }
                            </p>
                          )}

                        <p
                          className={[
                            "truncate text-xs sm:text-sm",
                            conversation.type ===
                              "LESSON"
                              ? "mt-0.5"
                              : "mt-0.5",
                            conversation.unread
                              ? "text-default-600"
                              : "text-default-400",
                          ].join(" ")}
                        >
                          {preview}
                        </p>
                      </div>

                      <ArrowLeft className="size-4 shrink-0 text-default-300 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                );
              },
            )}
          </ul>
        ) : (
          <EmptyState
            hasSearch={Boolean(
              search.trim(),
            )}
            filter={filter}
            onReset={() => {
              setSearch("");
              setFilter("ALL");
            }}
          />
        )}
      </section>
    </main>
  );
}

/* =========================================
   Empty State
========================================= */

function EmptyState({
  hasSearch,
  filter,
  onReset,
}: {
  hasSearch: boolean;
  filter: FilterType;
  onReset: () => void;
}) {
  let title = "لا توجد محادثات بعد";

  let description =
    "ستظهر هنا محادثاتك عندما تبدأ التواصل.";

  if (hasSearch) {
    title = "لا نتائج مطابقة";

    description =
      "جرّب اسمًا مختلفًا أو جزءًا من نص الرسالة.";
  } else if (filter === "DIRECT") {
    title = "لا توجد محادثات فردية";

    description =
      "لم تبدأ أي محادثة فردية حتى الآن.";
  } else if (filter === "GROUP") {
    title = "لا توجد مجموعات";

    description =
      "ستظهر هنا مجموعات الكورس والدروس.";
  }

  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-default-100">
        <Comment className="size-6 text-default-400" />
      </div>

      <h2 className="text-base font-semibold text-foreground">
        {title}
      </h2>

      <p className="mt-1.5 max-w-xs text-sm leading-6 text-default-500">
        {description}
      </p>

      {(hasSearch ||
        filter !== "ALL") && (
        <Button
          className="mt-5"
          variant="secondary"
          onPress={onReset}
        >
          عرض كل المحادثات
        </Button>
      )}
    </div>
  );
}