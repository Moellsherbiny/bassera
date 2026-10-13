"use server";

import { createLesson1Exam } from "@/actions/exam/create-lesson-1-exam";
import { createLesson2Exam } from "@/actions/exam/create-lesson-2-exam";
import { createLesson3Exam } from "@/actions/exam/create-lesson-3-exam";
import { createLesson4Exam } from "@/actions/exam/create-lesson-4-exam";

export async function createAllLessonExams() {
  try {
    const results = [];

    results.push(await createLesson1Exam());
    results.push(await createLesson2Exam());
    results.push(await createLesson3Exam());
    results.push(await createLesson4Exam());

    const successCount = results.filter(
      (result) => result.success
    ).length;

    return {
      success: true,
      message: `تم تنفيذ إنشاء امتحانات الدروس الأربعة. نجح ${successCount} من ${results.length}.`,
      results,
    };
  } catch (error) {
    console.error("Create all lesson exams error:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء امتحانات الدروس.",
      results: [],
    };
  }
}