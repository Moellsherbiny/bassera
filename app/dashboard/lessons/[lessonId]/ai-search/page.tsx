
import { notFound } from "next/navigation";
import { getLessonData } from "@/actions/lessons/get-lesson-data";
import { AiChat } from "@/components/ai-search/ai-chat";

type PageProps = {
  params: Promise<{
    lessonId: string;
  }>;
};

export default async function LessonAiPage({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = await getLessonData(lessonId);
  if (!lesson) {
    notFound();
  }

  return (
    <AiChat
      lesson={{
        id: lesson.id,
        title: lesson.title,
        course:{
            id: lesson.course.id,
            title: lesson.course.title,
            description: lesson.course.description,
        }
      }}
    />
  );
}
