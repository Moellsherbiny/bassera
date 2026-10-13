"use client";

import { FormEvent, useState } from "react";
import { Button, Input } from "@heroui/react";
import { ArrowRight, GraduationCap } from "@gravity-ui/icons";

import { completeStudentProfile } from "@/actions/student/complete-profile";

type CompleteProfileClientProps = {
  user: {
    name: string | null;
    email: string;
    phone: string | null;
  };
};

export default function CompleteProfileClient({
  user,
}: CompleteProfileClientProps) {
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedPhone ) {
      setError("من فضلك أكمل جميع البيانات المطلوبة.");
      return;
    }

    setIsPending(true);

    try {
      const result = await completeStudentProfile({
        name: trimmedName,
        phone: trimmedPhone,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Complete profile error:", error);
      setError("حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-default-200 bg-background p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-foreground">
              أكمل بياناتك
            </h1>

            <p className="mt-2 text-sm leading-6 text-default-500">
              أكمل بياناتك الأساسية حتى تتمكن من البدء في استخدام المنصة.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                الاسم
              </label>

              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="اكتب اسمك بالكامل"
                autoComplete="name"
                disabled={isPending}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                البريد الإلكتروني
              </label>

              <Input
                id="email"
                value={user.email}
                readOnly
                disabled={isPending}
              />

              <p className="text-xs text-default-400">
                البريد الإلكتروني مرتبط بحساب Google ولا يمكن تغييره من هنا.
              </p>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                رقم الهاتف
              </label>

              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="مثال: 01012345678"
                autoComplete="tel"
                disabled={isPending}
              />
            </div>

           

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              isPending={isPending}
              className="mt-2 w-full"
            >
              {({ isPending }) => (
                <>
                  {!isPending && <ArrowRight className="h-4 w-4" />}
                  {isPending ? "جاري حفظ البيانات..." : "حفظ ومتابعة"}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}