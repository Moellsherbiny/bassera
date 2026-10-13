"use client";

import { useState } from "react";
import {
  Button,
  Card,

} from "@heroui/react";
import {
  TrashBin,
  ArrowRotateRight,
  CircleCheck,
  CircleExclamation,
} from "@gravity-ui/icons";

import { resetAllLessonExams } from "@/actions/exam/reset-all-lesson-exams";

type StepStatus = "pending" | "loading" | "success" | "error";

type Step = {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
};

const initialSteps: Step[] = [
  {
    id: 1,
    title: "حذف البيانات الحالية",
    description:
      "حذف الامتحانات والأسئلة والاختيارات والمحاولات والإجابات",
    status: "pending",
  },
  {
    id: 2,
    title: "إنشاء امتحان الدرس الأول",
    description: "20 سؤال",
    status: "pending",
  },
  {
    id: 3,
    title: "إنشاء امتحان الدرس الثاني",
    description: "20 سؤال",
    status: "pending",
  },
  {
    id: 4,
    title: "إنشاء امتحان الدرس الثالث",
    description: "20 سؤال",
    status: "pending",
  },
  {
    id: 5,
    title: "إنشاء امتحان الدرس الرابع",
    description: "20 سؤال",
    status: "pending",
  },
];

export default function ExamResetButton() {
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  function updateStep(
    id: number,
    status: StepStatus,
  ) {
    setSteps((current) =>
      current.map((step) =>
        step.id === id
          ? {
              ...step,
              status,
            }
          : step,
      ),
    );
  }

  async function handleReset() {
    if (loading) return;

    setLoading(true);
    setResult(null);
    setSteps(initialSteps);

    try {
      // --------------------------------
      // Step 1
      // --------------------------------

      updateStep(1, "loading");

      const promise = resetAllLessonExams();

      // مجرد simulation بصري
      await new Promise((resolve) =>
        setTimeout(resolve, 700),
      );

      updateStep(1, "success");

      // --------------------------------
      // Step 2
      // --------------------------------

      updateStep(2, "loading");

      await new Promise((resolve) =>
        setTimeout(resolve, 600),
      );

      updateStep(2, "success");

      // --------------------------------
      // Step 3
      // --------------------------------

      updateStep(3, "loading");

      await new Promise((resolve) =>
        setTimeout(resolve, 600),
      );

      updateStep(3, "success");

      // --------------------------------
      // Step 4
      // --------------------------------

      updateStep(4, "loading");

      await new Promise((resolve) =>
        setTimeout(resolve, 600),
      );

      updateStep(4, "success");

      // --------------------------------
      // Step 5
      // --------------------------------

      updateStep(5, "loading");

      const response = await promise;

      if (!response.success) {
        throw new Error(response.message);
      }

      updateStep(5, "success");

      setResult({
        success: true,
        message: response.message,
      });
    } catch (error) {
      console.error(error);

      setResult({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "حدث خطأ غير متوقع.",
      });

      setSteps((current) =>
        current.map((step) =>
          step.status === "loading"
            ? {
                ...step,
                status: "error",
              }
            : step,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
<Card className="w-full max-w-2xl">
  <Card.Header className="flex items-center justify-between gap-4">
    <div>
      <Card.Title className="text-xl font-bold">
        إدارة امتحانات الدروس
      </Card.Title>

      <Card.Description>
        حذف الامتحانات الحالية وإعادة إنشائها
      </Card.Description>
    </div>

    <ArrowRotateRight className="size-5 text-default-400" />
  </Card.Header>

  <Card.Content className="gap-6">
    {/* Button */}
    <Button
      
      variant="danger"
      size="lg"
      isDisabled={loading}
      onPress={handleReset}
     
    >
       
      {loading
          ? 
       <>
          <CircleCheck className="size-5 animate-spin" />
          "جاري إعادة إنشاء الامتحانات..."
       </>
        
        :
        <>
          <TrashBin className="size-5" />
          "Delete & Create Exams"
        </>
        
        }
    </Button>

    {/* Steps */}
    <div className="space-y-3">
      {steps.map((step) => (
        <div
          key={step.id}
          className="flex items-center gap-4 rounded-xl border border-default-200 p-4"
        >
          <div className="shrink-0">
            {step.status === "pending" && (
              <div className="flex size-9 items-center justify-center rounded-full bg-default-100">
                <span className="text-sm font-semibold text-default-500">
                  {step.id}
                </span>
              </div>
            )}

            {step.status === "loading" && (
              <div className="flex size-9 items-center justify-center rounded-full bg-warning-100">
                <CircleCheck className="size-5 animate-spin text-warning-600" />
              </div>
            )}

            {step.status === "success" && (
              <div className="flex size-9 items-center justify-center rounded-full bg-success-100">
                <CircleCheck className="size-5 text-success-600" />
              </div>
            )}

            {step.status === "error" && (
              <div className="flex size-9 items-center justify-center rounded-full bg-danger-100">
                <CircleExclamation className="size-5 text-danger-600" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-medium">
              {step.title}
            </p>

            <p className="text-sm text-default-500">
              {step.description}
            </p>
          </div>

          <div className="shrink-0 text-sm">
            {step.status === "pending" && (
              <span className="text-default-400">
                انتظار
              </span>
            )}

            {step.status === "loading" && (
              <span className="text-warning-600">
                جاري...
              </span>
            )}

            {step.status === "success" && (
              <span className="text-success-600">
                تم
              </span>
            )}

            {step.status === "error" && (
              <span className="text-danger-600">
                خطأ
              </span>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Result */}
    {result && (
      <div
        className={[
          "rounded-xl border p-4",
          result.success
            ? "border-success-200 bg-success-50"
            : "border-danger-200 bg-danger-50",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          {result.success ? (
            <CircleCheck className="size-5 text-success-600" />
          ) : (
            <CircleExclamation className="size-5 text-danger-600" />
          )}

          <p
            className={
              result.success
                ? "text-success-700"
                : "text-danger-700"
            }
          >
            {result.message}
          </p>
        </div>
      </div>
    )}
  </Card.Content>
</Card>
  );
}