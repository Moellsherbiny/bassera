"use server";

import { prisma } from "@/lib/prisma";

export async function getLessonAttempts(
  lessonId: string,
  studentId: string,
) {
  return prisma.examAttempt.findMany({
    where: {
      studentId,

      // المحاولات التي تم تسليمها فقط
      submittedAt: {
        not: null,
      },

      exam: {
        lessonId,
        type: "LESSON_QUIZ",
      },
    },

    orderBy: [
      {
        attemptNumber: "desc",
      },
      {
        startedAt: "desc",
      },
    ],

    select: {
      id: true,
      examId: true,
      attemptNumber: true,
      score: true,
      passed: true,
      contentVariantId: true,
      startedAt: true,
      submittedAt: true,

      exam: {
        select: {
          id: true,
          type: true,
          passingScore: true,
        },
      },
    },
  });
}