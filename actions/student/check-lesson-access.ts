"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function checkLessonAccess(lessonId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        allowed: false,
        reason: "UNAUTHORIZED",
        message: "يجب تسجيل الدخول أولًا.",
      };
    }

    if (session.user.role !== "STUDENT") {
      return {
        success: false,
        allowed: false,
        reason: "FORBIDDEN",
        message: "هذه الصفحة متاحة للطلاب فقط.",
      };
    }

    const studentId = session.user.id;

    /*
     * نتأكد أن الدرس موجود
     */
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        id: true,
        title: true,
        order: true,
        courseId: true,
      },
    });

    if (!lesson) {
      return {
        success: false,
        allowed: false,
        reason: "LESSON_NOT_FOUND",
        message: "الدرس غير موجود.",
      };
    }

    /*
     * نتأكد أن الطالب مسجل في نفس المقرر
     */
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: lesson.courseId,
        },
      },
      select: {
        id: true,
      },
    });

    if (!enrollment) {
      return {
        success: false,
        allowed: false,
        reason: "NOT_ENROLLED",
        message: "أنت غير مسجل في هذا المقرر.",
      };
    }

    /*
     * أول درس متاح للطالب إذا لم يسبق له البدء.
     */
    if (lesson.order === 1) {
      return {
        success: true,
        allowed: true,
        reason: "AVAILABLE",
        lesson,
      };
    }

    /*
     * نجيب الدرس السابق
     */
    const previousLesson = await prisma.lesson.findFirst({
      where: {
        courseId: lesson.courseId,
        order: lesson.order - 1,
      },
      select: {
        id: true,
        title: true,
        order: true,
      },
    });

    if (!previousLesson) {
      return {
        success: false,
        allowed: false,
        reason: "PREVIOUS_LESSON_NOT_FOUND",
        message: "تعذر التحقق من الدرس السابق.",
      };
    }

    /*
     * حالة الدرس السابق للطالب
     */
    const previousProgress = await prisma.lessonProgress.findUnique({
      where: {
        studentId_lessonId: {
          studentId,
          lessonId: previousLesson.id,
        },
      },
      select: {
        status: true,
        bestScore: true,
        completedAt: true,
      },
    });

    /*
     * لا يسمح بالدخول إلا بعد اجتياز الدرس السابق.
     */
    if (
      !previousProgress ||
      previousProgress.status !== "PASSED"
    ) {
      return {
        success: true,
        allowed: false,
        reason: "LOCKED",
        message: `يجب إكمال "${previousLesson.title}" بدرجة لا تقل عن 50/100 أولًا.`,
        previousLesson,
        previousProgress,
      };
    }

    return {
      success: true,
      allowed: true,
      reason: "AVAILABLE",
      lesson,
      previousLesson,
      previousProgress,
    };
  } catch (error) {
    console.error("checkLessonAccess error:", error);

    return {
      success: false,
      allowed: false,
      reason: "SERVER_ERROR",
      message: "حدث خطأ أثناء التحقق من صلاحية الدرس.",
    };
  }
}