"use client";

import { ArrowLeft, CircleCheck, Lock } from "@gravity-ui/icons";
import { RotateCcw } from "lucide-react";
import { Button, Card } from "@heroui/react";
import Link from "next/link";

import type { QuizData, QuizResult } from "@/types/quiz-types";

type QuizResultProps = {
  result: QuizResult;
  quiz: QuizData;

  /**
   * الدرس الحالي
   */
  lessonId: string;

  /**
   * الدرس التالي.
   * يكون null إذا كان هذا آخر درس.
   */
  nextLessonId?: string | null;

  /**
   * هل انتهت كل المحاولات؟
   */
  hasReachedMaxAttempts?: boolean;
};

export function QuizResultView({
  result,
  quiz,
  lessonId,
  nextLessonId,
  hasReachedMaxAttempts = false,
}: QuizResultProps) {
  const isPassed = result.passed;

  return (
    <main
      dir="rtl"
      className="min-h-[calc(100vh-4rem)] bg-background px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center">
        <Card className="w-full overflow-hidden border border-default-200 bg-content1">
          {/* Status bar */}
          <div
            className={`h-1.5 w-full ${isPassed ? "bg-success" : "bg-danger"}`}
          />

          <div className="p-6 text-center sm:p-10">
            {/* Status Icon */}
            <div
              className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${
                isPassed
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              }`}
            >
              {isPassed ? (
                <CircleCheck className="size-8" />
              ) : (
                <RotateCcw className="size-8" />
              )}
            </div>

            {/* Title */}
            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
              {isPassed ? "أحسنت، لقد اجتزت الاختبار" : "لم تحقق درجة النجاح"}
            </h1>

            {/* Quiz title */}
            <p className="mt-2 text-sm text-foreground/60 sm:text-base">
              {quiz.title}
            </p>

            {/* Statistics */}
            <div className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
              <ResultBox label="الدرجة" value={`${result.score}%`} />

              <ResultBox label="الصحيح" value={`${result.correctAnswers}`} />

              <ResultBox label="الخطأ" value={`${result.wrongAnswers}`} />

              <ResultBox
                label="بدون إجابة"
                value={`${result.unansweredQuestions}`}
              />
            </div>

            {/* Passing score */}
            <div className="mt-5 rounded-2xl border border-default-200 bg-default-50 p-4">
              <p className="text-xs text-foreground/50">درجة النجاح</p>

              <p className="mt-1 text-xl font-bold">{result.passingScore}%</p>
            </div>

            {/* Failure message */}
            {!isPassed && (
              <div className="mt-5 rounded-2xl border border-danger/20 bg-danger/5 p-4 text-start">
                <p className="text-sm font-semibold text-danger">
                  تحتاج إلى مراجعة محتوى الدرس
                </p>

                <p className="mt-1 text-sm leading-7 text-foreground/60">
                  لم تحقق درجة النجاح المطلوبة. سيتم عرض محتوى تعليمي مقترح لك
                  بناءً على نتيجتك قبل المحاولة التالية.
                </p>
              </div>
            )}

            {/* Success message */}
            {isPassed && (
              <div className="mt-5 rounded-2xl border border-success/20 bg-success/5 p-4 text-start">
                <p className="text-sm font-semibold text-success">
                  تم اجتياز الدرس بنجاح
                </p>

                <p className="mt-1 text-sm leading-7 text-foreground/60">
                  يمكنك الآن الانتقال إلى الدرس التالي.
                </p>
              </div>
            )}

            {/* ==========================================
                Actions
            ========================================== */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {isPassed ? (
                nextLessonId ? (
                  <Button className="min-w-44">
                    <Link
                      className="flex items-center justify-center gap-2"
                      href={`/dashboard/lessons/${nextLessonId}`}
                    >
                      الدرس التالي
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button className="min-w-44">
                    <Link
                      href="/dashboard/lessons"
                      className="flex items-center justify-center gap-2"
                    >
                      جميع الدروس
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                )
              ) : hasReachedMaxAttempts ? (
                <Button variant="secondary" className="min-w-44">
                  <Link
                    href={`/dashboard/lessons/${lessonId}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Lock className="size-4" />
                    العودة إلى الدرس
                  </Link>
                </Button>
              ) : (
                <Button className="min-w-44">
                  <Link
                    href={`/dashboard/lessons/${lessonId}`}
                    className="flex items-center justify-center gap-2"
                  >
                    مراجعة المحتوى
                    <ArrowLeft className="size-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Result Box
|--------------------------------------------------------------------------
*/

type ResultBoxProps = {
  label: string;
  value: string;
};

function ResultBox({ label, value }: ResultBoxProps) {
  return (
    <div className="rounded-xl border border-default-200 bg-default-50 p-3.5">
      <p className="text-[11px] text-foreground/50">{label}</p>

      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}
