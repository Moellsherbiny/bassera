
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Magnifier,
  Plus,
  Person,
  Persons,
  HourglassEnd,
  House,

} from "@gravity-ui/icons";

import {
  Button,
  Card,
  Chip,
  Separator,
  Input,
} from "@heroui/react";

type UserRole =
  | "STUDENT"
  | "TEACHER"
  | "ADMIN";

type PersonData = {
  id: string;
  name: string;
  image: string | null;
  role: UserRole;
};

type Conversation = {
  id: string;
  courseId: string | null;
  createdAt: Date;

  participants: PersonData[];

  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
  } | null;
};

type CommunicationClientProps = {
  currentUser: PersonData;
  conversations: Conversation[];
};

export default function CommunicationClient({
  currentUser,
  conversations,
}: CommunicationClientProps) {
  const recentConversations =
    conversations.slice(0, 5);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ================================================= */}
        {/* Header */}
        {/* ================================================= */}

        <section className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-foreground/50">
                <Persons className="size-4" />
                <span>بيئة التعلم</span>
                <ChevronRight className="size-3" />
                <span>التواصل</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                التواصل والتعاون
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-foreground/60">
                تواصل مع معلمك وزملائك، وشارك في مناقشات
                التعلم داخل البيئة التعليمية.
              </p>
            </div>

            <Button
           
              size="lg"
           
            >
            <Plus className="size-4" />
              بدء محادثة
            </Button>
          </div>
        </section>

        {/* ================================================= */}
        {/* Search */}
        {/* ================================================= */}

        <div className="mb-8">
          <Input
            placeholder="ابحث عن شخص أو محادثة..."
            
            className="max-w-2xl"
          />
        </div>

        {/* ================================================= */}
        {/* Main Grid */}
        {/* ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* =============================================== */}
          {/* Left / Main */}
          {/* =============================================== */}

          <div className="space-y-6">

            {/* Start Communication */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">
                  ابدأ التواصل
                </h2>

                <p className="mt-1 text-sm text-foreground/50">
                  اختر الطريقة المناسبة للتواصل.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Direct */}
                <CommunicationActionCard
                  icon={
                    <Person className="size-6" />
                  }
                  title="محادثة فردية"
                  description="تحدث بشكل مباشر مع المعلم أو أحد زملائك."
                  href="/dashboard/communication/individual"
                />

                {/* Group */}
                <CommunicationActionCard
                  icon={
                    <Persons className="size-6" />
                  }
                  title="محادثة جماعية"
                  description="أنشئ مجموعة وشارك الأفكار والأسئلة مع زملائك."
                  href="/dashboard/communication/group"
                />
              </div>
            </section>

            {/* Learning Discussions */}
            <section>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    مناقشات التعلم
                  </h2>

                  <p className="mt-1 text-sm text-foreground/50">
                    شارك في النقاشات المرتبطة بالمحتوى التعليمي.
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
              
                >
                    <ArrowLeft className="size-4" />
                    <Link 
                  href="/dashboard/messages"
>

                  كل الرسائل
</Link>
                </Button>
              </div>

              <Card className="overflow-hidden">
                <div className="divide-y">
                  <DiscussionRow
                    title="مناقشة الدرس الحالي"
                    description="شارك زملاءك أفكارك أو اسأل عن النقاط غير الواضحة."
                    icon={
                      <House className="size-5" />
                    }
                  />

                  <DiscussionRow
                    title="مناقشة عامة"
                    description="تبادل الأسئلة والملاحظات مع باقي المتعلمين."
                    icon={
                      <Persons className="size-5" />
                    }
                  />
                </div>
              </Card>
            </section>

            {/* Recent Conversations */}
            <section>
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    آخر المحادثات
                  </h2>

                  <p className="mt-1 text-sm text-foreground/50">
                    استكمل محادثاتك الأخيرة.
                  </p>
                </div>

                <Button
                  
                  variant="ghost"
                  size="sm"
                
                >
                <ArrowLeft className="size-4" />
                    <Link
                  href="/dashboard/messages"
                    
                    >
                  عرض الكل
                    </Link>
                </Button>
              </div>

              {recentConversations.length > 0 ? (
                <Card className="overflow-hidden">
                  <div className="divide-y">
                    {recentConversations.map(
                      (conversation) => (
                        <ConversationRow
                          key={conversation.id}
                          conversation={
                            conversation
                          }
                          currentUserId={
                            currentUser.id
                          }
                        />
                      ),
                    )}
                  </div>
                </Card>
              ) : (
                <EmptyConversations />
              )}
            </section>
          </div>

          {/* =============================================== */}
          {/* Right */}
          {/* =============================================== */}

          <aside className="space-y-6">

            {/* Communication Info */}
            <Card>
              <div className="p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Persons className="size-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      مجتمع التعلم
                    </h3>

                    <p className="text-xs text-foreground/50">
                      تعلم وتواصل وتعاون
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-7 text-foreground/60">
                  استخدم التواصل لطرح الأسئلة، ومشاركة
                  الأفكار، والتعاون مع المعلم وزملائك أثناء
                  رحلة التعلم.
                </p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="p-5">
                <h3 className="mb-4 font-semibold">
                  وصول سريع
                </h3>

                <div className="space-y-2">
                  <QuickAction
                    icon={
                      <Person className="size-4" />
                    }
                    title="رسائلي"
                    href="/dashboard/messages"
                  />

                  <QuickAction
                    icon={
                      <Persons className="size-4" />
                    }
                    title="المجموعات"
                    href="/dashboard/messages"
                  />

                  <QuickAction
                    icon={
                      < HourglassEnd className="size-4" />
                    }
                    title="مناقشات الدروس"
                    href="/dashboard/messages"
                  />
                </div>
              </div>
            </Card>

          </aside>
        </div>
      </div>
    </main>
  );
}

/* ========================================================= */
/* Communication Action Card */
/* ========================================================= */

function CommunicationActionCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card
      
     
      className="group cursor-pointer transition-transform hover:-translate-y-0.5"
    >
        <Link href={href}>
      <div className="p-6">
        <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          {icon}
        </div>

        <h3 className="text-base font-semibold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-foreground/60">
          {description}
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-accent">
          <span>ابدأ الآن</span>
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </div>
      </div>
      </Link>
    </Card>
  );
}

/* ========================================================= */
/* Discussion Row */
/* ========================================================= */

function DiscussionRow({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group flex cursor-pointer items-center gap-4 p-5 transition-colors hover:bg-foreground/[0.03]">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-medium">
          {title}
        </h3>

        <p className="mt-1 truncate text-sm text-foreground/50">
          {description}
        </p>
      </div>

      <ArrowLeft className="size-4 shrink-0 text-foreground/30 transition-transform group-hover:-translate-x-1" />
    </div>
  );
}

/* ========================================================= */
/* Conversation Row */
/* ========================================================= */

function ConversationRow({
  conversation,
  currentUserId,
}: {
  conversation: Conversation;
  currentUserId: string;
}) {
  const otherParticipants =
    conversation.participants.filter(
      (participant) =>
        participant.id !== currentUserId,
    );

  const isGroup =
    conversation.participants.length > 2;

  const title = isGroup
    ? otherParticipants
        .slice(0, 3)
        .map((user) => user.name)
        .join("، ")
    : otherParticipants[0]?.name ??
      "محادثة";

  const lastMessage =
    conversation.lastMessage;

  return (
    <Link
      href={`/dashboard/messages/${conversation.id}`}
      className="group flex items-center gap-4 p-5 transition-colors hover:bg-foreground/[0.03]"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent">
        {isGroup ? (
          <Persons className="size-5" />
        ) : (
          getInitial(title)
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate font-medium">
            {title}
          </h3>

          {lastMessage && (
            <span className="shrink-0 text-xs text-foreground/40">
              {formatTime(
                lastMessage.createdAt,
              )}
            </span>
          )}
        </div>

        <p className="mt-1 truncate text-sm text-foreground/50">
          {lastMessage?.content ??
            "لا توجد رسائل بعد"}
        </p>
      </div>

      <ArrowLeft className="size-4 shrink-0 text-foreground/30 transition-transform group-hover:-translate-x-1" />
    </Link>
  );
}

/* ========================================================= */
/* Quick Action */
/* ========================================================= */

function QuickAction({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl p-3 text-sm transition-colors hover:bg-foreground/[0.04]"
    >
      <div className="flex size-8 items-center justify-center rounded-lg bg-foreground/[0.05]">
        {icon}
      </div>

      <span className="flex-1">
        {title}
      </span>

      <ArrowLeft className="size-3.5 text-foreground/30" />
    </Link>
  );
}

/* ========================================================= */
/* Empty */
/* ========================================================= */

function EmptyConversations() {
  return (
    <Card>
      <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-foreground/[0.05]">
          <Person className="size-5 text-foreground/40" />
        </div>

        <h3 className="mt-4 font-medium">
          لا توجد محادثات بعد
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-foreground/50">
          ابدأ محادثة مع المعلم أو أحد زملائك
          للتواصل والتعاون.
        </p>
      </div>
    </Card>
  );
}

/* ========================================================= */
/* Helpers */
/* ========================================================= */

function getInitial(name: string) {
  return name.trim().charAt(0) || "؟";
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("ar-EG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}
