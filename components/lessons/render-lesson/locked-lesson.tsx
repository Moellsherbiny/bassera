import { ArrowRight } from "@gravity-ui/icons";
import { Button, Card } from "@heroui/react";
import Link from "next/link";
import { LessonStatusBadge } from "./lesson-status-badge";
import {Lock} from "@gravity-ui/icons"
import { LockedLessonData } from "@/types/lessons";
export function LockedLesson({ data }: { data: LockedLessonData }) {
  const previousLesson = data.previousLesson;

  return (
    <div dir="rtl" className="flex min-h-[70vh] items-center justify-center">
      {" "}
      <Card className="w-full max-w-2xl overflow-hidden border-default-200">
        {" "}
        <div className="flex flex-col items-center p-8 text-center sm:p-12">
          {" "}
          <div className="flex size-16 items-center justify-center rounded-2xl bg-default-100 text-default-500">
            {" "}
            <Lock className="size-7" />{" "}
          </div>
          <span className="mt-5 rounded-md bg-default-100 px-2.5 py-1 text-xs font-semibold text-default-500">
            الدرس {data.lesson.order}
          </span>
          <h1 className="mt-4 text-2xl font-bold">{data.lesson.title}</h1>
          <p className="mt-3 max-w-lg text-sm leading-7 text-default-500">
            هذا الدرس غير متاح لك حاليًا. يجب اجتياز الدرس السابق أولًا حتى
            تتمكن من المتابعة في المسار التعليمي.
          </p>
          {previousLesson.id && (
            <div className="mt-6 w-full rounded-xl border border-default-200 bg-default-50 p-4 text-right">
              <p className="text-xs text-default-400">يجب إكمال الدرس السابق</p>

              <div className="mt-2 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">
                    {previousLesson.title}
                  </p>

                  <p className="mt-1 text-xs text-default-500">
                    أفضل نتيجة: {previousLesson.bestScore}%
                  </p>
                </div>

                <LessonStatusBadge status={previousLesson.status} />
              </div>
            </div>
          )}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {previousLesson.id ? (
              <Button size="md" className="font-semibold">
                <Link href={`/dashboard/lessons/${previousLesson.id}`} className="flex items-center gap-2">
                  العودة للدرس السابق
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button size="md" className="font-semibold">
                <Link href="/dashboard/lessons" className="flex items-center gap-2">
                  العودة للدروس
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}

            <Button variant="secondary" size="md">
              <Link href="/dashboard">لوحة التحكم</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

