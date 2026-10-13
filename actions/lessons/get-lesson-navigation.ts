"use server";

import { prisma } from "@/lib/prisma";

export async function getLessonNavigation(
  lessonId: string,
  courseId: string,
) {
  const currentLesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      order: true,
    },
  });

  if (!currentLesson) {
    return null;
  }

  const [previous, next, total] = await Promise.all([
    prisma.lesson.findFirst({
      where: {
        courseId,
        order: {
          lt: currentLesson.order,
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
    }),

    prisma.lesson.findFirst({
      where: {
        courseId,
        order: {
          gt: currentLesson.order,
        },
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        title: true,
        order: true,
      },
    }),

    prisma.lesson.count({
      where: {
        courseId,
      },
    }),
  ]);

  return {
    previous,
    next,
    current: currentLesson.order,
    total,
  };
}