import type { LessonContentVariant } from "@/types/lessons";

import InfographicRenderer from "../infographics/infographic-renderer";
import { InteractiveVariantData } from "./interactive-variant-data";
import { VideoVariantData } from "./video-varient";

export function VariantData({
  variant,
}: {
  variant: LessonContentVariant;
}) {
  if (variant.type === "INFOGRAPHIC") {
    return (
      <div className="w-full">
        <InfographicRenderer data={variant.data} />
      </div>
    );
  }

  if (variant.type === "VIDEO") {
    return <VideoVariantData data={variant.data} />;
  }

  if (variant.type === "INTERACTIVE") {
    if (!variant.interactiveType) {
      return (
        <p className="text-sm text-danger">
          نوع النشاط التفاعلي غير محدد.
        </p>
      );
    }

    return (
      <InteractiveVariantData
        type={variant.interactiveType}
        data={variant.data}
      />
    );
  }

  return (
    <p className="text-sm text-default-400">
      لا يوجد محتوى متاح لهذا الإصدار.
    </p>
  );
}