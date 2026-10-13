
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { answerQuestion } from "@/lib/ai/search/answer.service";

export const runtime = "nodejs";

const MAX_QUESTION_LENGTH = 1000;

type LessonPayload = {
  id: string;
  title: string;
  course: {
    id: string;
    title: string;
    description?: string | null;
  };
};

type RequestBody = {
  question?: unknown;
  lesson?: unknown;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function isLessonPayload(value: unknown): value is LessonPayload {
  if (!value || typeof value !== "object") return false;

  const lesson = value as Record<string, unknown>;

  if (
    typeof lesson.id !== "string" ||
    !lesson.id.trim() ||
    typeof lesson.title !== "string" ||
    !lesson.course ||
    typeof lesson.course !== "object"
  ) {
    return false;
  }

  const course = lesson.course as Record<string, unknown>;

  return (
    typeof course.id === "string" &&
    course.id.trim().length > 0 &&
    typeof course.title === "string"
  );
}

export async function POST(request: NextRequest) {
  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return jsonError("صيغة JSON غير صحيحة.", 400);
  }

  if (
    typeof body.question !== "string" ||
    !body.question.trim()
  ) {
    return jsonError("يرجى إدخال السؤال.", 400);
  }

  const question = body.question.trim();

  if (question.length > MAX_QUESTION_LENGTH) {
    return jsonError(
      `يجب ألا يتجاوز السؤال ${MAX_QUESTION_LENGTH} حرف.`,
      400,
    );
  }

  if (!isLessonPayload(body.lesson)) {
    console.error("Invalid lesson payload:", body.lesson);
    return jsonError("بيانات الدرس غير صالحة.", 400);
  }

  const lessonId = body.lesson.id.trim();
  const courseId = body.lesson.course.id.trim();
  const lessonTitle = body.lesson.title.trim();
  const courseTitle = body.lesson.course.title.trim();
  try {
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        course: {
          select: { id: true },
        },
      },
    });

    if (!existingLesson) {
      return jsonError("الدرس غير موجود.", 404);
    }

    if (existingLesson.course.id !== courseId) {
      return jsonError(
        "الدرس لا يتبع المقرر المحدد.",
        400,
      );
    }

    console.log("[AI Search] Validated lesson:", {
      lessonId,
      courseId,
      question,
      lessonTitle,
      courseTitle,
    });

 
const result = await answerQuestion(
  question,
  courseId,
  lessonId,
  lessonTitle,
  courseTitle,
);

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI search pipeline failed:", error);

    return NextResponse.json(
      {
        error:
          "تعذر الحصول على إجابة حاليًا. حاول مرة أخرى لاحقًا.",
      },
      { status: 502 },
    );
  }
}
