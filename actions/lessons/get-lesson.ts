"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import type {
  LessonData,
  LockedLessonData,
} from "@/types/lessons";

import { getLessonAttempts } from "./get-lesson-attempts";
import { getLessonData } from "./get-lesson-data";
import { getLessonNavigation } from "./get-lesson-navigation";
import { getLessonProgress } from "./get-lesson-progress";
import { getLessonRemediation } from "./get-lesson-remediation";

type GetLessonSuccess = {
  success: true;
  data: LessonData;
};

type GetLessonLocked = {
  success: false;
  error: "LESSON_LOCKED";
  data: LockedLessonData;
};

type GetLessonError = {
  success: false;
  error:
    | "UNAUTHORIZED"
    | "LESSON_NOT_FOUND"
    | "NOT_ENROLLED"
    | "INTERNAL_ERROR";
  data?: never;
};

export type GetLessonResult =
  | GetLessonSuccess
  | GetLessonLocked
  | GetLessonError;

export async function getLesson(
  lessonId: string,
): Promise<GetLessonResult> {
  try {
    // ==========================================
    // 1. Authentication
    // ==========================================

    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        error: "UNAUTHORIZED",
      };
    }

    const studentId = session.user.id;

    // ==========================================
    // 2. Get lesson data
    // ==========================================

    const lessonData = await getLessonData(lessonId);

    if (!lessonData) {
      return {
        success: false,
        error: "LESSON_NOT_FOUND",
      };
    }

    // ==========================================
    // 3. Check enrollment
    // ==========================================

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: lessonData.course.id,
        },
      },
      select: {
        id: true,
        enrolledAt: true,
      },
    });

    if (!enrollment) {
      return {
        success: false,
        error: "NOT_ENROLLED",
      };
    }

    // ==========================================
    // 4. Get progress and access
    // ==========================================

    const progressData = await getLessonProgress(
      lessonId,
      studentId,
    );

    if (!progressData) {
      return {
        success: false,
        error: "INTERNAL_ERROR",
      };
    }

    // ==========================================
    // 5. Locked lesson
    // ==========================================

    if (!progressData.access.isUnlocked) {
      const previousLesson = progressData.previousLesson;

      const lockedData: LockedLessonData = {
        lesson: {
          id: lessonData.id,
          title: lessonData.title,
          order: lessonData.order,
        },

        course: {
          id: lessonData.course.id,
          title: lessonData.course.title,
          description: lessonData.course.description,
        },

        access: {
          status: "LOCKED",
          isUnlocked: false,
          isCompleted: false,
        },

        previousLesson: {
          id: previousLesson?.id ?? null,
          title: previousLesson?.title ?? null,
          order: previousLesson?.order ?? null,

          status:
            progressData.previousProgress?.status ??
            "LOCKED",

          bestScore:
            progressData.previousProgress?.bestScore ?? 0,

          attemptsCount:
            progressData.previousProgress?.attemptsCount ?? 0,
        },
      };

      return {
        success: false,
        error: "LESSON_LOCKED",
        data: lockedData,
      };
    }

    // ==========================================
    // 6. Get attempts
    // ==========================================

    const attempts = await getLessonAttempts(
      lessonId,
      studentId,
    );

    // ==========================================
    // 7. Get remediation
    // ==========================================

    const latestAttempt = attempts[0] ?? null;

    const recommendedRemediation =
      getLessonRemediation({
        latestAttempt,
        contentVariants: lessonData.contentVariants,
        
      });

    // ==========================================
    // 8. Get navigation
    // ==========================================

    const navigation = await getLessonNavigation(
      lessonId,
      lessonData.course.id,
    );

    if (!navigation) {
      return {
        success: false,
        error: "INTERNAL_ERROR",
      };
    }

    // ==========================================
    // 9. Build final LessonData
    // ==========================================

    const data: LessonData = {
      lesson: {
        id: lessonData.id,
        title: lessonData.title,
        order: lessonData.order,
        sourceContent: lessonData.sourceContent,
        createdAt: lessonData.createdAt,
      },

      course: {
        id: lessonData.course.id,
        title: lessonData.course.title,
        description: lessonData.course.description,
      },

      enrollment,

      access: progressData.access,

      progress: progressData.progress,

      contentVariants:
        lessonData.contentVariants,

      recommendedRemediation,

      questions: lessonData.questions,

      exams: lessonData.exams,

      attempts,

      externalResources:
        lessonData.externalResources,

      navigation,

      counts: {
        questions: lessonData.questions.length,
        exams: lessonData.exams.length,
        contentVariants:
          lessonData.contentVariants.length,
        externalResources:
          lessonData.externalResources.length,
      },
    };

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("getLesson error:", error);

    return {
      success: false,
      error: "INTERNAL_ERROR",
    };
  }
}