"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@heroui/react";

import { AiChatHeader } from "./ai-chat-header";
import { AiChatWelcome } from "./ai-chat-welcome";
import { AiChatComposer } from "./ai-chat-composer";
import { AiMessage } from "./ai-message";

import type { AiMessage as AiMessageType, AiSource, AnswerMode } from "./types";

type AiChatLesson = {
  id: string;
  title: string;
  course: {
    id: string;
    title: string;
    description?: string | null;
  };
};

type AiChatProps = {
  lesson: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
      description?: string | null;
    };
  };
};

type AiApiResponse = {
  answer?: string;
  mode?: AnswerMode;
  sources?: AiSource[];
  error?: string;
};

export function AiChat({ lesson }: AiChatProps) {
  const [messages, setMessages] = useState<AiMessageType[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryQuestion, setRetryQuestion] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading, error]);

  const sendMessage = useCallback(
    async (text: string, options?: { retry?: boolean }) => {
      const question = text.trim();

      if (!question || loading) return;

      if (!options?.retry) {
        const userMessage: AiMessageType = {
          id: crypto.randomUUID(),
          role: "user",
          content: question,
        };

        setMessages((current) => [...current, userMessage]);
      }

      setInput("");
      setError(null);
      setRetryQuestion(null);
      setLoading(true);

      try {
        const response = await fetch("/api/ai-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            lesson: {
              id: lesson.id,
              title: lesson.title,
              course: {
                id: lesson.course.id,
                title: lesson.course.title,
                description: lesson.course.description,
              },
            },
          }),
        });

        const data = (await response.json()) as AiApiResponse;

        if (!response.ok) {
          throw new Error(
            data.error || "تعذر الحصول على الإجابة. حاول مرة أخرى.",
          );
        }

        if (typeof data.answer !== "string" || !data.answer.trim()) {
          throw new Error("لم تصل إجابة صالحة من المساعد.");
        }

        const assistantMessage: AiMessageType = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer,
          mode: data.mode,
          sources: data.sources ?? [],
        };

        setMessages((current) => [...current, assistantMessage]);
      } catch (err) {
        setRetryQuestion(question);

        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ غير متوقع. حاول مرة أخرى.",
        );
      } finally {
        setLoading(false);
      }
    },
    [lesson.id, lesson.course.id, loading],
  );

  function resetConversation() {
    if (loading) return;

    setMessages([]);
    setInput("");
    setError(null);
    setRetryQuestion(null);
  }

  return (
    <section
      dir="rtl"
      aria-label={`المساعد الذكي لدرس ${lesson.title}`}
      className="flex h-full min-h-[620px] flex-col overflow-hidden rounded-2xl border border-default bg-background"
    >
      <AiChatHeader courseName={lesson.course.title} />

      {messages.length === 0 ? (
        <AiChatWelcome onSelect={(prompt) => void sendMessage(prompt)} />
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-8 md:px-8">
            {messages.map((message) => (
              <AiMessage key={message.id} message={message} />
            ))}

            {loading && (
              <div role="status" className="flex items-center gap-3 py-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <span className="size-2 animate-pulse rounded-full bg-current" />
                </div>

                <div className="flex items-center gap-2 text-sm text-default-500">
                  <span>جاري إعداد الإجابة</span>
                  <span className="flex gap-1">
                    <span className="size-1 animate-bounce rounded-full bg-current" />
                    <span className="size-1 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
                    <span className="size-1 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/5 p-4"
              >
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-danger"
                />

                <div className="flex-1">
                  <p className="text-sm text-foreground">{error}</p>

                  {retryQuestion && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onPress={() =>
                        void sendMessage(retryQuestion, { retry: true })
                      }
                      className="mt-2"
                    >
                      <RotateCcw size={14} />
                      إعادة المحاولة
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      )}

      <div className="shrink-0 border-t border-default bg-background/95 px-4 py-4 md:px-6">
        <div className="mx-auto w-full max-w-3xl">
          {messages.length > 0 && !loading && (
            <div className="mb-2 flex justify-start">
              <Button
                size="sm"
                variant="ghost"
                onPress={resetConversation}
                className="text-default-500"
              >
                <RotateCcw size={14} />
                محادثة جديدة
              </Button>
            </div>
          )}

          <AiChatComposer
            value={input}
            loading={loading}
            onChange={setInput}
            onSubmit={() => void sendMessage(input)}
          />

          <p className="mt-2 text-center text-[11px] text-default-400">
            اسأل عن محتوى الدرس الحالي، وراجع المصادر المرفقة عند توفرها.
          </p>
        </div>
      </div>
    </section>
  );
}
