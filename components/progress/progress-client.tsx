
"use client";

import { useMemo, useState } from "react";

import {
  CircleCheck,
  CircleInfo,
  GraduationCap,
  Lock,
  Play,

} from "@gravity-ui/icons";

import { Card, ProgressBar, Tabs } from "@heroui/react";

import type {
  LessonProgressItem,
  ProgressSummary,
} from "@/actions/student/get-progress";
import { ChartNoAxesColumn } from "lucide-react";

type ProgressClientProps = {
  progress: LessonProgressItem[];
  summary: ProgressSummary;
};

type FilterType =
  | "ALL"
  | "PASSED"
  | "IN_PROGRESS"
  | "AVAILABLE"
  | "LOCKED";

export function ProgressClient({
  progress,
  summary,
}: ProgressClientProps) {
  const [filter, setFilter] =
    useState<FilterType>("ALL");

  const filteredProgress = useMemo(() => {
    switch (filter) {
      case "PASSED":
        return progress.filter(
          (item) => item.status === "PASSED",
        );

      case "IN_PROGRESS":
        return progress.filter(
          (item) => item.status === "IN_PROGRESS",
        );

      case "AVAILABLE":
        return progress.filter(
          (item) => item.status === "AVAILABLE",
        );

      case "LOCKED":
        return progress.filter(
          (item) => item.status === "LOCKED",
        );

      default:
        return progress;
    }
  }, [filter, progress]);

  return (
    <main
      dir="rtl"
      className="min-h-[calc(100vh-4rem)] bg-background px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <section>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-primary">
                <ChartNoAxesColumn className="size-5" />

                <span className="text-sm font-medium">
                  متابعة التعلم
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                تقدمي في التعلم
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/60 sm:text-base">
                تابع تقدمك في الدروس، درجاتك، وعدد
                المحاولات التي قمت بها.
              </p>
            </div>

            {/* Completion */}
            <div className="w-full rounded-2xl border border-default-200 bg-content1 p-4 sm:max-w-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium">
                  نسبة الإنجاز
                </span>

                <span className="text-lg font-bold text-primary">
                  {summary.completionPercentage}%
                </span>
              </div>

              <ProgressBar
                value={summary.completionPercentage}
                className="mt-3"
                aria-label="نسبة الإنجاز"
              />

              <p className="mt-2 text-xs text-foreground/50">
                {summary.completedLessons} من{" "}
                {summary.totalLessons} درس مكتمل
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            icon={
              <GraduationCap className="size-5" />
            }
            label="إجمالي الدروس"
            value={summary.totalLessons}
          />

          <StatCard
            icon={
              <CircleCheck className="size-5" />
            }
            label="الدروس المكتملة"
            value={summary.completedLessons}
          />

          <StatCard
            icon={<Play className="size-5" />}
            label="قيد التقدم"
            value={summary.inProgressLessons}
          />

          <StatCard
            icon={
              <ChartNoAxesColumn className="size-5" />
            }
            label="متوسط الدرجات"
            value={`${summary.averageScore}%`}
          />
        </section>

        {/* Additional stats */}
        <section className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-2">
          <MiniStat
            label="الدروس المتاحة"
            value={summary.availableLessons}
          />

          <MiniStat
            label="المحاولات"
            value={summary.totalAttempts}
          />
        </section>

        {/* Filters */}
        <section className="mt-8">
          <Card className="border border-default-200 bg-content1">
            <div className="overflow-x-auto p-3">
              <Tabs
                selectedKey={filter}
                onSelectionChange={(key) =>
                  setFilter(key as FilterType)
                }
                variant="secondary"
                className="w-max min-w-full"
              >
                <Tabs.ListContainer>
                  <Tabs.List
                    aria-label="تصفية التقدم"
                    className="w-full"
                  >
                    <Tabs.Tab id="ALL">
                      الكل ({summary.totalLessons})
                      <Tabs.Indicator />
                    </Tabs.Tab>

                    <Tabs.Tab id="PASSED">
                      مكتمل ({summary.completedLessons})
                      <Tabs.Indicator />
                    </Tabs.Tab>

                    <Tabs.Tab id="IN_PROGRESS">
                      قيد التقدم (
                      {summary.inProgressLessons})
                      <Tabs.Indicator />
                    </Tabs.Tab>

                    <Tabs.Tab id="AVAILABLE">
                      متاح ({summary.availableLessons})
                      <Tabs.Indicator />
                    </Tabs.Tab>

                    <Tabs.Tab id="LOCKED">
                      مقفل ({summary.lockedLessons})
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>
              </Tabs>
            </div>
          </Card>
        </section>

        {/* Lessons */}
        <section className="mt-6">
          {filteredProgress.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProgress.map((item) => (
                <LessonProgressCard
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <EmptyState filter={filter} />
          )}
        </section>
      </div>
    </main>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="border border-default-200 bg-content1">
      <div className="p-4">
        <div className="flex items-center gap-2 text-foreground/50">
          {icon}

          <span className="text-xs sm:text-sm">
            {label}
          </span>
        </div>

        <p className="mt-2 text-2xl font-bold">
          {value}
        </p>
      </div>
    </Card>
  );
}

/* =====================================================
   MINI STAT
===================================================== */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-default-200 bg-content1 px-4 py-3">
      <p className="text-xs text-foreground/50">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold">
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   LESSON CARD
===================================================== */

function LessonProgressCard({
  item,
}: {
  item: LessonProgressItem;
}) {
  const statusConfig = {
    PASSED: {
      label: "مكتمل",
      icon: CircleCheck,
      className:
        "bg-success/10 text-success",
      progress: 100,
    },

    IN_PROGRESS: {
      label: "قيد التقدم",
      icon: Play,
      className:
        "bg-primary/10 text-primary",
      progress: Math.min(item.bestScore, 99),
    },

    AVAILABLE: {
      label: "متاح",
      icon: CircleInfo,
      className:
        "bg-warning/10 text-warning",
      progress: 0,
    },

    LOCKED: {
      label: "مقفل",
      icon: Lock,
      className:
        "bg-default-100 text-foreground/45",
      progress: 0,
    },
  } as const;

  const config = statusConfig[item.status];
  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden border border-default-200 bg-content1 transition-all hover:border-default-300 hover:shadow-medium">
      {/* Status bar */}
      <div
        className={`h-1 ${
          item.status === "PASSED"
            ? "bg-success"
            : item.status === "IN_PROGRESS"
              ? "bg-primary"
              : item.status === "AVAILABLE"
                ? "bg-warning"
                : "bg-default-300"
        }`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${config.className}`}
            >
              <StatusIcon className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-foreground/45">
                الدرس {item.lesson.order}
              </p>

              <h2 className="mt-1 line-clamp-2 text-base font-bold sm:text-lg">
                {item.lesson.title}
              </h2>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${config.className}`}
          >
            {config.label}
          </span>
        </div>

        {/* Course */}
        <p className="mt-4 line-clamp-1 text-xs text-foreground/50">
          {item.lesson.course.title}
        </p>

        {/* Progress */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-foreground/50">
              التقدم
            </span>

            <span className="text-xs font-semibold">
              {config.progress}%
            </span>
          </div>

          <ProgressBar
            value={config.progress}
            aria-label={`تقدم ${item.lesson.title}`}
          />
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <InfoBox
            label="أفضل درجة"
            value={`${item.bestScore}%`}
          />

          <InfoBox
            label="المحاولات"
            value={`${item.attemptsCount}`}
          />
        </div>

        {/* Dates */}
        {(item.unlockedAt || item.completedAt) && (
          <div className="mt-4 space-y-1.5 border-t border-default-100 pt-4">
            {item.unlockedAt && (
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-foreground/45">
                  تاريخ الإتاحة
                </span>

                <span className="font-medium">
                  {formatDate(item.unlockedAt)}
                </span>
              </div>
            )}

            {item.completedAt && (
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-foreground/45">
                  تاريخ الإكمال
                </span>

                <span className="font-medium">
                  {formatDate(item.completedAt)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

/* =====================================================
   INFO BOX
===================================================== */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-default-200 bg-default-50 px-3 py-2.5">
      <p className="text-[11px] text-foreground/45">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold">
        {value}
      </p>
    </div>
  );
}

/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({
  filter,
}: {
  filter: FilterType;
}) {
  const content = {
    ALL: {
      title: "لا يوجد تقدم بعد",
      description:
        "لم يتم تسجيل تقدمك في أي درس حتى الآن.",
    },

    PASSED: {
      title: "لا توجد دروس مكتملة",
      description:
        "لم تقم بإكمال أي درس حتى الآن.",
    },

    IN_PROGRESS: {
      title: "لا توجد دروس قيد التقدم",
      description:
        "لا توجد دروس قيد التقدم حاليًا.",
    },

    AVAILABLE: {
      title: "لا توجد دروس متاحة",
      description:
        "لا توجد دروس متاحة لك حاليًا.",
    },

    LOCKED: {
      title: "لا توجد دروس مقفلة",
      description:
        "لا توجد دروس مقفلة في الوقت الحالي.",
    },
  }[filter];

  return (
    <Card className="border border-dashed border-default-300 bg-content1">
      <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-default-100 text-foreground/50">
          <GraduationCap className="size-6" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">
          {content.title}
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-foreground/55">
          {content.description}
        </p>
      </div>
    </Card>
  );
}

/* =====================================================
   DATE
===================================================== */

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
