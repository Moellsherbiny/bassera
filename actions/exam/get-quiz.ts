"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type {
  AnswerMap,
  QuizAttempt,
  QuizData,
  QuizQuestion,
} from "@/types/quiz-types";
/* |-------------------------------------------------------------------------- | CONFIG |-------------------------------------------------------------------------- */ const QUESTIONS_PER_LEVEL = 2;
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];
/* |-------------------------------------------------------------------------- | RESULT TYPES |-------------------------------------------------------------------------- */ export type GetQuizSuccess =
  { success: true; quiz: QuizData; attempt: QuizAttempt };
export type GetQuizError = {
  success: false;
  error:
    | "UNAUTHORIZED"
    | "NOT_FOUND"
    | "INVALID_TYPE"
    | "NO_LESSON"
    | "NOT_ENROLLED"
    | "INSUFFICIENT_EASY_QUESTIONS"
    | "INSUFFICIENT_MEDIUM_QUESTIONS"
    | "INSUFFICIENT_HARD_QUESTIONS"
    | "INSUFFICIENT_AVAILABLE_QUESTIONS"
    | "SERVER_ERROR";
  message: string;
};
export type GetQuizResult = GetQuizSuccess | GetQuizError;
/* |-------------------------------------------------------------------------- | HELPERS |-------------------------------------------------------------------------- */ function shuffle<
  T,
>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
/* |-------------------------------------------------------------------------- | GET QUIZ |-------------------------------------------------------------------------- */ export async function getQuizAction(
  quizId: string,
): Promise<GetQuizResult> {
  try {
    /* |-------------------------------------------------------------------------- | AUTH |-------------------------------------------------------------------------- */ const session =
      await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "UNAUTHORIZED",
        message: "يجب تسجيل الدخول أولاً.",
      };
    }
    const studentId = session.user.id;
    /* |-------------------------------------------------------------------------- | GET EXAM |-------------------------------------------------------------------------- */ const exam =
      await prisma.exam.findUnique({
        where: { id: quizId },
        select: {
          id: true,
          type: true,
          passingScore: true,
          lesson: {
            select: {
              id: true,
              title: true,
              order: true,
              course: { select: { id: true, title: true } },
            },
          },
          course: { select: { id: true, title: true } },
        },
      });
    /* |-------------------------------------------------------------------------- | NOT FOUND |-------------------------------------------------------------------------- */ if (
      !exam
    ) {
      return {
        success: false,
        error: "NOT_FOUND",
        message: "الاختبار غير موجود.",
      };
    }
    /* |-------------------------------------------------------------------------- | LESSON QUIZ ONLY |-------------------------------------------------------------------------- */ if (
      exam.type !== "LESSON_QUIZ"
    ) {
      return {
        success: false,
        error: "INVALID_TYPE",
        message: "هذا الاختبار ليس اختبار درس.",
      };
    }
    /* |-------------------------------------------------------------------------- | LESSON REQUIRED |-------------------------------------------------------------------------- */ if (
      !exam.lesson
    ) {
      return {
        success: false,
        error: "NO_LESSON",
        message: "هذا الاختبار غير مرتبط بأي درس.",
      };
    }
    const lessonId = exam.lesson.id;
    const courseId = exam.lesson.course.id;
    /* |-------------------------------------------------------------------------- | ENROLLMENT |-------------------------------------------------------------------------- */ const enrollment =
      await prisma.enrollment.findUnique({
        where: { studentId_courseId: { studentId, courseId } },
        select: { id: true },
      });
    if (!enrollment) {
      return {
        success: false,
        error: "NOT_ENROLLED",
        message: "أنت غير مسجل في هذا الكورس.",
      };
    }
    /* |-------------------------------------------------------------------------- | GET ALL QUESTIONS |-------------------------------------------------------------------------- */ const allQuestions =
      await prisma.question.findMany({
        where: { lessonId },
        select: {
          id: true,
          text: true,
          difficulty: true,
          options: { orderBy: { id: "asc" }, select: { id: true, text: true } },
        },
      });
    /* |-------------------------------------------------------------------------- | VALIDATE QUESTION POOL |-------------------------------------------------------------------------- */ const easyQuestions =
      allQuestions.filter((question) => question.difficulty === "EASY");
    const mediumQuestions = allQuestions.filter(
      (question) => question.difficulty === "MEDIUM",
    );
    const hardQuestions = allQuestions.filter(
      (question) => question.difficulty === "HARD",
    );
    if (easyQuestions.length < 8) {
      return {
        success: false,
        error: "INSUFFICIENT_EASY_QUESTIONS",
        message: `يجب أن يحتوي الدرس على 8 أسئلة EASY على الأقل. الموجود حاليًا: ${easyQuestions.length}.`,
      };
    }
    if (mediumQuestions.length < 8) {
      return {
        success: false,
        error: "INSUFFICIENT_MEDIUM_QUESTIONS",
        message: `يجب أن يحتوي الدرس على 8 أسئلة MEDIUM على الأقل. الموجود حاليًا: ${mediumQuestions.length}.`,
      };
    }
    if (hardQuestions.length < 4) {
      return {
        success: false,
        error: "INSUFFICIENT_HARD_QUESTIONS",
        message: `يجب أن يحتوي الدرس على 4 أسئلة HARD على الأقل. الموجود حاليًا: ${hardQuestions.length}.`,
      };
    }
    /* |-------------------------------------------------------------------------- | PREVIOUS ATTEMPTS |-------------------------------------------------------------------------- */ const previousAttempts =
      await prisma.examAttempt.findMany({
        where: { examId: exam.id, studentId },
        orderBy: { startedAt: "asc" },
        select: {
          id: true,
          attemptNumber: true,
          score: true,
          passed: true,
          startedAt: true,
          submittedAt: true,
          answers: { select: { questionId: true } },
        },
      });
    /* |-------------------------------------------------------------------------- | CURRENT ACTIVE ATTEMPT |-------------------------------------------------------------------------- */ const activeAttempt =
      previousAttempts.find((attempt) => attempt.submittedAt === null) ?? null;
    if (activeAttempt) {
      const activeQuestionIds = activeAttempt.answers.map(
        (answer) => answer.questionId,
      );
      const activeQuestions = allQuestions.filter((question) =>
        activeQuestionIds.includes(question.id),
      );
      /* |-------------------------------------------------------------------------- | ACTIVE ATTEMPT EXISTS |-------------------------------------------------------------------------- */ if (
        activeQuestions.length > 0
      ) {
        const orderedQuestions = activeQuestionIds
          .map((id) => activeQuestions.find((question) => question.id === id))
          .filter((question): question is (typeof allQuestions)[number] =>
            Boolean(question),
          );
        const quizQuestions: QuizQuestion[] = orderedQuestions.map(
          (question, index) => ({
            id: question.id,
            number: index + 1,
            text: question.text,
            difficulty: question.difficulty,
            /* * Question.type does not currently exist * in the Prisma schema. * * The actual answer submission supports * multiple option IDs, so the client should * not depend on this field for grading. */ type: "SINGLE_CHOICE",
            options: question.options.map((option) => ({
              id: option.id,
              text: option.text,
            })),
          }),
        );
        return {
          success: true,
          quiz: {
            id: exam.id,
            type: exam.type,
            title: exam.lesson.title,
            description: null,
            passingScore: exam.passingScore,
            lesson: {
              id: exam.lesson.id,
              title: exam.lesson.title,
              order: exam.lesson.order,
            },
            course: { id: courseId, title: exam.lesson.course.title },
            questions: quizQuestions,
          },
          attempt: {
            id: activeAttempt.id,
            attemptNumber: activeAttempt.attemptNumber,
            isActive: true,
            startedAt: activeAttempt.startedAt,
          },
        };
      }
    }
    /* |-------------------------------------------------------------------------- | USED QUESTION IDS |-------------------------------------------------------------------------- | | Only submitted attempts count as consumed questions. | */ const usedQuestionIds =
      previousAttempts
        .filter((attempt) => attempt.submittedAt !== null)
        .flatMap((attempt) =>
          attempt.answers.map((answer) => answer.questionId),
        );
    /* |-------------------------------------------------------------------------- | USED COUNTS |-------------------------------------------------------------------------- */ const usedEasyCount =
      easyQuestions.filter((question) =>
        usedQuestionIds.includes(question.id),
      ).length;
    const usedMediumCount = mediumQuestions.filter((question) =>
      usedQuestionIds.includes(question.id),
    ).length;
    const usedHardCount = hardQuestions.filter((question) =>
      usedQuestionIds.includes(question.id),
    ).length;
    /* |-------------------------------------------------------------------------- | CYCLE |-------------------------------------------------------------------------- | | A complete cycle means that every question from every | difficulty has been used. | */ const cycleCompleted =
      usedEasyCount >= easyQuestions.length &&
      usedMediumCount >= mediumQuestions.length &&
      usedHardCount >= hardQuestions.length;
    /* |-------------------------------------------------------------------------- | CURRENT CYCLE QUESTIONS |-------------------------------------------------------------------------- */ const currentCycleUsedIds =
      cycleCompleted ? [] : usedQuestionIds;
    /* |-------------------------------------------------------------------------- | AVAILABLE QUESTIONS |-------------------------------------------------------------------------- */ const getAvailableQuestions =
      (difficulty: Difficulty) => {
        return allQuestions.filter(
          (question) =>
            question.difficulty === difficulty &&
            !currentCycleUsedIds.includes(question.id),
        );
      };
    /* |-------------------------------------------------------------------------- | SELECT QUESTIONS |-------------------------------------------------------------------------- */ const selectedQuestions: typeof allQuestions =
      [];
    for (const difficulty of DIFFICULTIES) {
      let available = getAvailableQuestions(difficulty);
      /* |-------------------------------------------------------------------------- | If there aren't enough unused questions of this | difficulty, restart this difficulty's rotation. | | This is important because: | | EASY = 8 / 2 = 4 attempts | MEDIUM = 8 / 2 = 4 attempts | HARD = 4 / 2 = 2 attempts | | Therefore HARD must rotate independently. |-------------------------------------------------------------------------- */ if (
        available.length < QUESTIONS_PER_LEVEL
      ) {
        available = allQuestions.filter(
          (question) => question.difficulty === difficulty,
        );
      }
      const selected = shuffle(available).slice(0, QUESTIONS_PER_LEVEL);
      if (selected.length < QUESTIONS_PER_LEVEL) {
        return {
          success: false,
          error: "INSUFFICIENT_AVAILABLE_QUESTIONS",
          message: `لا توجد أسئلة كافية من مستوى ${difficulty} لهذه المحاولة.`,
        };
      }
      selectedQuestions.push(...selected);
    }
    /* |-------------------------------------------------------------------------- | SHUFFLE FINAL QUESTIONS |-------------------------------------------------------------------------- */ const finalQuestions =
      shuffle(selectedQuestions);
    /* |-------------------------------------------------------------------------- | NEXT ATTEMPT NUMBER |-------------------------------------------------------------------------- */ const nextAttemptNumber =
      previousAttempts.length + 1;
    /* |-------------------------------------------------------------------------- | CREATE ATTEMPT |-------------------------------------------------------------------------- */ const newAttempt =
      await prisma.$transaction(async (tx) => {
        const attempt = await tx.examAttempt.create({
          data: {
            examId: exam.id,
            studentId,
            attemptNumber: nextAttemptNumber,
            score: 0,
            passed: false,
          },
          select: { id: true, attemptNumber: true, startedAt: true },
        });
        /* |-------------------------------------------------------------------------- | Create Answer records. | | IMPORTANT: | Do NOT use selectedOptionId here. | | selected options are stored later through | AnswerOption when submitQuizAction runs. |-------------------------------------------------------------------------- */ await tx.answer.createMany(
          {
            data: finalQuestions.map((question) => ({
              attemptId: attempt.id,
              questionId: question.id,
              isCorrect: false,
            })),
          },
        );
        return attempt;
      });
    /* |-------------------------------------------------------------------------- | BUILD RESPONSE QUESTIONS |-------------------------------------------------------------------------- */ const quizQuestions: QuizQuestion[] =
      finalQuestions.map((question, index) => ({
        id: question.id,
        number: index + 1,
        text: question.text,
        difficulty: question.difficulty,
        /* * Question.type does not currently exist * in the Prisma schema. * * The submit action uses selectedOptionIds[], * so grading remains independent from this field. */ type: "SINGLE_CHOICE",
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
        })),
      }));
    /* |-------------------------------------------------------------------------- | RESPONSE |-------------------------------------------------------------------------- */ return {
      success: true,
      quiz: {
        id: exam.id,
        type: exam.type,
        title: exam.lesson.title,
        description: null,
        passingScore: exam.passingScore,
        lesson: {
          id: exam.lesson.id,
          title: exam.lesson.title,
          order: exam.lesson.order,
        },
        course: { id: courseId, title: exam.lesson.course.title },
        questions: quizQuestions,
      },
      attempt: {
        id: newAttempt.id,
        attemptNumber: newAttempt.attemptNumber,
        isActive: true,
        startedAt: newAttempt.startedAt,
      },
    };
  } catch (error) {
    console.error("getQuizAction error:", error);
    return {
      success: false,
      error: "SERVER_ERROR",
      message: "حدث خطأ أثناء تحميل الاختبار.",
    };
  }
}
