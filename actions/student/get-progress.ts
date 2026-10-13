
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type LessonProgressItem = {
  id: string;

  lesson: {
    id: string;
    title: string;
    order: number;
    course: {
      id: string;
      title: string;
    };
  };

  status:
    | "LOCKED"
    | "AVAILABLE"
    | "IN_PROGRESS"
    | "PASSED";

  bestScore: number;
  attemptsCount: number;

  unlockedAt: Date | null;
  completedAt: Date | null;
};

export type ProgressSummary = {
  totalLessons: number;
  completedLessons: number;
  inProgressLessons: number;
  availableLessons: number;
  lockedLessons: number;

  completionPercentage: number;
  averageScore: number;
  totalAttempts: number;
};

export type GetProgressResult =
  | {
      success: true;
      progress: LessonProgressItem[];
      summary: ProgressSummary;
    }
  | {
      success: false;
      error:
        | "UNAUTHORIZED"
        | "NOT_FOUND"
        | "SERVER_ERROR";
      message: string;
    };

export async function getProgressAction(): Promise<GetProgressResult> {
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

    /*
     * جلب تقدم الطالب في جميع الدروس
     */
    const progress = await prisma.lessonProgress.findMany({
      where: {
        studentId,
      },

      orderBy: {
        lesson: {
          order: "asc",
        },
      },

      select: {
        id: true,

        status: true,

        bestScore: true,

        attemptsCount: true,

        unlockedAt: true,

        completedAt: true,

        lesson: {
          select: {
            id: true,

            title: true,

            order: true,

            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    /*
     * الإحصائيات
     */
    const totalLessons = progress.length;

    const completedLessons = progress.filter(
      (item) => item.status === "PASSED",
    ).length;

    const inProgressLessons = progress.filter(
      (item) => item.status === "IN_PROGRESS",
    ).length;

    const availableLessons = progress.filter(
      (item) => item.status === "AVAILABLE",
    ).length;

    const lockedLessons = progress.filter(
      (item) => item.status === "LOCKED",
    ).length;

    const totalScore = progress.reduce(
      (sum, item) => sum + item.bestScore,
      0,
    );

    const averageScore =
      totalLessons > 0
        ? Math.round(totalScore / totalLessons)
        : 0;

    const totalAttempts = progress.reduce(
      (sum, item) => sum + item.attemptsCount,
      0,
    );

    const completionPercentage =
      totalLessons > 0
        ? Math.round(
            (completedLessons / totalLessons) * 100,
          )
        : 0;

    return {
      success: true,

      progress,

      summary: {
        totalLessons,

        completedLessons,

        inProgressLessons,

        availableLessons,

        lockedLessons,

        completionPercentage,

        averageScore,

        totalAttempts,
      },
    };
  } catch (error) {
    console.error("getProgressAction error:", error);

    return {
      success: false,
      error: "SERVER_ERROR",
      message: "حدث خطأ أثناء تحميل تقدم الطالب.",
    };
  }
}
