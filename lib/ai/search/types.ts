export type AnswerMode =
  | "conversation"
  | "course"
  | "gemini_fallback";

export type RagAnswerMode =
  | "course"
  | "insufficient_course_context";

export type GeneratedAnswer = {
  answer: string;
  mode: AnswerMode;
  sourceIndexes: number[];
};

export type RagGeneratedAnswer = {
  answer: string;
  mode: RagAnswerMode;
  sourceIndexes: number[];
};

export type FallbackReason =
  | "no_relevant_chunks"
  | "insufficient_context"
  | "invalid_citations"
  | "rag_generation_failed"
  | "retrieval_failed";

export type RagChunk = {
  id: string;
  lessonId: string;
  title: string;
  content: string;
  chunkIndex: number;
  similarity: number;
};

export type AiSource = {
  id: string;
  lessonId: string;
  title: string;
  chunkIndex: number;
  similarity: number;
  reference: string;
  excerpt: string;
};

export type AiAnswerResponse = {
  answer: string;
  mode: AnswerMode;
  sources: AiSource[];
};