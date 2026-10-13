
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type QuizListItem = {
  id: string;
  type: "LESSON_QUIZ" | "FINAL_EXAM";

  title: string;
  description: string;

  passingScore: number;

  lesson: {
    id: string;
    title: string;
    order: number;
  } | null;

  course: {
    id: string;
    title: string;
  } | null;

  questionsCount: number;

  result: {
    attemptId: string;
    attemptNumber: number;
    score: number;
    passed: boolean;
    submittedAt: Date;
  };
};

export type GetQuizzesResult =
  | {
      success: true;
      quizzes: QuizListItem[];
    }
  | {
      success: false;
      error:
        | "UNAUTHORIZED"
        | "FORBIDDEN"
        | "SERVER_ERROR";
      message: string;
    };

export async function getQuizzesAction(): Promise<GetQuizzesResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "UNAUTHORIZED",
        message: "يجب تسجيل الدخول أولاً.",
      };
    }

    const studentId = session.user.id;

    const exams = await prisma.exam.findMany({
      where: {
        OR: [
          {
            type: "LESSON_QUIZ",

            lesson: {
              course: {
                enrollments: {
                  some: {
                    studentId,
                  },
                },
              },
            },
          },
          {
            type: "FINAL_EXAM",

            course: {
              enrollments: {
                some: {
                  studentId,
                },
              },
            },
          },
        ],

        /*
         * لا نعرض الاختبار إلا إذا كان الطالب
         * عمل Submit لمحاولة واحدة على الأقل.
         */
        attempts: {
          some: {
            studentId,
            submittedAt: {
              not: null,
            },
          },
        },
      },

      orderBy: [
        {
          lesson: {
            order: "asc",
          },
        },
        {
          createdAt: "asc",
        },
      ],

      select: {
        id: true,
        type: true,
        passingScore: true,

        lesson: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },

        course: {
          select: {
            id: true,
            title: true,
          },
        },

        attempts: {
          where: {
            studentId,
            submittedAt: {
              not: null,
            },
          },

          orderBy: {
            attemptNumber: "desc",
          },

          select: {
            id: true,
            attemptNumber: true,
            score: true,
            passed: true,
            submittedAt: true,

            _count: {
              select: {
                answers: true,
              },
            },
          },
        },
      },
    });

    const quizzes: QuizListItem[] = exams.flatMap((exam) => {
      /*
       * بسبب الـ where فوق، المفروض يكون فيه
       * submitted attempt.
       *
       * لكن نتحقق منه أيضًا للحماية من أي حالة غير متوقعة.
       */
      const lastAttempt = exam.attempts[0];

      if (!lastAttempt?.submittedAt) {
        return [];
      }

      const title =
        exam.type === "FINAL_EXAM"
          ? "الاختبار النهائي"
          : exam.lesson
            ? `اختبار ${exam.lesson.title}`
            : "اختبار الدرس";

      const description =
        exam.type === "FINAL_EXAM"
          ? "الاختبار النهائي للمقرر."
          : exam.lesson
            ? `نتيجة اختبار درس ${exam.lesson.title}.`
            : "نتيجة اختبار الدرس.";

      return [
        {
          id: exam.id,

          type: exam.type,

          title,

          description,

          passingScore: exam.passingScore,

          lesson: exam.lesson,

          course: exam.course,

          questionsCount: lastAttempt._count.answers,

          result: {
            attemptId: lastAttempt.id,
            attemptNumber: lastAttempt.attemptNumber,
            score: lastAttempt.score,
            passed: lastAttempt.passed,
            submittedAt: lastAttempt.submittedAt,
          },
        },
      ];
    });

    return {
      success: true,
      quizzes,
    };
  } catch (error) {
    console.error("getQuizzesAction error:", error);

    return {
      success: false,
      error: "SERVER_ERROR",
      message: "حدث خطأ أثناء تحميل نتائج الاختبارات.",
    };
  }
}
