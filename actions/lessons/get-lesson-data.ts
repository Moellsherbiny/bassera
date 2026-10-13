"use server";

import { prisma } from "@/lib/prisma";

export async function getLessonData(lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },

      contentVariants: {
        orderBy: {
          variantOrder: "asc",
        },
        select: {
          id: true,
          type: true,
          interactiveType: true,
          isSimplified: true,
          isSplitIntoParts: true,
          hasGraphics: true,
          data: true,
          variantOrder: true,
          generatedByAI: true,
          createdAt: true,
        },
      },

      questions: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          text: true,
          difficulty: true,
          generatedByAI: true,

          options: {
            orderBy: {
              id: "asc",
            },
            select: {
              id: true,
              text: true,
            },
          },
        },
      },

      exams: {
        where: {
          type: "LESSON_QUIZ",
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          type: true,
          passingScore: true,
          createdAt: true,
        },
      },

      externalResources: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          title: true,
          url: true,
          source: true,
          createdAt: true,
        },
      },
    },
  });

  if (!lesson) {
    return null;
  }

  return lesson;
}