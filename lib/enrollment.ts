
import { prisma } from "@/lib/prisma";

export async function enrollStudentInCourse(studentId: string) {
  
  const course = await prisma.course.findFirst({
    select: {
      id: true,
    },
  });

  if (!course) {
    throw new Error("لا توجد دورة تعليمية في النظام.");
  }

  // يمنع التكرار بسبب @@unique([studentId, courseId])
  const enrollment = await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId,
        courseId: course.id,
      },
    },
    create: {
      studentId,
      courseId: course.id,
    },
    update: {},
    select: {
      id: true,
      studentId: true,
      courseId: true,
    },
  });

  return enrollment;
}
