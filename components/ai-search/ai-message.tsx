"use client";

import { Check, Copy, Sparkles } from "lucide-react";
import { Button } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import type { AiMessage as AiMessageType } from "./types";
import { AiSources } from "./ai-sources";

type AiMessageProps = {
  message: AiMessageType;
};

export function AiMessage({ message }: AiMessageProps) {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable in the current environment.
    }
  }

  if (!isAssistant) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[90%] rounded-2xl rounded-tr-md border border-default bg-surface-secondary px-4 py-3 md:max-w-[75%]">
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="min-w-0">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Sparkles size={16} />
        </div>

        <span className="text-sm font-semibold text-foreground">
          DLE Graph-AI
        </span>
      </div>

      <div
        dir="rtl"
        className="text-sm leading-8 text-foreground
          [&_p]:mb-4
          [&_p:last-child]:mb-0
          [&_h1]:mb-3
          [&_h1]:mt-6
          [&_h1]:text-xl
          [&_h1]:font-bold
          [&_h2]:mb-3
          [&_h2]:mt-6
          [&_h2]:text-lg
          [&_h2]:font-semibold
          [&_h3]:mb-2
          [&_h3]:mt-5
          [&_h3]:font-semibold
          [&_ul]:my-3
          [&_ul]:list-disc
          [&_ul]:space-y-1
          [&_ul]:pr-6
          [&_ol]:my-3
          [&_ol]:list-decimal
          [&_ol]:space-y-1
          [&_ol]:pr-6
          [&_li]:ps-1
          [&_strong]:font-semibold
          [&_blockquote]:my-4
          [&_blockquote]:border-r-2
          [&_blockquote]:border-default
          [&_blockquote]:pr-4
          [&_blockquote]:text-default-600
          [&_pre]:my-4
          [&_pre]:overflow-x-auto
          [&_pre]:rounded-xl
          [&_pre]:bg-surface-secondary
          [&_pre]:p-4
          [&_code]:rounded
          [&_code]:bg-surface-secondary
          [&_code]:px-1
          [&_code]:text-sm
          [&_pre_code]:bg-transparent
          [&_pre_code]:p-0
          [&_a]:underline
          [&_a]:underline-offset-4"
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>

      <AiSources sources={message.sources ?? []} />

      <div className="mt-3 flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onPress={copyAnswer}
          aria-label="نسخ الإجابة"
          className="text-default-500"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? "تم النسخ" : "نسخ الإجابة"}</span>
        </Button>
      </div>
    </article>
  );
}
