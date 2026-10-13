"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  FileText,
  Library,
} from "lucide-react";
import type { AiSource } from "./types";

type AiSourcesProps = {
  sources: AiSource[];
};

export function AiSources({ sources }: AiSourcesProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!sources.length) return null;

  return (
    <section className="mt-6 border-t border-default pt-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Library size={17} className="text-default-500" />

          <h3 className="text-sm font-semibold text-foreground">
            المصادر المستخدمة
          </h3>
        </div>

        <span className="rounded-full bg-surface-secondary px-2.5 py-1 text-xs text-default-500">
          {sources.length} {sources.length === 1 ? "مصدر" : "مصادر"}
        </span>
      </div>

      <div className="grid gap-2">
        {sources.map((source, index) => {
          const isExpanded = expanded === source.id;

          return (
            <div
              key={`${source.id}-${source.chunkIndex}`}
              className="overflow-hidden rounded-xl border border-default bg-surface transition-colors"
            >
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() =>
                  setExpanded(isExpanded ? null : source.id)
                }
                className="flex w-full items-center gap-3 p-3 text-start hover:bg-surface-secondary"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-secondary">
                  <FileText
                    size={18}
                    className="text-default-500"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-default-500">
                    {source.reference || `المصدر ${index + 1}`}
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-foreground">
                    {source.title}
                  </p>
                </div>

                <ChevronDown
                  size={17}
                  className={`shrink-0 text-default-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="border-t border-default px-4 py-3">
                  <div className="mb-2 flex items-center gap-2 text-xs text-default-500">
                    <BookOpen size={14} />
                    مقتطف من محتوى الدرس
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-default-600">
                    {source.excerpt}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}