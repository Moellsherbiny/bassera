
"use client";

import Link from "next/link";

import {
  ArrowLeft,
  CircleCheck,
  CircleXmark,
  GraduationCap,
  ListUl,
} from "@gravity-ui/icons";

import { Button, Card, Chip } from "@heroui/react";

import type { QuizListItem } from "@/actions/exam/get-quizzes";

type QuizCardProps = {
  quiz: QuizListItem;
};

export function QuizCard({ quiz }: QuizCardProps) {
  const passed = quiz.result.passed;

  return (
    <Card className="group overflow-hidden border border-default-200 bg-content1 transition-all duration-200 hover:-translate-y-0.5 hover:border-default-300 hover:shadow-medium">
      {/* Status line */}
      <div
        className={`h-1 ${
          passed ? "bg-success" : "bg-danger"
        }`}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                passed
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              }`}
            >
              <GraduationCap className="size-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold sm:text-lg">
                  {quiz.title}
                </h2>

                <Chip
                  size="sm"
                  variant="soft"
                  color={
                    quiz.type === "FINAL_EXAM"
                      ? "warning"
                      : "default"
                  }
                >
                  {quiz.type === "FINAL_EXAM"
                    ? "نهائي"
                    : "درس"}
                </Chip>
              </div>

              {quiz.lesson && (
                <p className="mt-1 text-xs text-foreground/50">
                  الدرس {quiz.lesson.order}
                </p>
              )}
            </div>
          </div>

          {/* Result icon */}
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
              passed
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            {passed ? (
              <CircleCheck className="size-4" />
            ) : (
              <CircleXmark className="size-4" />
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-foreground/60">
          {quiz.description}
        </p>

        {/* Result */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <InfoBox
            label="الدرجة"
            value={`${quiz.result.score}%`}
          />

          <InfoBox
            label="درجة النجاح"
            value={`${quiz.passingScore}%`}
          />

          <InfoBox
            label="عدد الأسئلة"
            value={`${quiz.questionsCount}`}
          />

          <InfoBox
            label="المحاولة"
            value={`#${quiz.result.attemptNumber}`}
          />
        </div>

        {/* Status */}
        <div
          className={`mt-4 rounded-xl px-4 py-3 ${
            passed
              ? "bg-success/5 text-success"
              : "bg-danger/5 text-danger"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">
              {passed
                ? "تم اجتياز الاختبار"
                : "لم يتم اجتياز الاختبار"}
            </span>

            <span className="text-xs opacity-70">
              {new Date(
                quiz.result.submittedAt,
              ).toLocaleDateString("ar-EG")}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-default-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-foreground/45">
            <ListUl className="size-4" />

            <span>
              {quiz.questionsCount} أسئلة
            </span>
          </div>

          <Button
            
            variant="tertiary"
            
            
          >
            <Link 
            href={`/dashboard/quizzes/${quiz.id}`}
>

            عرض النتيجة
            <ArrowLeft className="size-4" />
</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

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
