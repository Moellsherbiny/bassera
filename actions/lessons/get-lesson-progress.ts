"use server";

import { prisma } from "@/lib/prisma";

export async function getLessonProgress(
  lessonId: string,
  studentId: string,
) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      order: true,
      courseId: true,
    },
  });

  if (!lesson) {
    return null;
  }

  const progress = await prisma.lessonProgress.findUnique({
    where: {
      studentId_lessonId: {
        studentId,
        lessonId,
      },
    },
    select: {
      id: true,
      status: true,
      bestScore: true,
      attemptsCount: true,
      unlockedAt: true,
      completedAt: true,
    },
  });

  const previousLesson = await prisma.lesson.findFirst({
    where: {
      courseId: lesson.courseId,
      order: {
        lt: lesson.order,
      },
    },
    orderBy: {
      order: "desc",
    },
    select: {
      id: true,
      title: true,
      order: true,
    },
  });

  const previousProgress = previousLesson
    ? await prisma.lessonProgress.findUnique({
        where: {
          studentId_lessonId: {
            studentId,
            lessonId: previousLesson.id,
          },
        },
        select: {
          status: true,
          bestScore: true,
          attemptsCount: true,
        },
      })
    : null;

  const isFirstLesson = !previousLesson;

  const isUnlocked =
    isFirstLesson ||
    previousProgress?.status === "PASSED";

  const status =
    progress?.status ??
    (isUnlocked ? "AVAILABLE" : "LOCKED");

  return {
    progress: {
      id: progress?.id ?? null,
      status,
      bestScore: progress?.bestScore ?? 0,
      attemptsCount: progress?.attemptsCount ?? 0,
      unlockedAt: progress?.unlockedAt ?? null,
      completedAt: progress?.completedAt ?? null,
    },

    access: {
      status,
      isUnlocked,
      isCompleted: status === "PASSED",
    },

    previousLesson,

    previousProgress,
  };
}