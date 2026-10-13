import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import LessonsClient from "@/components/lessons/lessons-page-client";

export default async function LessonsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "STUDENT") {
    redirect("/dashboard");
  }

  const studentId = session.user.id;

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId,
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,

          lessons: {
            orderBy: {
              order: "asc",
            },

            select: {
              id: true,
              title: true,
              order: true,

              progress: {
                where: {
                  studentId,
                },
                select: {
                  status: true,
                  bestScore: true,
                  attemptsCount: true,
                  unlockedAt: true,
                  completedAt: true,
                },
                take: 1,
              },

              _count: {
                select: {
                  contentVariants: true,
                  questions: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!enrollment?.course) {
    return <LessonsClient course={null} />;
  }

  const lessons = enrollment.course.lessons;

  const formattedLessons = lessons.map((lesson, index) => {
    const progress = lesson.progress[0];

    const isPassed = progress?.status === "PASSED";

    /*
     * الدرس الأول متاح دائمًا.
     *
     * أي درس بعده لا يفتح إلا إذا كان
     * الدرس السابق PASSED.
     */
    const previousLesson = lessons[index - 1];

    const previousProgress = previousLesson?.progress[0];

    const previousPassed =
      previousProgress?.status === "PASSED";

    let status:
      | "LOCKED"
      | "AVAILABLE"
      | "IN_PROGRESS"
      | "PASSED";

    if (isPassed) {
      status = "PASSED";
    } else if (index === 0) {
      status = progress
        ? "IN_PROGRESS"
        : "AVAILABLE";
    } else if (previousPassed) {
      status = progress
        ? "IN_PROGRESS"
        : "AVAILABLE";
    } else {
      status = "LOCKED";
    }

    return {
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,

      status,

      bestScore: progress?.bestScore ?? 0,
      attemptsCount: progress?.attemptsCount ?? 0,

      unlockedAt:
        progress?.unlockedAt?.toISOString() ?? null,

      completedAt:
        progress?.completedAt?.toISOString() ?? null,

      contentCount: lesson._count.contentVariants,
      questionCount: lesson._count.questions,
    };
  });

  return (
    <LessonsClient
      course={{
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        lessons: formattedLessons,
      }}
    />
  );
}