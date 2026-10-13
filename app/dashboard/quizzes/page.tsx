
import { redirect } from "next/navigation";

import { getQuizzesAction } from "@/actions/exam/get-quizzes";

import { QuizzesClient } from "@/components/quizzes/quizzes-client";

export default async function QuizzesPage() {
  const response = await getQuizzesAction();

  if (!response.success) {
    if (response.error === "UNAUTHORIZED") {
      redirect("/login");
    }

    return (
      <main
        dir="rtl"
        className="min-h-[calc(100vh-4rem)] bg-background px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
            <h1 className="text-xl font-bold">
              تعذر تحميل نتائج الاختبارات
            </h1>

            <p className="mt-2 text-sm leading-6 text-foreground/60">
              {response.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <QuizzesClient
      quizzes={response.quizzes}
    />
  );
}
