import { LessonContentVariant } from "@/types/lessons";

export function getVariantDescription(variant: LessonContentVariant) {
  if (variant.type === "INFOGRAPHIC") {
    return "عرض بصري منظم لمحتوى الدرس باستخدام الإنفوجرافيك.";
  }

  if (variant.isSimplified) {
    return "نسخة مبسطة من محتوى الدرس.";
  }

  if (variant.isSplitIntoParts) {
    return "المحتوى مقسم إلى أجزاء لتسهيل التعلم.";
  }

  if (variant.type === "VIDEO") {
    return "عرض المحتوى من خلال فيديو.";
  }

  if (variant.type === "INTERACTIVE") {
    return "محتوى تفاعلي يساعد على فهم الدرس.";
  }

  if (variant.hasGraphics) {
    return "عرض بصري للمحتوى باستخدام الرسومات والإنفوجرافيك.";
  }

  return "عرض المحتوى بطريقة نصية.";
}
