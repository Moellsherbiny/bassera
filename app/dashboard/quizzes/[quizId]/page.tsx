
import { notFound, redirect } from "next/navigation";

import { getQuizAction } from "@/actions/exam/get-quiz";
import SingleQuizClient from "@/components/quizzes/single-quiz-client";

type QuizPageProps = {
  params: Promise<{
    quizId: string;
  }>;
};

export default async function QuizPage({
  params,
}: QuizPageProps) {
  const { quizId } = await params;

  const response = await getQuizAction(quizId);

  /*
   * Handle errors
   */
  if (!response.success) {
    if (response.error === "UNAUTHORIZED") {
      redirect("/login");
    }

    notFound();
  }

  /*
   * At this point TypeScript knows that:
   *
   * response.quiz   -> QuizData
   * response.attempt -> QuizAttempt
   */
  return (
    <SingleQuizClient
      quiz={response.quiz}
      attempt={response.attempt}
    />
  );
}
