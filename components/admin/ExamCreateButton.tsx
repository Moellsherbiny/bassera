"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Plus } from "@gravity-ui/icons";

import { createAllLessonExams } from "@/actions/exam/seed-all-lesson-exams";

export default function ExamCreateButton() {
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    try {
      setLoading(true);

      const result = await createAllLessonExams();

      if (!result.success) {
        console.error(result.message);
        return;
      }

      console.log(result);
    } catch (error) {
      console.error("Create exams error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="primary"
      size="lg"
      isPending={loading}
      onPress={handleCreate}
    >
      <Plus className="size-5" />
      {loading ? "جاري إنشاء الامتحانات..." : "Create Exams"}
    </Button>
  );
}