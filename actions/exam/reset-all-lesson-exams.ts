"use server";

import { prisma } from "@/lib/prisma";
import { createAllLessonExams } from "./seed-all-lesson-exams";

export async function resetAllLessonExams() {
  try {
    const deleted = await prisma.$transaction(async (tx) => {
      // Answers
      const answers = await tx.answer.deleteMany({});

      // Attempts
      const attempts = await tx.examAttempt.deleteMany({});

      // Options
      const options = await tx.questionOption.deleteMany({});

      // Questions
      const questions = await tx.question.deleteMany({});

      // Exams
      const exams = await tx.exam.deleteMany({});

      return {
        answers: answers.count,
        attempts: attempts.count,
        options: options.count,
        questions: questions.count,
        exams: exams.count,
      };
    });

    // بعد التنظيف، أنشئ الامتحانات من جديد
    const seeded = await createAllLessonExams();

    return {
      success: seeded.success,
      message: seeded.success
        ? "تم حذف وإعادة إنشاء امتحانات الدروس بنجاح."
        : "تم الحذف، لكن حدث خطأ أثناء إعادة إنشاء الامتحانات.",
      deleted,
      seeded,
    };
  } catch (error) {
    console.error("resetAllLessonExams error:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء حذف وإعادة إنشاء الامتحانات.",
    };
  }
}