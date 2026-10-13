"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false as const,
      error: "UNAUTHORIZED" as const,
    };
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      image: true,
      role: true,

      enrollments: {
        take: 1,

        orderBy: {
          enrolledAt: "desc",
        },

        select: {
          id: true,
          enrolledAt: true,

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

                  _count: {
                    select: {
                      questions: true,
                      exams: true,
                    },
                  },
                },
              },
            },
          },
        },
      },

      lessonProgress: {
        select: {
          id: true,
          lessonId: true,
          status: true,
          bestScore: true,
          attemptsCount: true,
          unlockedAt: true,
          completedAt: true,
        },
      },

      examAttempts: {
        orderBy: {
          startedAt: "desc",
        },

        select: {
          id: true,
          examId: true,
          attemptNumber: true,
          score: true,
          passed: true,
          startedAt: true,
          submittedAt: true,

          exam: {
            select: {
              id: true,
              type: true,
              lessonId: true,
              courseId: true,

              lesson: {
                select: {
                  id: true,
                  title: true,
                  order: true,
                },
              },
            },
          },
        },
      },

      studentProfile: {
        select: {
          preferSimplified: true,
          preferSplitIntoParts: true,
          preferGraphics: true,
          overallAverageScore: true,
          totalAttempts: true,
          strugglingFlag: true,
        },
      },
    },
  });

  if (!user) {
    return {
      success: false as const,
      error: "USER_NOT_FOUND" as const,
    };
  }

  // =========================================================
  // Current Enrollment
  // =========================================================

  const enrollment = user.enrollments[0] ?? null;

  if (!enrollment) {
    return {
      success: true as const,

      data: {
        user: {
          id: user.id,
          name: user.name,
          image: user.image,    
          role: user.role,
        },

        course: null,

        stats: {
          completedLessons: 0,
          totalLessons: 0,
          progress: 0,
          totalAttempts: 0,
          passedAttempts: 0,
          failedAttempts: 0,
          averageScore: 0,
        },

        lessons: [],

        currentLesson: null,

        latestAttempt: null,

        studentProfile: user.studentProfile,
      },
    };
  }

  const course = enrollment.course;

  // =========================================================
  // Progress Map
  // =========================================================

  const progressMap = new Map(
    user.lessonProgress.map((progress) => [
      progress.lessonId,
      progress,
    ]),
  );

  // =========================================================
  // Lessons
  // =========================================================

  const lessons = course.lessons.map((lesson) => {
    const progress = progressMap.get(lesson.id);

    return {
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,

      status: progress?.status ?? "LOCKED",

      bestScore: progress?.bestScore ?? 0,

      attemptsCount:
        progress?.attemptsCount ?? 0,

      unlockedAt:
        progress?.unlockedAt ?? null,

      completedAt:
        progress?.completedAt ?? null,

      questionsCount:
        lesson._count.questions,

      examsCount:
        lesson._count.exams,
    };
  });

  // =========================================================
  // Lesson Statistics
  // =========================================================

  const totalLessons = lessons.length;

  const completedLessons = lessons.filter(
    (lesson) => lesson.status === "PASSED",
  ).length;

  const progress =
    totalLessons > 0
      ? Math.round(
          (completedLessons / totalLessons) * 100,
        )
      : 0;

  // =========================================================
  // Current Lesson
  // =========================================================

  const currentLesson =
    lessons.find(
      (lesson) =>
        lesson.status === "IN_PROGRESS",
    ) ??
    lessons.find(
      (lesson) =>
        lesson.status === "AVAILABLE",
    ) ??
    lessons.find(
      (lesson) =>
        lesson.status !== "PASSED",
    ) ??
    null;

  // =========================================================
  // Exam Statistics
  // =========================================================

  const totalAttempts =
    user.examAttempts.length;

  const passedAttempts =
    user.examAttempts.filter(
      (attempt) => attempt.passed,
    ).length;

  const failedAttempts =
    user.examAttempts.filter(
      (attempt) => !attempt.passed,
    ).length;

  const averageScore =
    totalAttempts > 0
      ? Math.round(
          user.examAttempts.reduce(
            (total, attempt) =>
              total + attempt.score,
            0,
          ) / totalAttempts,
        )
      : 0;

  // =========================================================
  // Latest Attempt
  // =========================================================

  const latestAttempt =
    user.examAttempts[0] ?? null;

  // =========================================================
  // Recent Attempts
  // =========================================================

  const recentAttempts =
    user.examAttempts.slice(0, 5).map(
      (attempt) => ({
        id: attempt.id,
        examId: attempt.examId,
        attemptNumber:
          attempt.attemptNumber,

        score: attempt.score,

        passed: attempt.passed,

        startedAt: attempt.startedAt,
        submittedAt:
          attempt.submittedAt,

        exam: {
          id: attempt.exam.id,
          type: attempt.exam.type,

          lessonId:
            attempt.exam.lessonId,

          courseId:
            attempt.exam.courseId,

          lesson:
            attempt.exam.lesson,
        },
      }),
    );

  // =========================================================
  // Course Completion
  // =========================================================

  const isCourseCompleted =
    totalLessons > 0 &&
    completedLessons === totalLessons;

  // =========================================================
  // Final Exam Status
  // =========================================================

  const finalExamAttempts =
    user.examAttempts.filter(
      (attempt) =>
        attempt.exam.type === "FINAL_EXAM",
    );

  const hasFinalExamAttempt =
    finalExamAttempts.length > 0;

  const finalExamPassed =
    finalExamAttempts.some(
      (attempt) => attempt.passed,
    );

  // =========================================================
  // Return
  // =========================================================

  return {
    success: true as const,

    data: {
      user: {
        id: user.id,
        name: user.name,
        image: user.image,
    
        role: user.role,
      },

      course: {
        id: course.id,
        title: course.title,
        description: course.description,

        totalLessons,

        completedLessons,

        progress,

        isCompleted:
          isCourseCompleted,

        enrolledAt:
          enrollment.enrolledAt,
      },

      lessons,

      currentLesson,

      stats: {
        completedLessons,
        totalLessons,
        progress,

        totalAttempts,

        passedAttempts,

        failedAttempts,

        averageScore,
      },

      latestAttempt,

      recentAttempts,

      finalExam: {
        hasAttempt:
          hasFinalExamAttempt,

        passed:
          finalExamPassed,

        attempts:
          finalExamAttempts.length,
      },

      studentProfile:
        user.studentProfile,
    },
  };
}