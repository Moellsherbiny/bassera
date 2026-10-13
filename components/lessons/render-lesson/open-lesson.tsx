"use client";

import { Card, ProgressBar, Link as HeroLink, Button } from "@heroui/react";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleCheck,
  Clock,
  FileText,
  Lock,
  Sparkles,
  Target,
} from "@gravity-ui/icons";

import { ContentVariantCard } from "./content-varient-card";
import { LessonStatusBadge } from "./lesson-status-badge";
import { InfographicPagination } from "@/components/lessons/infographics/infographic-pagination";
import type { LessonData } from "@/types/lessons";

const ctaClass =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export function OpenLesson({ data }: { data: LessonData }) {
  const {
    lesson,
    course,
    progress,
    contentVariants,
    recommendedRemediation,
    exams,
    attempts,
    externalResources,
    navigation,
    counts,
  } = data;

  // ==========================================
  // Quiz
  // ==========================================
  const latestAttempt = attempts[0] ?? null;

  const lessonQuiz = exams.find((exam) => exam.type === "LESSON_QUIZ");

  const isPassed = progress.status === "PASSED";

  const latestPassedAttempt =
    attempts.find((attempt) => attempt.passed) ?? null;

  const displayedAttempt = isPassed ? latestPassedAttempt : latestAttempt;

  const attemptStatus = displayedAttempt
    ? getAttemptStatus(
        displayedAttempt.score,
        displayedAttempt.exam.passingScore,
      )
    : null;

  const progressValue = isPassed ? 100 : progress.bestScore;
  // ==========================================
  // Main Content
  // ==========================================

  /**
   * الـ Recommended Content هو المحتوى الأساسي
   * الذي سيشاهده الطالب.
   *
   * في حالة وجود recommendedRemediation:
   * نستخدم الـ variant الموجود بداخله.
   *
   * في حالة عدم وجوده:
   * نستخدم أول INFOGRAPHIC كـ fallback.
   */
  const infographicVariants = contentVariants
    .filter((variant) => variant.type === "INFOGRAPHIC")
    .sort((a, b) => a.variantOrder - b.variantOrder);

  const recommendedContent =
    recommendedRemediation?.variant ??
    infographicVariants[0] ??
    contentVariants[0] ??
    null;

  // ==========================================
  // Stats
  // ==========================================

  const stats = [
    {
      icon: Sparkles,
      label: "المحتوى",
      value: contentVariants.length,
      tone: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
    },
    {
      icon: Target,
      label: "الأسئلة",
      value: counts.questions,
      tone: "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
    },
    {
      icon: Clock,
      label: "المحاولات",
      value: attempts.length,
      tone: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    },
  ];

  return (
    <div dir="rtl" className="space-y-8 pb-12">
      {/* ==========================================
          Breadcrumb
      ========================================== */}

      <nav
        aria-label="مسار التنقل"
        className="flex flex-wrap items-center gap-2 text-sm text-default-400"
      >
        <Link
          href="/dashboard"
          className="transition-colors hover:text-foreground"
        >
          لوحة التحكم
        </Link>

        <ArrowLeft className="size-3.5" />

        <Link
          href="/dashboard/lessons"
          className="transition-colors hover:text-foreground"
        >
          الدروس
        </Link>

        <ArrowLeft className="size-3.5" />

        <span className="truncate text-default-600">{lesson.title}</span>
      </nav>

      {/* ==========================================
          Lesson Header
      ========================================== */}

      <Card className="border-default-200">
        <Card.Header>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              <BookOpen className="size-3.5" />
              الدرس {lesson.order}
            </span>

            <LessonStatusBadge status={progress.status} />

            <span className="text-xs text-default-400">
              من {navigation.total} درس
            </span>
          </div>

          <Card.Title className="mt-3 text-2xl leading-tight sm:text-3xl">
            {lesson.title}
          </Card.Title>

          <Card.Description className="max-w-3xl text-sm leading-7">
            {course.description ||
              "استكشف محتوى الدرس وتابع تقدمك ثم انتقل إلى الاختبار عند الانتهاء."}
          </Card.Description>

          <div className="mt-4">
            <Button variant="tertiary">

            <Link
              href={`/dashboard/lessons/${lesson.id}/ai-search`}
              className={ctaClass}
              >
              <Sparkles className="size-4" />
              اسأل مساعد الذكاء الاصطناعي
              <ArrowLeft className="size-4" />
            </Link>
              </Button>
          </div>
        </Card.Header>

        <div className="space-y-6 px-4 pb-5 sm:px-6">
          <ProgressBar
            aria-label="تقدم الدرس"
            value={progressValue}
            className="w-full"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-default-500">
                أفضل نتيجة
              </span>

              <ProgressBar.Output className="text-sm font-bold text-primary" />
            </div>

            <ProgressBar.Track>
              <ProgressBar.Fill />
            </ProgressBar.Track>
          </ProgressBar>

          <dl className="grid grid-cols-3 gap-3 border-t border-default-100 pt-5">
            {stats.map(({ icon: Icon, label, value, tone }) => (
              <div
                key={label}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
                >
                  <Icon className="size-5" />
                </span>

                <div>
                  <dd className="text-lg font-bold leading-6">{value}</dd>

                  <dt className="text-xs text-default-500">{label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </Card>

      {/* ==========================================
          Main Lesson Content
      ========================================== */}

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold">محتوى الدرس</h2>

          <p className="mt-1 text-sm leading-7 text-default-500">
            هذا هو المحتوى المقترح لك بناءً على تقدمك ونتائج محاولاتك السابقة.
          </p>
        </div>

        {recommendedContent ? (
          <Card className="border-default-200">
            <Card.Header>
              <div className="flex flex-wrap items-center gap-2">
                <Card.Title>
                  {recommendedContent.type === "INFOGRAPHIC"
                    ? "المحتوى البصري"
                    : recommendedContent.type === "VIDEO"
                      ? "الفيديو المقترح"
                      : "النشاط التفاعلي المقترح"}
                </Card.Title>

                {recommendedRemediation && (
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    محتوى مقترح
                  </span>
                )}
              </div>

              <Card.Description>
                {recommendedRemediation
                  ? recommendedRemediation.reason === "CLOSE_TO_PASSING"
                    ? `تم اختيار هذا المحتوى لأن نتيجتك الأخيرة كانت ${recommendedRemediation.score}%.`
                    : recommendedRemediation.reason === "LOW_SCORE"
                      ? `تم اختيار هذا المحتوى لمساعدتك بعد حصولك على ${recommendedRemediation.score}%.`
                      : "تم اختيار هذا المحتوى لمساعدتك قبل المحاولة الأخيرة."
                  : "هذا هو المحتوى الأساسي المقترح لهذا الدرس."}
              </Card.Description>
            </Card.Header>

            <div className="px-4 pb-5 sm:px-6">
              {recommendedRemediation ? (
                <ContentVariantCard variant={recommendedContent} index={0} />
              ) : (
                <InfographicPagination variants={infographicVariants} />
              )}
            </div>
          </Card>
        ) : (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-default-300 px-5 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-default-100 text-default-500">
              <FileText className="size-6" />
            </span>

            <h3 className="mt-4 text-base font-bold">
              لا يوجد محتوى لهذا الدرس
            </h3>

            <p className="mt-2 max-w-md text-sm leading-7 text-default-500">
              لم يتم إنشاء محتوى لهذا الدرس حتى الآن.
            </p>
          </div>
        )}
      </section>

      {/* ==========================================
          External Resources
      ========================================== */}

      {externalResources.length > 0 && (
        <Card className="border-default-200">
          <Card.Header>
            <Card.Title>مصادر إضافية</Card.Title>

            <Card.Description>
              مصادر يمكنك الرجوع إليها للتوسع في موضوع الدرس.
            </Card.Description>
          </Card.Header>

          <ul className="divide-y divide-default-100 px-4 pb-2 sm:px-6">
            {externalResources.map((resource) => (
              <li key={resource.id}>
                <HeroLink
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-between gap-4 py-3.5 text-start"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {resource.title}
                    </span>

                    <span className="mt-0.5 block text-xs text-default-400">
                      {resource.source}
                    </span>
                  </span>

                  <ArrowLeft className="size-4 shrink-0 text-default-400" />
                </HeroLink>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* ==========================================
          Quiz
      ========================================== */}

      <Card className="border-primary/20 bg-primary/5">
        <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Target className="size-5" />
            </span>

            <div>
              <h2 className="font-bold">جاهز لاختبار الدرس؟</h2>

              <p className="mt-1 max-w-2xl text-sm leading-7 text-default-500">
                {lessonQuiz
                  ? `درجة النجاح المطلوبة ${lessonQuiz.passingScore} من 100.`
                  : "بعد الانتهاء من المحتوى يمكنك الانتقال إلى اختبار الدرس."}
              </p>

              {displayedAttempt && attemptStatus && (
                <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm">
                  <span className="text-default-500">
                    {isPassed
                      ? `محاولة الاجتياز (رقم ${displayedAttempt.attemptNumber}):`
                      : `آخر محاولة (رقم ${displayedAttempt.attemptNumber}):`}
                  </span>

                  <span className={`font-bold ${attemptStatus.textClass}`}>
                    {displayedAttempt.score}%
                  </span>

                  <span className={`text-xs ${attemptStatus.textClass}`}>
                    {attemptStatus.label}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* ==========================================
              Quiz CTA
          ========================================== */}

          {!lessonQuiz ? (
            <span className="text-sm text-default-500">
              لا يوجد اختبار لهذا الدرس
            </span>
          ) : isPassed ? (
            <span className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-success/10 px-4 text-sm font-semibold text-success">
              <CircleCheck className="size-4" />
              تم اجتياز الدرس
            </span>
          ) : (
            <Link
              href={`/dashboard/quizzes/${lessonQuiz.id}`}
              className={ctaClass}
            >
              {latestAttempt ? "المحاولة التالية" : "ابدأ الاختبار"}

              <ArrowLeft className="size-4" />
            </Link>
          )}
        </div>
      </Card>

      {/* ==========================================
          Previous / Next
      ========================================== */}

      <div className="grid gap-3 sm:grid-cols-2">
        {navigation.previous && (
          <Link
            href={`/dashboard/lessons/${navigation.previous.id}`}
            className="group flex items-center gap-4 rounded-2xl border border-default-200 bg-content1 p-4 transition-colors hover:border-default-300"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-default-100">
              <ArrowRight className="size-4" />
            </span>

            <span className="min-w-0">
              <span className="block text-xs text-default-400">
                الدرس السابق
              </span>

              <span className="mt-0.5 block truncate text-sm font-semibold">
                {navigation.previous.title}
              </span>
            </span>
          </Link>
        )}

        {navigation.next &&
          (isPassed ? (
            <Link
              href={`/dashboard/lessons/${navigation.next.id}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-default-200 bg-content1 p-4 transition-colors hover:border-primary/40 sm:col-start-2"
            >
              <span className="min-w-0">
                <span className="block text-xs text-default-400">
                  الدرس التالي
                </span>

                <span className="mt-0.5 block truncate text-sm font-semibold">
                  {navigation.next.title}
                </span>
              </span>

              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ArrowLeft className="size-4" />
              </span>
            </Link>
          ) : (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-dashed border-default-300 bg-default-50 p-4 sm:col-start-2">
              <span className="min-w-0">
                <span className="block text-xs text-default-400">
                  الدرس التالي
                </span>

                <span className="mt-0.5 block truncate text-sm font-semibold text-default-400">
                  {navigation.next.title}
                </span>

                <span className="mt-0.5 block text-xs text-default-400">
                  أكمل الاختبار الحالي لفتحه
                </span>
              </span>

              <Lock className="size-4 shrink-0 text-default-400" />
            </div>
          ))}
      </div>
    </div>
  );
}

type AttemptStatus = {
  passed: boolean;
  label: string;
  textClass: string;
};

function getAttemptStatus(score: number, passingScore: number): AttemptStatus {
  const passed = score >= passingScore;

  return {
    passed,
    label: passed ? "تم اجتياز الاختبار" : "لم يتم اجتياز الاختبار",
    textClass: passed ? "text-success" : "text-danger",
  };
}
