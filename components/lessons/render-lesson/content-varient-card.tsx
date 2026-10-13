import { Play, Sparkles } from "@gravity-ui/icons";
import { Card } from "@heroui/react";

import { LessonContentVariant } from "@/types/lessons";

import { getVariantDescription } from "./varient-description";
import { VariantData } from "./varient-data";

export function getVariantLabel(
  variant: LessonContentVariant,
) {
  if (variant.type === "INFOGRAPHIC") {
    return "إنفوجرافيك";
  }

  if (variant.isSimplified) {
    return "شرح مبسط";
  }

  if (variant.isSplitIntoParts) {
    return "مقسم إلى أجزاء";
  }

  if (!variant.hasGraphics) {
    return "شرح نصي";
  }

  switch (variant.type) {
    case "VIDEO":
      return "فيديو تفاعلي";

    case "INTERACTIVE":
      return "محتوى تفاعلي";

    default:
      return "محتوى بصري";
  }
}

export function ContentVariantCard({
  variant,
  index,
}: {
  variant: LessonContentVariant;
  index?: number;
}) {
  const variantLabel = getVariantLabel(variant);

  return (
    <Card
      className={
        variant.type === "INFOGRAPHIC"
          ? "overflow-hidden border-default-200"
          : ""
      }
    >
      <Card.Header>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {index !== undefined && (
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  المحتوى {index + 1}
                </span>
              )}

              <span className="rounded-md bg-default-100 px-2 py-1 text-xs font-semibold text-default-600">
                {variantLabel}
              </span>

              {variant.generatedByAI && (
                <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-2 py-1 text-xs font-medium text-violet-600">
                  <Sparkles className="size-3.5" />
                  AI
                </span>
              )}
            </div>

            <Card.Title className="mt-3">
              {variant.type === "INFOGRAPHIC"
                ? "الشرح البصري"
                : variant.type === "INTERACTIVE"
                  ? "النشاط التفاعلي"
                  : "طريقة عرض المحتوى"}
            </Card.Title>

            <Card.Description>
              {getVariantDescription(variant)}
            </Card.Description>
          </div>

          {variant.type === "VIDEO" && (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Play className="size-5" />
            </div>
          )}
        </div>
      </Card.Header>

      <div
        className={
          variant.type === "INFOGRAPHIC"
            ? "px-2 pb-2 sm:px-4 sm:pb-4"
            : "px-4 pb-5 sm:px-6"
        }
      >
        <VariantData variant={variant} />
      </div>
    </Card>
  );
}