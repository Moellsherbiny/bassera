
"use client";

import { useMemo, useState } from "react";

import { CircleCheck, GraduationCap } from "@gravity-ui/icons";
import { Card, SearchField, Tabs } from "@heroui/react";
import { Trophy } from "lucide-react";

import type { QuizListItem } from "@/actions/exam/get-quizzes";

import { QuizCard } from "./quiz-card";

type QuizzesClientProps = {
  quizzes: QuizListItem[];
};

type FilterType = "ALL" | "PASSED" | "FAILED" | "LESSON" | "FINAL";

export function QuizzesClient({ quizzes }: QuizzesClientProps) {
  const [filter, setFilter] = useState<FilterType>("ALL");
  const [search, setSearch] = useState("");

  const filteredQuizzes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quizzes.filter((quiz) => {
      const matchesSearch =
        !query ||
        quiz.title.toLowerCase().includes(query) ||
        quiz.lesson?.title.toLowerCase().includes(query) ||
        quiz.course?.title.toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }

      switch (filter) {
        case "PASSED":
          return quiz.result.passed;

        case "FAILED":
          return !quiz.result.passed;

        case "LESSON":
          return quiz.type === "LESSON_QUIZ";

        case "FINAL":
          return quiz.type === "FINAL_EXAM";

        default:
          return true;
      }
    });
  }, [quizzes, search, filter]);

  const stats = useMemo(() => {
    const passed = quizzes.filter(
      (quiz) => quiz.result.passed,
    ).length;

    const failed = quizzes.filter(
      (quiz) => !quiz.result.passed,
    ).length;

    const lessonQuizzes = quizzes.filter(
      (quiz) => quiz.type === "LESSON_QUIZ",
    ).length;

    const finalExams = quizzes.filter(
      (quiz) => quiz.type === "FINAL_EXAM",
    ).length;

    const averageScore =
      quizzes.length > 0
        ? Math.round(
            quizzes.reduce(
              (sum, quiz) => sum + quiz.result.score,
              0,
            ) / quizzes.length,
          )
        : 0;

    return {
      total: quizzes.length,
      passed,
      failed,
      lessonQuizzes,
      finalExams,
      averageScore,
    };
  }, [quizzes]);

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
                <GraduationCap className="size-5" />

                <span className="text-sm font-medium">
                  التقييم
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                نتائج الاختبارات
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground/60 sm:text-base">
                هنا يمكنك مراجعة الاختبارات التي قمت بتسليمها
                ونتائج محاولاتك.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 sm:min-w-[390px]">
              <StatCard
                icon={<GraduationCap className="size-4" />}
                label="الاختبارات"
                value={stats.total}
              />

              <StatCard
                icon={<CircleCheck className="size-4" />}
                label="ناجح"
                value={stats.passed}
              />

              <StatCard
                icon={<Trophy className="size-4" />}
                label="المتوسط"
                value={`${stats.averageScore}%`}
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-8">
          <Card className="border border-default-200 bg-content1">
            <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
              <Tabs
                selectedKey={filter}
                onSelectionChange={(key) =>
                  setFilter(key as FilterType)
                }
                variant="secondary"
                className="w-full"
              >
                <Tabs.ListContainer>
                  <Tabs.List
                    aria-label="تصفية الاختبارات"
                    className="w-full"
                  >
                    <Tabs.Tab id="ALL">
                      الكل ({stats.total})
                      <Tabs.Indicator />
                    </Tabs.Tab>

                    <Tabs.Tab id="PASSED">
                      ناجح ({stats.passed})
                      <Tabs.Indicator />
                    </Tabs.Tab>

                    <Tabs.Tab id="FAILED">
                      لم يجتز ({stats.failed})
                      <Tabs.Indicator />
                    </Tabs.Tab>

                    <Tabs.Tab id="LESSON">
                      اختبارات الدروس ({stats.lessonQuizzes})
                      <Tabs.Indicator />
                    </Tabs.Tab>

                    <Tabs.Tab id="FINAL">
                      النهائي ({stats.finalExams})
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>
              </Tabs>

              <SearchField
                name="quiz-search"
                value={search}
                onChange={setSearch}
                variant="secondary"
                className="w-full lg:max-w-sm"
                aria-label="البحث في الاختبارات"
              >
                <SearchField.Group className="rounded-xl">
                  <SearchField.SearchIcon />

                  <SearchField.Input
                    className="w-full"
                    placeholder="ابحث عن اختبار أو درس..."
                  />

                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
            </div>
          </Card>
        </section>

        {/* Results */}
        <section className="mt-6">
          {filteredQuizzes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredQuizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              search={search}
              filter={filter}
            />
          )}
        </section>
      </div>
    </main>
  );
}

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
    <div className="rounded-xl border border-default-200 bg-content1 px-3 py-3">
      <div className="flex items-center gap-1.5 text-foreground/45">
        {icon}

        <span className="text-[10px] sm:text-xs">
          {label}
        </span>
      </div>

      <p className="mt-1 text-xl font-bold">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  search,
  filter,
}: {
  search: string;
  filter: FilterType;
}) {
  const hasSearch = search.trim().length > 0;

  let title = "لا توجد نتائج";
  let description = "لا توجد اختبارات مطابقة للفلتر المحدد.";

  if (hasSearch) {
    title = "لم يتم العثور على اختبار";
    description =
      "جرب البحث باستخدام اسم الاختبار أو اسم الدرس.";
  } else if (filter === "PASSED") {
    title = "لا توجد اختبارات ناجحة";
    description = "لم تقم باجتياز أي اختبار حتى الآن.";
  } else if (filter === "FAILED") {
    title = "لا توجد اختبارات غير مجتازة";
    description =
      "لا توجد محاولات غير مجتازة في النتائج الحالية.";
  } else if (filter === "LESSON") {
    title = "لا توجد اختبارات دروس";
    description = "لا توجد نتائج لاختبارات الدروس.";
  } else if (filter === "FINAL") {
    title = "لا يوجد اختبار نهائي";
    description =
      "لم يتم العثور على نتيجة للاختبار النهائي.";
  } else if (filter === "ALL") {
    title = "لا توجد نتائج اختبارات";
    description =
      "لم تقم بتسليم أي اختبار حتى الآن.";
  }

  return (
    <Card className="border border-dashed border-default-300 bg-content1">
      <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-default-100 text-foreground/50">
          <GraduationCap className="size-6" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">
          {title}
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-foreground/55">
          {description}
        </p>
      </div>
    </Card>
  );
}
