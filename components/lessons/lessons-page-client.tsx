"use client";

import Link from "next/link";
import { Noto_Kufi_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";

import {
  ArrowLeft,
  BookOpen,
  Lock,
} from "@gravity-ui/icons";

import { Card } from "@heroui/react";

// Same two-role type system as the lesson page: Kufi for anything load-
// bearing (course title, lesson numbers), Plex Sans Arabic for reading text.
const displayFont = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["600", "700"],
  variable: "--font-display",
});

const bodyFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

interface Lesson {
  id: string;
  title: string;
  order: number;

  status: "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "PASSED";

  bestScore: number;
  attemptsCount: number;

  unlockedAt: string | null;
  completedAt: string | null;

  contentCount: number;
  questionCount: number;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  lessons: Lesson[];
}

interface LessonsClientProps {
  course: Course | null;
}

const STATUS_META: Record<
  Lesson["status"],
  { label: string; dotClass: string }
> = {
  PASSED: { label: "مكتمل", dotClass: "bg-success" },
  IN_PROGRESS: { label: "قيد التعلم", dotClass: "bg-warning" },
  AVAILABLE: { label: "متاح", dotClass: "bg-primary" },
  LOCKED: { label: "مقفل", dotClass: "bg-default-300" },
};

export default function LessonsClient({ course }: LessonsClientProps) {
  if (!course) {
    return (
      <div
        dir="rtl"
        className={`${bodyFont.className} flex min-h-[60vh] items-center justify-center`}
      >
        <Card className="w-full max-w-lg">
          <Card.Content className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-default-100">
              <BookOpen width={28} height={28} />
            </div>

            <div>
              <h2 className={`${displayFont.className} text-lg`}>
                لا يوجد مقرر متاح
              </h2>

              <p className="mt-1 text-sm text-default-500">
                لم يتم تسجيلك في مقرر تعليمي حتى الآن.
              </p>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }

  const passedLessons = course.lessons.filter(
    (lesson) => lesson.status === "PASSED",
  ).length;

  const progressPercentage =
    course.lessons.length > 0
      ? Math.round((passedLessons / course.lessons.length) * 100)
      : 0;

  return (
    <div dir="rtl" className={`${bodyFont.className} space-y-10`}>
      {/* Header */}
      <div className="space-y-4 border-b pb-8">
        <div className="flex items-center gap-2 text-sm text-default-500">
          <BookOpen width={16} height={16} />
          <span>المحتوى الدراسي</span>
        </div>

        <h1 className={`${displayFont.className} text-3xl tracking-tight`}>
          {course.title}
        </h1>

        {course.description && (
          <p className="max-w-[65ch] text-sm leading-7 text-default-500">
            {course.description}
          </p>
        )}

        {/* Progress — a thin inline strip, not a boxed stat card. */}
        <div className="max-w-sm pt-2">
          <div className="flex items-center justify-between text-xs text-default-500">
            <span>
              أكملت {passedLessons} من {course.lessons.length} دروس
            </span>
            <span
              className={`${displayFont.className} text-sm text-primary`}
            >
              {progressPercentage}٪
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-default-100">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lessons */}
      <section className="space-y-4">
        <div>
          <h2 className={`${displayFont.className} text-lg`}>فهرس الدروس</h2>

          <p className="mt-1 text-sm text-default-500">
            أكمل كل درس واجتز الاختبار بدرجة لا تقل عن 50 للانتقال إلى الدرس
            التالي.
          </p>
        </div>

        <ol className="space-y-3">
          {course.lessons.map((lesson) => {
            const status = STATUS_META[lesson.status];
            const isLocked = lesson.status === "LOCKED";
            const isPassed = lesson.status === "PASSED";

            const row = (
              <Card
                className={[
                  "group",
                  isLocked
                    ? "border-dashed opacity-70"
                    : "transition-colors hover:border-primary/40",
                ].join(" ")}
              >
                <Card.Content>
                  <div className="flex items-center gap-4">
                    {/* Order marker — a real sequence, so it earns the
                        prominent numeral treatment used on the lesson page. */}
                    <div
                      className={[
                        `${displayFont.className} flex size-12 shrink-0 items-center justify-center rounded-xl text-lg tabular-nums`,
                        isPassed
                          ? "bg-success/10 text-success"
                          : isLocked
                            ? "bg-default-100 text-default-400"
                            : "bg-primary/10 text-primary",
                      ].join(" ")}
                    >
                      {isLocked ? (
                        <Lock width={18} height={18} />
                      ) : (
                        String(lesson.order).padStart(2, "0")
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-semibold">{lesson.title}</h3>

                        <span className="flex items-center gap-1.5 text-xs text-default-500">
                          <span
                            className={`size-1.5 rounded-full ${status.dotClass}`}
                            aria-hidden
                          />
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-default-500">
                        <span>{lesson.contentCount} محتوى تعليمي</span>
                        <span>{lesson.questionCount} سؤال</span>

                        {lesson.attemptsCount > 0 && (
                          <span>{lesson.attemptsCount} محاولة</span>
                        )}

                        {lesson.bestScore > 0 && (
                          <span>أفضل نتيجة {lesson.bestScore}/100</span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    {!isLocked && (
                      <ArrowLeft
                        width={18}
                        height={18}
                        className="shrink-0 text-default-400 transition-transform group-hover:-translate-x-1 group-hover:text-primary"
                      />
                    )}
                  </div>
                </Card.Content>
              </Card>
            );

            return (
              <li key={lesson.id}>
                {isLocked ? (
                  row
                ) : (
                  <Link
                    href={`/dashboard/lessons/${lesson.id}`}
                    className="block"
                  >
                    {row}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}