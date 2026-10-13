"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type SubmittedAnswer = {
  questionId: string;
  selectedOptionIds: string[];
};

type SubmitQuizInput = {
  attemptId: string;
  answers: SubmittedAnswer[];
};

type SubmitQuizResult =
  | {
      success: true;
      result: {
        attemptId: string;
        attemptNumber: number;
        score: number;
        correctAnswers: number;
        wrongAnswers: number;
        unansweredQuestions: number;
        totalQuestions: number;
        passed: boolean;
        passingScore: number;
      };
    }
  | {
      success: false;
      error: string;
    };

/**
 * Normalize an array of IDs.
 *
 * - Removes empty values
 * - Removes duplicates
 * - Sorts the result
 *
 * Sorting allows us to compare two sets of option IDs
 * regardless of the order in which the student selected them.
 */
function normalizeIds(ids: string[]) {
  return [...new Set(ids.filter(Boolean))].sort();
}

/**
 * Compare two arrays as sets.
 */
function sameIds(a: string[], b: string[]) {
  const normalizedA = normalizeIds(a);
  const normalizedB = normalizeIds(b);

  if (normalizedA.length !== normalizedB.length) {
    return false;
  }

  return normalizedA.every((id, index) => id === normalizedB[index]);
}

export async function submitQuizAction(
  input: SubmitQuizInput,
): Promise<SubmitQuizResult> {
  try {
    /*
     * ============================================================
     * 1. Authentication
     * ============================================================
     */

    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "يجب تسجيل الدخول أولاً.",
      };
    }

    const studentId = session.user.id;

    /*
     * ============================================================
     * 2. Validate input
     * ============================================================
     */

    if (!input?.attemptId) {
      return {
        success: false,
        error: "معرّف المحاولة غير صالح.",
      };
    }

    if (!Array.isArray(input.answers)) {
      return {
        success: false,
        error: "الإجابات المرسلة غير صالحة.",
      };
    }

    /*
     * ============================================================
     * 3. Get the attempt
     * ============================================================
     *
     * We load:
     *
     * Attempt
     *   └── Exam
     *        └── Lesson
     *
     * And:
     *
     * Attempt
     *   └── Answers
     *        └── Question
     *             └── Options
     *
     * The options are needed only on the server to calculate
     * correctness. They are NEVER returned to the client.
     */

    const attempt = await prisma.examAttempt.findUnique({
      where: {
        id: input.attemptId,
      },
      include: {
        exam: {
          include: {
            lesson: {
              select: {
                id: true,
                courseId: true,
              },
            },
            course: {
              select: {
                id: true,
              },
            },
          },
        },

        answers: {
          include: {
            question: {
              include: {
                options: {
                  select: {
                    id: true,
                    isCorrect: true,
                  },
                },
              },
            },

            selectedOptions: {
              select: {
                optionId: true,
              },
            },
          },
        },
      },
    });

    if (!attempt) {
      return {
        success: false,
        error: "لم يتم العثور على محاولة الاختبار.",
      };
    }

    /*
     * ============================================================
     * 4. Security checks
     * ============================================================
     */

    if (attempt.studentId !== studentId) {
      return {
        success: false,
        error: "غير مسموح لك بتسليم هذه المحاولة.",
      };
    }

    if (attempt.submittedAt) {
      return {
        success: false,
        error: "تم تسليم هذا الاختبار بالفعل.",
      };
    }

    if (attempt.exam.type !== "LESSON_QUIZ") {
      return {
        success: false,
        error: "نوع الاختبار غير صحيح.",
      };
    }

    /*
     * ============================================================
     * 5. Resolve course
     * ============================================================
     */

    const courseId =
      attempt.exam.courseId ?? attempt.exam.lesson?.courseId ?? null;

    if (!courseId) {
      return {
        success: false,
        error: "لم يتم العثور على الكورس المرتبط بالاختبار.",
      };
    }

    /*
     * ============================================================
     * 6. Verify enrollment
     * ============================================================
     */

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!enrollment) {
      return {
        success: false,
        error: "أنت غير مسجل في هذا الكورس.",
      };
    }

    /*
     * ============================================================
     * 7. Validate attempt questions
     * ============================================================
     */

    const attemptAnswers = attempt.answers;

    if (attemptAnswers.length === 0) {
      return {
        success: false,
        error: "لا توجد أسئلة مرتبطة بهذه المحاولة.",
      };
    }

    /*
     * Create a map for quick lookup:
     *
     * questionId -> submitted option IDs
     */

    const submittedMap = new Map<string, string[]>();

    for (const submittedAnswer of input.answers) {
      if (!submittedAnswer?.questionId) {
        continue;
      }

      const optionIds = Array.isArray(submittedAnswer.selectedOptionIds)
        ? submittedAnswer.selectedOptionIds
        : [];

      /*
       * If the same question is submitted more than once,
       * we keep the last submitted value.
       */
      submittedMap.set(submittedAnswer.questionId, normalizeIds(optionIds));
    }

    /*
     * ============================================================
     * 8. Make sure the client didn't submit unknown questions
     * ============================================================
     *
     * A student must only be able to answer questions belonging
     * to this exact attempt.
     */

    const attemptQuestionIds = new Set(
      attemptAnswers.map((answer) => answer.questionId),
    );

    for (const submittedAnswer of input.answers) {
      if (!attemptQuestionIds.has(submittedAnswer.questionId)) {
        return {
          success: false,
          error: "تم إرسال سؤال غير مرتبط بهذه المحاولة.",
        };
      }
    }

    /*
     * ============================================================
     * 9. Calculate every answer
     * ============================================================
     */

    let correctAnswers = 0;
    let unansweredQuestions = 0;

    const evaluatedAnswers: {
      answerId: string;
      questionId: string;
      selectedOptionIds: string[];
      correctOptionIds: string[];
      isCorrect: boolean;
    }[] = [];

    for (const attemptAnswer of attemptAnswers) {
      const questionId = attemptAnswer.questionId;

      /*
       * Student's selected options.
       */
      const selectedOptionIds = submittedMap.get(questionId) ?? [];

      /*
       * All correct options according to the database.
       */
      const correctOptionIds = normalizeIds(
        attemptAnswer.question.options
          .filter((option) => option.isCorrect)
          .map((option) => option.id),
      );

      /*
       * No answer.
       */
      if (selectedOptionIds.length === 0) {
        unansweredQuestions++;

        evaluatedAnswers.push({
          answerId: attemptAnswer.id,
          questionId,
          selectedOptionIds: [],
          correctOptionIds,
          isCorrect: false,
        });

        continue;
      }

      /*
       * Make sure the selected options actually belong
       * to this question.
       *
       * This prevents someone from submitting an option ID
       * belonging to another question.
       */

      const validOptionIds = new Set(
        attemptAnswer.question.options.map((option) => option.id),
      );

      const hasInvalidOption = selectedOptionIds.some(
        (optionId) => !validOptionIds.has(optionId),
      );

      if (hasInvalidOption) {
        return {
          success: false,
          error: "تم إرسال اختيار غير صالح لأحد الأسئلة.",
        };
      }

      /*
       * The answer is correct ONLY when the two sets are
       * exactly equal.
       *
       * Example:
       *
       * Correct: [A, C]
       * Student: [A, C]
       * => true
       *
       * Correct: [A, C]
       * Student: [A]
       * => false
       *
       * Correct: [A]
       * Student: [A, C]
       * => false
       */

      const isCorrect = sameIds(selectedOptionIds, correctOptionIds);

      if (isCorrect) {
        correctAnswers++;
      }

      evaluatedAnswers.push({
        answerId: attemptAnswer.id,
        questionId,
        selectedOptionIds,
        correctOptionIds,
        isCorrect,
      });
    }

    /*
     * ============================================================
     * 10. Calculate score
     * ============================================================
     */

    const totalQuestions = attemptAnswers.length;

    const wrongAnswers = totalQuestions - correctAnswers - unansweredQuestions;

    const score =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    const passed = score >= attempt.exam.passingScore;

    const submittedAt = new Date();

    /*
     * ============================================================
     * 11. Transaction
     * ============================================================
     */

    await prisma.$transaction(async (tx) => {
      /*
       * ----------------------------------------------------------
       * A. Update answers
       * ----------------------------------------------------------
       */

      for (const evaluated of evaluatedAnswers) {
        /*
         * Update correctness.
         */
        await tx.answer.update({
          where: {
            id: evaluated.answerId,
          },
          data: {
            isCorrect: evaluated.isCorrect,
          },
        });

        /*
         * Remove previously stored selected options.
         *
         * Normally there won't be any because the attempt
         * is being submitted for the first time, but deleting
         * them first makes the operation idempotent and safe.
         */

        await tx.answerOption.deleteMany({
          where: {
            answerId: evaluated.answerId,
          },
        });

        /*
         * Store selected options.
         */

        if (evaluated.selectedOptionIds.length > 0) {
          await tx.answerOption.createMany({
            data: evaluated.selectedOptionIds.map((optionId) => ({
              answerId: evaluated.answerId,
              optionId,
            })),
            skipDuplicates: true,
          });
        }
      }

      /*
       * ----------------------------------------------------------
       * B. Update ExamAttempt
       * ----------------------------------------------------------
       */

      await tx.examAttempt.update({
        where: {
          id: attempt.id,
        },
        data: {
          score,
          passed,
          submittedAt,
        },
      });

      /*
       * ----------------------------------------------------------
       * C. Update LessonProgress
       * ----------------------------------------------------------
       */

      if (attempt.exam.lessonId) {
        const lessonId = attempt.exam.lessonId;
        const existingProgress = await tx.lessonProgress.findUnique({
          where: { studentId_lessonId: { studentId, lessonId } },
          select: {
            id: true,
            status: true,
            bestScore: true,
            attemptsCount: true,
            unlockedAt: true,
            completedAt: true,
          },
        });
        const previousBestScore = existingProgress?.bestScore ?? 0;
        const bestScore = Math.max(previousBestScore, score);
        /* * If the student passed this attempt, * the lesson becomes PASSED. */ if (
          passed
        ) {
          await tx.lessonProgress.upsert({
            where: { studentId_lessonId: { studentId, lessonId } },
            create: {
              studentId,
              lessonId,
              status: "PASSED",
              bestScore,
              attemptsCount: 1,
              unlockedAt: existingProgress?.unlockedAt ?? submittedAt,
              completedAt: submittedAt,
            },
            update: {
              status: "PASSED",
              bestScore,
              attemptsCount: { increment: 1 },
              completedAt: existingProgress?.completedAt ?? submittedAt,
            },
          });
        } else {
          await tx.lessonProgress.upsert({
            where: {
              studentId_lessonId: {
                studentId,
                lessonId,
              },
            },

            create: {
              studentId,
              lessonId,
              status: "IN_PROGRESS",
              bestScore,
              attemptsCount: 1,
              unlockedAt: submittedAt,
            },

            update: {
              bestScore,
              attemptsCount: {
                increment: 1,
              },
            },
          });
        }
      }
      /*
       * ----------------------------------------------------------
       * D. Update StudentProfile
       * ----------------------------------------------------------
       *
       * We calculate the statistics from ALL submitted attempts.
       */

      const submittedAttempts = await tx.examAttempt.findMany({
        where: {
          studentId,
          submittedAt: {
            not: null,
          },
        },

        select: {
          score: true,
        },
      });

      const totalAttempts = submittedAttempts.length;

      const overallAverageScore =
        totalAttempts > 0
          ? submittedAttempts.reduce((sum, item) => sum + item.score, 0) /
            totalAttempts
          : 0;

      /*
       * Basic adaptive flag.
       *
       * This can later be replaced by a more sophisticated
       * adaptive algorithm based on difficulty, attempts,
       * lessons and recent performance.
       */

      const strugglingFlag = overallAverageScore < 50;

      await tx.studentProfile.upsert({
        where: {
          userId: studentId,
        },

        create: {
          userId: studentId,
          overallAverageScore,
          totalAttempts,
          strugglingFlag,
        },

        update: {
          overallAverageScore,
          totalAttempts,
          strugglingFlag,
        },
      });
    });

    /*
     * ============================================================
     * 12. Revalidate affected pages
     * ============================================================
     */

    if (attempt.exam.lessonId) {
      revalidatePath(`/dashboard/lessons/${attempt.exam.lessonId}`);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/lessons");
    revalidatePath("/dashboard/quizzes");

    /*
     * ============================================================
     * 13. Return result
     * ============================================================
     */

    return {
      success: true,

      result: {
        attemptId: attempt.id,
        attemptNumber: attempt.attemptNumber,
        score,
        correctAnswers,
        wrongAnswers,
        unansweredQuestions,
        totalQuestions,
        passed,
        passingScore: attempt.exam.passingScore,
      },
    };
  } catch (error) {
    console.error("[submitQuizAction]", error);

    return {
      success: false,
      error: "حدث خطأ أثناء تسليم الاختبار. حاول مرة أخرى.",
    };
  }
}
