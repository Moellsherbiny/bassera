
import {
  retrieveRelevantChunks,
  generateRagAnswer,
} from "./rag.service";

import { generateFallback } from "./fallback.service";
import { isGreeting } from "./text-utils";

import type {
  AiAnswerResponse,
  FallbackReason,
  RagChunk,
} from "./types";

export async function answerQuestion(
  question: string,
  courseId: string | null,
  lessonId: string | null = null,
  lessonTitle: string | null = null,
  courseTitle: string | null = null,
): Promise<AiAnswerResponse> {
  // التحيات والمجاملات البسيطة لا تحتاج إلى RAG.
  if (isGreeting(question)) {
    return {
      answer:
        "وعليكم السلام ورحمة الله وبركاته! أهلاً بك في DLE Graph-AI. كيف أقدر أساعدك في دراستك اليوم؟",
      mode: "conversation",
      sources: [],
    };
  }

  let chunks: RagChunk[] = [];

  // المرحلة الأولى: البحث في الدرس الحالي أو المقرر.
  try {
    chunks = await retrieveRelevantChunks(
      question,
      courseId,
      lessonId,
      lessonTitle,
      courseTitle,
    );
  } catch (error) {
    console.error("RAG retrieval failed:", error);

    return generateFallbackResponse(
      question,
      "retrieval_failed",
      lessonTitle,
      courseTitle,
    );
  }

  // المرحلة الثانية: لا توجد مقاطع ذات صلة.
  if (chunks.length === 0) {
    return generateFallbackResponse(
      question,
      "no_relevant_chunks",
      lessonTitle,
      courseTitle,
    );
  }

  // المرحلة الثالثة: محاولة الإجابة اعتمادًا على المقاطع المسترجعة.
  try {
    const result = await generateRagAnswer(question, chunks);

    const sources = result.sourceIndexes.map((index) => {
      const chunk = chunks[index - 1];

      return {
        id: chunk.id,
        lessonId: chunk.lessonId,
        title: chunk.title,
        chunkIndex: chunk.chunkIndex,
        similarity: chunk.similarity,
        reference: `المصدر ${index}`,
        excerpt: chunk.content.slice(0, 300),
      };
    });

    return {
      answer: result.answer,
      mode: "course",
      sources,
    };
  } catch (error) {
    console.warn(
      "RAG could not provide a validated answer; switching to Gemini:",
      error,
    );

    const message =
      error instanceof Error ? error.message : "";

    const reason: FallbackReason =
      message === "RAG_INSUFFICIENT_CONTEXT"
        ? "insufficient_context"
        : message === "RAG_INVALID_CITATIONS"
          ? "invalid_citations"
          : "rag_generation_failed";

    return generateFallbackResponse(
      question,
      reason,
      lessonTitle,
      courseTitle,
      chunks,
    );
  }
}

async function generateFallbackResponse(
  question: string,
  reason: FallbackReason,
  lessonTitle: string | null = null,
  courseTitle: string | null = null,
  chunks: RagChunk[] = [],
): Promise<AiAnswerResponse> {
  const fallback = await generateFallback({
    question,
    reason,
    lessonTitle,
    courseTitle,
    ...(chunks.length > 0 ? { chunks } : {}),
  });

  return {
    answer: fallback.answer,
    mode: "gemini_fallback",
    sources: [],
  };
}
