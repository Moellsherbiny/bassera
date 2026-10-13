
import { Suspense } from "react";
import VerifyEmailClient from "@/components/auth/verify-email-client";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div
          dir="rtl"
          className="flex min-h-64 items-center justify-center text-sm text-default-500"
        >
          جاري تحميل صفحة تأكيد البريد الإلكتروني...
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}
