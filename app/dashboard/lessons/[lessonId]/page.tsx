import { notFound, redirect } from "next/navigation";

import { getLesson } from "@/actions/lessons/get-lesson";
import { LessonClient } from "@/components/lessons/single-lesson-client";

type LessonPageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;

  const result = await getLesson(lessonId);

  if (!result.success) {
    if (result.error === "UNAUTHORIZED") {
      redirect("/login");
    }

    if (result.error === "LESSON_NOT_FOUND") {
      notFound();
    }

    if (result.error === "NOT_ENROLLED") {
      redirect("/dashboard");
    }

    if (result.error === "LESSON_LOCKED") {
      if (!result.data) {
        redirect("/dashboard/lessons");
      }

      return (
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <LessonClient locked lockedData={result.data} />
        </main>
      );
    }

    redirect("/dashboard");
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <LessonClient locked={false} data={result.data} />
    </main>
  );
}
