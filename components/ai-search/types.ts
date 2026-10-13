export type AnswerMode =
  | "conversation"
  | "course"
  | "gemini_fallback"
  | "insufficient_course_context";

export type AiSource = {
  id: string;
  lessonId: string;
  title: string;
  chunkIndex: number;
  similarity: number;
  reference: string;
  excerpt: string;
};

export type AiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: AnswerMode;
  sources?: AiSource[];
};