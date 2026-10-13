
"use server";

import { prisma } from "@/lib/prisma";

export async function deleteAllExams() {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. احذف إجابات الطلاب
      const answers = await tx.answer.deleteMany({});

      // 2. احذف محاولات الامتحانات
      const attempts = await tx.examAttempt.deleteMany({});

      // 3. احذف الاختيارات المرتبطة بالأسئلة
      const options = await tx.questionOption.deleteMany({});

      // 4. احذف الأسئلة
      const questions = await tx.question.deleteMany({});

      // 5. احذف الامتحانات
      const exams = await tx.exam.deleteMany({});

      return {
        answers: answers.count,
        attempts: attempts.count,
        options: options.count,
        questions: questions.count,
        exams: exams.count,
      };
    });

    return {
      success: true,
      message: "تم حذف جميع الامتحانات والأسئلة بنجاح.",
      deleted: result,
    };
  } catch (error) {
    console.error("deleteAllExams error:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء حذف بيانات الامتحانات.",
    };
  }
}