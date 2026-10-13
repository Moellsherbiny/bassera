"use client";

import { Button } from "@heroui/react";
import { useState } from "react";
import { ContentVariantCard } from "../render-lesson/content-varient-card";
import { ArrowLeft, ArrowRight } from "@gravity-ui/icons";
import { LessonContentVariant } from "@/types/lessons";

/* Above this many pages, dots get crowded, so only the counter is shown. */
const MAX_DOTS = 10;

export function InfographicPagination({
  variants,
}: {
  variants: LessonContentVariant[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = variants.length;
  const currentVariant = variants[currentIndex];

  if (!currentVariant) return null;

  const currentPage = currentIndex + 1;
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < total - 1;

  return (
    <div dir="rtl" className="space-y-4">
      {/* The infographic already has its own card, so no wrapper here */}
      <ContentVariantCard
        key={currentVariant.id}
        variant={currentVariant}
        index={currentIndex}
      />

      {/* Controls: only when there is more than one infographic */}
      {total > 1 && (
        <nav
          aria-label="التنقل بين الإنفوجرافيك"
          className="flex items-center justify-between gap-3"
        >
          <Button
            type="button"
            variant="secondary"
            isDisabled={!canGoPrevious}
            onPress={() => setCurrentIndex((i) => i - 1)}
            className="font-semibold"
          >
            <ArrowRight className="size-4" />
            <span className="hidden sm:inline">السابق</span>
          </Button>

          <div className="flex items-center gap-3">
            {total <= MAX_DOTS && (
              <div className="hidden items-center sm:flex">
                {variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`الانتقال إلى الإنفوجرافيك ${index + 1}`}
                    aria-current={index === currentIndex ? "page" : undefined}
                    className="group flex h-6 items-center px-0.5 outline-none"
                  >
                    <span
                      className={`block h-2 rounded-full transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-focus ${
                        index === currentIndex
                          ? "w-7 bg-primary"
                          : "w-2 bg-default-300 group-hover:bg-default-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}

            <span
              aria-live="polite"
              className="text-sm font-semibold tabular-nums text-foreground/70"
            >
              {currentPage} / {total}
            </span>
          </div>

          <Button
            type="button"
            isDisabled={!canGoNext}
            onPress={() => setCurrentIndex((i) => i + 1)}
            className="font-semibold"
          >
            <span className="hidden sm:inline">التالي</span>
            <ArrowLeft className="size-4" />
          </Button>
        </nav>
      )}
    </div>
  );
}