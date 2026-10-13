import Link from "next/link";
import { ArrowLeft, GraduationCap } from "@gravity-ui/icons";
import {
  Button,
  Card,
  Link as HeroLink,
  Label,
  ProgressBar,
  Separator,
} from "@heroui/react";

type CurrentLearningCardProps = {
  course: {
    id: string;
    title: string;
    description: string | null;
    totalLessons: number;
    completedLessons: number;
    progress: number;

    currentLesson: {
      id: string;
      title: string;
      order: number;
    } | null;
  } | null;

  progressLabel: string;
};

export function CurrentLearningCard({
  course,
  progressLabel,
}: CurrentLearningCardProps) {
  /* =========================================================
     Empty State
  ========================================================= */

  if (!course) {
    return (
      <Card className="w-full">
        <GraduationCap
          aria-label="الدورة التعليمية"
          className="size-6 text-default-400"
          role="img"
        />

        <Card.Header>
          <Card.Title>لا توجد دورة تعليمية مرتبطة بحسابك</Card.Title>

          <Card.Description>
            لم يتم تسجيلك في دورة تعليمية حتى الآن.
          </Card.Description>
        </Card.Header>
      </Card>
    );
  }

  /* =========================================================
     Completed State
  ========================================================= */

  if (!course.currentLesson) {
    return (
      <Card className="w-full">
        <div className="flex size-10 items-center justify-center rounded-xl bg-success/10 text-success">
          <GraduationCap className="size-5" />
        </div>

        <Card.Header>
          <Card.Title>أحسنت، أنهيت رحلتك التعليمية</Card.Title>

          <Card.Description>
            لقد أكملت جميع دروس الدورة التعليمية. يمكنك الآن مراجعة أدائك
            والاستعداد للمرحلة التالية.
          </Card.Description>
        </Card.Header>

        <Card.Footer>
          <HeroLink href="/dashboard/lessons" aria-label="مراجعة الدروس">
            مراجعة الدروس
            <HeroLink.Icon aria-hidden="true" />
          </HeroLink>
        </Card.Footer>
      </Card>
    );
  }

  /* =========================================================
     Active Learning State
  ========================================================= */

  return (
    <Card className="relative w-full overflow-hidden">
      <Card.Header>
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
            الخطوة التالية
          </span>

          <span className="text-xs text-default-400 underline underline-offset-8 decoration-dashed decoration-text-primary">
            بناءً على تقدمك الحالي
          </span>
        </div>

        <Card.Title className="text-2xl sm:text-3xl">
          {course.currentLesson.title}
        </Card.Title>

        <Card.Description className="mt-2 max-w-2xl leading-7">
          {course.description ||
            "تابع الدرس الحالي واستكشف المحتوى التعليمي بطريقة تناسب مستوى تعلمك."}
        </Card.Description>
      </Card.Header>

      {/* Lesson Meta */}

      <div className="px-4 pb-2 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-default-500">
          <span className="rounded-md bg-default-100 px-2.5 py-1">
            الدرس {course.currentLesson.order}
          </span>

          <span className="text-default-300">•</span>

          <span>{progressLabel}</span>
        </div>
      </div>

      {/* Progress */}

      <div className="px-4 py-4 sm:px-6 ">
        <ProgressBar
          aria-label="نسبة إكمال الدورة"
          value={course.progress}
          className="w-full"
        >
          <div className="mb-2 flex items-center justify-between ">
            <Label className="text-xs font-bold text-default-500">
              تقدم الدورة
            </Label>

            <ProgressBar.Output className="text-sm font-bold text-primary" />
          </div>

          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>
        <div className="mt-2 flex items-center gap-4 text-[11px] text-default-400">
          <span className="text-muted font-medium">{course.completedLessons} درس مكتمل</span>
        <Separator orientation="vertical" />
          <span className="text-text-primary font-bold">{course.totalLessons} إجمالي الدروس</span>
        </div>
      </div>

      {/* Footer */}

      <Card.Footer className="gap-4">
        <Button size="md" className="font-semibold">
          <Link
            href={`/dashboard/lessons/${course.currentLesson.id}`}
            className="w-full flex justify-between items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            متابعة الدرس
          </Link>
        </Button>

        <HeroLink href="/dashboard/lessons" aria-label="عرض جميع الدروس">
          كل الدروس
          <HeroLink.Icon aria-hidden="true" />
        </HeroLink>
      </Card.Footer>
    </Card>
  );
}
