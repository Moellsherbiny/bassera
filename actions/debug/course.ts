"use server";

import { prisma } from "@/lib/prisma";

export async function logCourse() {
  const courses = await prisma.course.findMany({
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          lessons: true,
          enrollments: true,
          exams: true,
        },
      },
    },
  });

  console.log("====================================");
  console.log("📚 COURSES");
  console.log("====================================");
  console.dir(courses, {
    depth: null,
  });
  console.log("====================================");

  return courses;
}