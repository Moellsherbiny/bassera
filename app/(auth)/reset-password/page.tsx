
import { Suspense } from "react";
import ResetPasswordClient from "@/components/auth/reset-password-client";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          dir="rtl"
          className="flex min-h-64 items-center justify-center text-sm text-default-500"
        >
          جاري تحميل صفحة إعادة تعيين كلمة المرور...
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
