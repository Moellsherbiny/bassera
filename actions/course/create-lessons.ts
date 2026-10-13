
"use server";

import { prisma } from "@/lib/prisma";

const COURSE_ID = "cmf7x2k9n0001qz8r4v6t3p5a";

const lessons = [
  {
    title: "أبعاد نظم ميكنة الأعمال المكتبية",
    order: 1,
  },
  {
    title: "نظم معالجة الكلمات",
    order: 2,
  },
  {
    title: "نظم النشر المكتبي",
    order: 3,
  },
  {
    title: "التعبير البياني عن المعلومات المالية والإحصائية",
    order: 4,
  },
];

export async function createCourseLessons() {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: COURSE_ID,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!course) {
      return {
        success: false,
        message: "الدورة التعليمية غير موجودة.",
      };
    }

    const createdLessons = [];

    for (const lesson of lessons) {
      const createdLesson = await prisma.lesson.upsert({
        where: {
          courseId_order: {
            courseId: COURSE_ID,
            order: lesson.order,
          },
        },
        create: {
          courseId: COURSE_ID,
          title: lesson.title,
          order: lesson.order,
          sourceContent: "",
        },
        update: {
          title: lesson.title,
        },
        select: {
          id: true,
          title: true,
          order: true,
          courseId: true,
        },
      });

      createdLessons.push(createdLesson);
    }

    console.log("====================================");
    console.log("📚 COURSE LESSONS");
    console.log("====================================");
    console.dir(createdLessons, {
      depth: null,
    });
    console.log("====================================");

    return {
      success: true,
      message: "تم إنشاء الدروس الأربعة بنجاح.",
      lessons: createdLessons,
    };
  } catch (error) {
    console.error("Create course lessons error:", error);

    return {
      success: false,
      message: "حدث خطأ أثناء إنشاء الدروس.",
    };
  }
}
