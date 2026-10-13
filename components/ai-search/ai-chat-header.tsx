"use client";

import { BookOpen, Sparkles } from "lucide-react";

type AiChatHeaderProps = {
  courseName?: string;
};

export function AiChatHeader({
  courseName = "المساعد التعليمي",
}: AiChatHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-default px-5 py-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Sparkles size={21} />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-foreground">
            {courseName}
          </h1>

          <p className="mt-1 flex items-center gap-1.5 text-xs text-default-500">
            <BookOpen size={13} />
            مساحة تعليمية ذكية
          </p>
        </div>
      </div>
    </header>
  );
}