
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Clock,
} from "@gravity-ui/icons";

import {
  Button,
  ProgressBar,
  Spinner,
} from "@heroui/react";

import { submitQuizAction } from "@/actions/exam/submit-quiz";
import { QuizQuestion } from "./quiz-question";

import type {
  AnswerMap,
  QuizData,
  QuizAttempt,
  QuizResult,
} from "@/types/quiz-types";
import { QuizResultView } from "./quiz-result";

type QuizClientProps = {
  quiz: QuizData;
  attempt: QuizAttempt;
};

export default function QuizClient({
  quiz,
  attempt,
}: QuizClientProps) {
  /*
   * ============================================================
   * State
   * ============================================================
   */

  const [answers, setAnswers] = useState<AnswerMap>({});

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<QuizResult | null>(null);

  /*
   * Timer
   *
   * We only use this if the server passes a time limit.
   *
   * Your current Prisma Exam model doesn't contain
   * timeLimitMinutes, so this remains disabled until
   * you add it to the schema.
   */
  const [remainingSeconds, setRemainingSeconds] =
    useState<number | null>(null);

  /*
   * ============================================================
   * Questions
   * ============================================================
   */

  const questions = quiz.questions;

  const currentQuestion =
    questions[currentIndex];

  /*
   * ============================================================
   * Current selected answers
   * ============================================================
   */

  const selectedAnswers =
    currentQuestion
      ? answers[currentQuestion.id] ?? []
      : [];

  /*
   * ============================================================
   * Progress
   * ============================================================
   */

  const progress =
    questions.length > 0
      ? ((currentIndex + 1) / questions.length) * 100
      : 0;

  const isLastQuestion =
    currentIndex === questions.length - 1;

  const answeredCount =
    Object.values(answers).filter(
      (value) => value.length > 0,
    ).length;

  /*
   * ============================================================
   * Select answer
   * ============================================================
   */

  const selectAnswer = useCallback(
    (optionId: string) => {
      if (!currentQuestion || submitting) {
        return;
      }

      const currentAnswers =
        answers[currentQuestion.id] ?? [];

      let nextAnswers: string[];

      /*
       * Multiple choice:
       * Toggle the selected option.
       */
      if (
        currentQuestion.type ===
        "MULTIPLE_CHOICE"
      ) {
        if (
          currentAnswers.includes(optionId)
        ) {
          nextAnswers =
            currentAnswers.filter(
              (id) => id !== optionId,
            );
        } else {
          nextAnswers = [
            ...currentAnswers,
            optionId,
          ];
        }
      } else {
        /*
         * Single choice / True false:
         * Only one option is allowed.
         */
        nextAnswers = [optionId];
      }

      setAnswers((previous) => ({
        ...previous,
        [currentQuestion.id]:
          nextAnswers,
      }));

      setError(null);
    },
    [
      answers,
      currentQuestion,
      submitting,
    ],
  );

  /*
   * ============================================================
   * Submit Quiz
   * ============================================================
   */

  const submitQuiz = useCallback(async () => {
    if (submitting || result) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      /*
       * Convert local AnswerMap to the structure
       * expected by submitQuizAction.
       */
      const submittedAnswers =
        questions.map((question) => ({
          questionId: question.id,

          selectedOptionIds:
            answers[question.id] ?? [],
        }));

      const response =
        await submitQuizAction({
          attemptId: attempt.id,
          answers: submittedAnswers,
        });

      if (!response.success) {
        setError(response.error);
        return;
      }

      setResult(response.result);
    } catch (error) {
      console.error(
        "[QuizClient] submit error:",
        error,
      );

      setError(
        "حدث خطأ أثناء تسليم الاختبار. حاول مرة أخرى.",
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    answers,
    attempt.id,
    questions,
    result,
    submitting,
  ]);

  /*
   * ============================================================
   * Timer
   * ============================================================
   */

  useEffect(() => {
    if (
      remainingSeconds === null ||
      result ||
      submitting
    ) {
      return;
    }

    if (remainingSeconds <= 0) {
      submitQuiz();
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous === null) {
          return null;
        }

        return previous > 0
          ? previous - 1
          : 0;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    remainingSeconds,
    result,
    submitting,
    submitQuiz,
  ]);

  /*
   * ============================================================
   * Format timer
   * ============================================================
   */

  const formattedTime = useMemo(() => {
    if (remainingSeconds === null) {
      return null;
    }

    const minutes =
      Math.floor(remainingSeconds / 60);

    const seconds =
      remainingSeconds % 60;

    return `${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  }, [remainingSeconds]);

  /*
   * ============================================================
   * Navigation
   * ============================================================
   */

  const goNext = () => {
    if (
      currentIndex <
      questions.length - 1
    ) {
      setCurrentIndex(
        (previous) => previous + 1,
      );
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(
        (previous) => previous - 1,
      );
    }
  };

  /*
   * ============================================================
   * Loading guard
   * ============================================================
   */

  if (!currentQuestion) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[60vh] items-center justify-center"
      >
        <Spinner size="lg" />
      </main>
    );
  }

  /*
   * ============================================================
   * Result
   * ============================================================
   */

if (result) {
  return (
    <QuizResultView
      result={result}
      quiz={quiz}
      lessonId={quiz.lesson!.id}
      hasReachedMaxAttempts={
        result.attemptNumber >= 3
      }
    />
  );
}
  /*
   * ============================================================
   * Quiz
   * ============================================================
   */

  return (
    <main
      dir="rtl"
      className="min-h-[calc(100vh-4rem)] bg-background px-4 py-5 sm:px-6 sm:py-7 lg:px-8"
    >
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <header>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium text-primary">
                اختبار الدرس
              </p>

              <h1 className="mt-1 truncate text-lg font-bold sm:text-xl">
                {quiz.title}
              </h1>
            </div>

            {formattedTime && (
              <div
                className={`
                  flex shrink-0 items-center gap-2
                  rounded-xl border px-3 py-2
                  text-sm font-bold
                  ${
                    remainingSeconds !== null &&
                    remainingSeconds <= 60
                      ? "border-danger-200 bg-danger-50 text-danger"
                      : "border-default-200 bg-content1"
                  }
                `}
              >
                <Clock className="size-4" />

                <span dir="ltr">
                  {formattedTime}
                </span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-foreground/50">
              <span>
                السؤال{" "}
                {currentIndex + 1} من{" "}
                {questions.length}
              </span>

              <span>
                {answeredCount} /{" "}
                {questions.length} مجاب
              </span>
            </div>

            <ProgressBar
              value={progress}
              aria-label="تقدم الاختبار"
              size="sm"
            />
          </div>
        </header>

        {/* Question */}
        <div className="mt-6">
          <QuizQuestion
            question={currentQuestion}
            questionNumber={
              currentIndex + 1
            }
            answers={answers}
            onSelect={selectAnswer}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            isDisabled={
              currentIndex === 0 ||
              submitting
            }
            onPress={goPrevious}
          >
            <ArrowRight className="size-4" />
            السابق
          </Button>

          {!isLastQuestion ? (
            <Button
              isDisabled={submitting}
              onPress={goNext}
            >
              التالي
              <ArrowLeft className="size-4" />
            </Button>
          ) : (
            <Button
              isDisabled={submitting}
              onPress={submitQuiz}
            >
              {submitting
                ? "جاري التسليم..."
                : "تسليم الاختبار"}

              <CircleCheck className="size-4" />
            </Button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-7 rounded-2xl border border-default-200 bg-content1 p-4">
          <p className="mb-3 text-xs font-bold text-foreground/60">
            أسئلة الاختبار
          </p>

          <div className="flex flex-wrap gap-2">
            {questions.map(
              (question, index) => {
                const answered =
                  (answers[
                    question.id
                  ]?.length ?? 0) > 0;

                const active =
                  index === currentIndex;

                return (
                  <button
                    key={question.id}
                    type="button"
                    disabled={submitting}
                    onClick={() =>
                      setCurrentIndex(index)
                    }
                    className={`
                      flex size-9 items-center
                      justify-center rounded-lg
                      text-xs font-bold
                      transition-colors
                      ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : answered
                            ? "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300"
                            : "bg-default-100 text-foreground/60 hover:bg-default-200"
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                );
              },
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/*
 * ============================================================
 * Result Box
 * ============================================================
 */

function ResultBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-default-200 bg-default-50 p-3.5">
      <p className="text-[11px] text-foreground/50">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold">
        {value}
      </p>
    </div>
  );
}
