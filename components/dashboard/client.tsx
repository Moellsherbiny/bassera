"use client";

import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  ChartBar,
  CircleCheck,
  Sparkles,
} from "@gravity-ui/icons";

import { Button, Avatar } from "@heroui/react";
import { OverviewDashboard } from "@/components/dashboard/overview-dash";
import { CurrentLearningCard } from "./current-learning-card";
type DashboardClientProps = {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    role: "STUDENT" | "TEACHER" | "ADMIN";
  };

  course: {
    id: string;
    title: string;
    description: string | null;
    totalLessons: number;
    completedLessons: number;
    progress: number;

    currentLesson: {
      id: string;
      title: string;
      order: number;
    } | null;
  } | null;

  stats: {
    completedLessons: number;
    totalLessons: number;
    progress: number;
    passedAttempts: number;
    averageScore: number;
  };

  latestAttempt: {
    id: string;
    score: number;
    passed: boolean;
    startedAt: Date;
    submittedAt: Date | null;

    exam: {
      id: string;
      type: "LESSON_QUIZ" | "FINAL_EXAM";
      lessonId: string | null;
      courseId: string | null;
    };
  } | null;
};

function getFirstName(name: string | null) {
  if (!name?.trim()) {
    return "الطالب";
  }

  return name.trim().split(/\s+/)[0];
}

function getProgressLabel(progress: number) {
  if (progress === 0) return "لم تبدأ رحلتك بعد";
  if (progress < 50) return "بداية جيدة";
  if (progress < 80) return "تقدم ممتاز";
  if (progress < 100) return "اقتربت من النهاية";

  return "اكتملت الرحلة";
}

export default function DashboardClient({
  user,
  course,
  stats,
  latestAttempt,
}: DashboardClientProps) {
  const firstName = getFirstName(user.name);

  const isCourseCompleted = course?.progress === 100;

  const progressLabel = getProgressLabel(course?.progress ?? 0);
  const currentDate = new Date();

  const greeting = currentDate.getHours() >= 12 ? "مساء الخير" : "صباح الخير";
  return (
    <main dir="rtl" className="mx-auto w-full max-w-7xl space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-[1.75rem] border border-default-200 bg-background">
        {/* Background Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--heroui-default-200) / 0.35) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--heroui-default-200) / 0.35) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "linear-gradient(to left, black 0%, transparent 75%)",
          }}
        />

        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Main Identity */}
          <div className="flex items-center gap-5">
            {/* Status Indicator */}
            <div className="relative mt-1 hidden sm:block">
              <Avatar color="default" size="lg">
                <Avatar.Image
                  alt={user.name ?? "username"}
                  src={user.image ?? ""}
                />
                <Avatar.Fallback>{user.name?.at(0)}</Avatar.Fallback>
              </Avatar>
            </div>

            <div className="min-w-0">
              {/* Eyebrow */}
              <div className="mb-3 flex items-center gap-2">
                <span className="h-px w-6 bg-primary" />
              </div>

              {/* Greeting */}
              <div className="flex gap-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                <span className="underline underline-offset-[12px] decoration-accent decoration-dashed">{greeting}</span>
                <div className="relative z-1">
                  <span className="absolute h-3 w-full bg-accent/50 -z-10 translate-y-3/3 -skew-6 rounded-br-sm rounded-tl-sm" />
                  {firstName}
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 max-w-2xl text-sm leading-7 text-default-500">
                {course
                  ? "رحلتك مستمرة. بصيرة تتابع تقدمك وتساعدك على الوصول إلى الخطوة التعليمية التالية."
                  : "مساحتك التعليمية جاهزة. ابدأ رحلتك داخل بصيرة."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <CurrentLearningCard course={course} progressLabel={progressLabel} />
      {/* =====================================================
          Statistics
      ====================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <OverviewDashboard
          icon={<ChartBar className="size-5" />}
          title="التقدم الدراسي"
          description="نسبة إنجازك في المقرر الحالي"
          value={`${stats.progress}%`}
          valueLabel={`${stats.completedLessons} من ${stats.totalLessons} درس`}
          linkLabel="عرض الدروس"
          href="/dashboard/lessons"
        />

        <OverviewDashboard
          icon={<BookOpen className="size-5" />}
          title="متوسط الأداء"
          description="متوسط نتائج الاختبارات التي أكملتها"
          value={`${stats.averageScore}%`}
          valueLabel={
            latestAttempt ? "متوسط نتائج الاختبارات" : "لم تبدأ الاختبارات بعد"
          }
          linkLabel="عرض النتائج"
          href="/dashboard/student/results"
        />

        <OverviewDashboard
          icon={<CircleCheck className="size-5" />}
          title="اختبارات ناجحة"
          description="اختبارات تم اجتيازها بنجاح"
          value={stats.passedAttempts}
          valueLabel="اختبار ناجح"
        />
      </section>

      {/* =====================================================
          Learning + Latest Result
      ====================================================== */}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Learning Path */}

        <section className="overflow-hidden rounded-2xl border border-default-200 bg-background">
          <div className="flex items-center justify-between border-b border-default-200 px-5 py-4">
            <div>
              <h2 className="font-bold">مسارك التعليمي</h2>

              <p className="mt-1 text-xs text-default-400">
                تقدمك في الدورة الحالية
              </p>
            </div>

            <BookOpen className="size-5 text-default-400" />
          </div>

          <div className="p-5">
            {course ? (
              <div className="space-y-1">
                <ProgressSummary
                  title="التقدم الحالي"
                  subtitle={`${course.completedLessons} من ${course.totalLessons} درس مكتمل`}
                  progress={course.progress}
                  active={!isCourseCompleted}
                  completed={isCourseCompleted}
                />

                <div className="my-4 h-px bg-default-100" />
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </section>

        {/* Latest Result */}

        <section className="overflow-hidden rounded-2xl border border-default-200 bg-background">
          <div className="border-b border-default-200 px-5 py-4">
            <h2 className="font-bold">آخر نتيجة</h2>

            <p className="mt-1 text-xs text-default-400">
              أحدث اختبار قمت بأدائه
            </p>
          </div>

          {latestAttempt ? (
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-11 items-center justify-center rounded-xl ${
                      latestAttempt.passed
                        ? "bg-success/10 text-success"
                        : "bg-danger/10 text-danger"
                    }`}
                  >
                    {latestAttempt.passed ? (
                      <CircleCheck className="size-5" />
                    ) : (
                      <ChartBar className="size-5" />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {latestAttempt.exam.type === "FINAL_EXAM"
                        ? "الاختبار النهائي"
                        : "اختبار الدرس"}
                    </p>

                    <p className="mt-1 text-xs text-default-400">
                      {latestAttempt.passed
                        ? "تم اجتيازه بنجاح"
                        : "لم يتم اجتيازه"}
                    </p>
                  </div>
                </div>

                <div className="text-left">
                  <p
                    className={`text-2xl font-bold ${
                      latestAttempt.passed ? "text-success" : "text-danger"
                    }`}
                  >
                    {latestAttempt.score}%
                  </p>

                  <p className="text-[11px] text-default-400">النتيجة</p>
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-default-100">
                <div
                  className={
                    latestAttempt.passed
                      ? "h-full rounded-full bg-success"
                      : "h-full rounded-full bg-danger"
                  }
                  style={{
                    width: `${latestAttempt.score}%`,
                  }}
                />
              </div>

              {!latestAttempt.passed && latestAttempt.exam.lessonId && (
                <Button variant="secondary" className="mt-5 w-full">
                  <ArrowLeft className="size-4" />
                  <Link
                    href={`/dashboard/lessons/${latestAttempt.exam.lessonId}`}
                  >
                    مراجعة الدرس والمحاولة مرة أخرى
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <EmptyState text="لم تقم بأي اختبار حتى الآن." />
          )}
        </section>
      </section>

      {/* =====================================================
          AI Insight
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-primary/15 bg-primary/[0.035]">
        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="size-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold">بصيرة تقترح لك</h2>

                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  AI
                </span>
              </div>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-default-500">
                {latestAttempt && !latestAttempt.passed
                  ? "آخر نتيجة تشير إلى أنك تحتاج إلى مراجعة الدرس. يمكنك العودة للمحتوى ومحاولة الاختبار مرة أخرى."
                  : stats.progress === 0
                    ? "ابدأ بالدرس الأول، وسيتابع النظام تقدمك ليحدد الخطوة المناسبة لك."
                    : isCourseCompleted
                      ? "أكملت جميع الدروس. يمكنك الآن مراجعة أدائك والاستعداد للاختبار النهائي."
                      : "استمر في التعلم. أكمل الدرس الحالي لتحصل على الخطوة التالية المناسبة لك."}
              </p>
            </div>
          </div>

          {course?.currentLesson && (
            <Button variant="secondary" className="w-full shrink-0 sm:w-auto">
              <Link
                className="flex items-center gap-2"
                href={`/dashboard/lessons/${course.currentLesson.id}`}
              >
                <ArrowLeft className="size-4" />
                متابعة التعلم
              </Link>
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   Learning Path
============================================================ */

function ProgressSummary({
  title,
  subtitle,
  progress,
  active,
  completed,
}: {
  title: string;
  subtitle: string;
  progress: number;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
          completed
            ? "bg-success/10 text-success"
            : active
              ? "bg-primary/10 text-primary"
              : "bg-default-100 text-default-400"
        }`}
      >
        {completed ? (
          <CircleCheck className="size-5" />
        ) : (
          <BookOpen className="size-5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold">{title}</p>

          <span className="text-xs font-bold text-primary">{progress}%</span>
        </div>

        <p className="mt-1 text-xs text-default-400">{subtitle}</p>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-default-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Empty State
============================================================ */

function EmptyState({
  text = "لا توجد بيانات متاحة حاليًا.",
}: {
  text?: string;
}) {
  return (
    <div className="flex min-h-32 items-center justify-center text-center">
      <p className="text-sm text-default-400">{text}</p>
    </div>
  );
}
