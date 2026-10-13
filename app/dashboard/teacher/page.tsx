import ExamResetButton from "@/components/admin/exam-reset-button";
import ExamCreateButton from "@/components/admin/ExamCreateButton";

export default async function DashboardPage() {
  // هنا قراءة البيانات فقط
  // ممنوع resetAllLessonExams() هنا

  return (
    <div className="space-y-6">
      {/* باقي الـ Dashboard */}

      <ExamResetButton />
      <ExamCreateButton />
    </div>
  );
}