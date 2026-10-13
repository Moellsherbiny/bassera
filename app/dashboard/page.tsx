import { redirect } from "next/navigation";

import { getDashboardData } from "@/actions/dashboard/get-dashboard-data";
import DashboardClient from "@/components/dashboard/client";

export default async function DashboardPage() {
  const result = await getDashboardData();

  if (!result.success) {
    redirect("/login");
  }

  const { data } = result;

  return (
    <DashboardClient
      user={data.user}
      course={
        data.course
          ? {
              id: data.course.id,
              title: data.course.title,
              description:
                data.course.description,
              totalLessons:
                data.course.totalLessons,
              completedLessons:
                data.course.completedLessons,
              progress:
                data.course.progress,
              currentLesson:
                data.currentLesson
                  ? {
                      id:
                        data.currentLesson.id,
                      title:
                        data.currentLesson.title,
                      order:
                        data.currentLesson.order,
                    }
                  : null,
            }
          : null
      }
      stats={data.stats}
      latestAttempt={data.latestAttempt}
    />
  );
}