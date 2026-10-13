import type {
  LessonContentVariant,
  RecommendedRemediation,
} from "@/types/lessons";

type RemediationAttempt = {
  attemptNumber: number;
  score: number;
  passed: boolean;
  exam: {
    passingScore: number;
  };
};

type GetLessonRemediationParams = {
  latestAttempt: RemediationAttempt | null;
  contentVariants: LessonContentVariant[];
};

export function getLessonRemediation({
  latestAttempt,
  contentVariants,
}: GetLessonRemediationParams): RecommendedRemediation | null {
  // الطالب لم يدخل الاختبار بعد
  if (!latestAttempt) {
    return null;
  }

  // الطالب نجح بالفعل
  if (latestAttempt.passed) {
    return null;
  }

  // الطالب رسب → اعرض Interactive
  const remediationVariant = contentVariants.find(
    (variant) => variant.type === "INTERACTIVE",
  );

  // لا يوجد Interactive لهذا الدرس
  if (!remediationVariant) {
    return null;
  }

  return {
    variant: remediationVariant,
    reason: "LOW_SCORE",
    score: latestAttempt.score,
    attemptNumber: latestAttempt.attemptNumber,
  };
}