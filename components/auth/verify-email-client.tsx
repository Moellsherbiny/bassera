
"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Label, TextField } from "@heroui/react";
import { z } from "zod";

import {
  verifyEmail,
  resendVerificationCode,
} from "@/actions/auth/verify-email";

const verifyEmailSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "أدخل رمز التحقق المكون من 6 أرقام"),
});

type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

const RESEND_COOLDOWN = 60;

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((value) => value - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (data: VerifyEmailInput) => {
    if (!email) {
      setServerError("البريد الإلكتروني غير موجود.");
      return;
    }

    setServerError(null);
    setSuccessMessage(null);

    const result = await verifyEmail({
      email,
      code: data.code,
    });

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    router.push("/login?verified=true");
  };

  const handleResend = async () => {
    if (!email || cooldown > 0 || resendLoading) return;

    setServerError(null);
    setSuccessMessage(null);
    setResendLoading(true);

    try {
      const result = await resendVerificationCode({ email });

      if (!result.success) {
        setServerError(result.error);
        return;
      }

      setSuccessMessage("تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني.");
      setCooldown(RESEND_COOLDOWN);
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="w-full text-center" dir="rtl">
        <div className="mb-6 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-danger/10 text-2xl">
            !
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          رابط غير صالح
        </h1>

        <p className="mt-3 text-sm leading-6 text-default-500">
          لم يتم تحديد البريد الإلكتروني المطلوب التحقق منه.
        </p>

        <Button
          
          
          fullWidth
          size="lg"
          className="mt-7 font-semibold"
        >
          <NextLink href="/register">

          العودة إلى إنشاء الحساب
          </NextLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full" dir="rtl">
      {/* Icon */}
      <div className="mb-6 flex">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <svg
            aria-hidden="true"
            className="size-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75m19.5 0-8.69 5.796a1.875 1.875 0 0 1-2.12 0L2.25 6.75"
            />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          تأكيد البريد الإلكتروني
        </h1>

        <p className="mt-3 text-sm leading-6 text-default-500">
          أرسلنا رمز تحقق مكونًا من 6 أرقام إلى:
        </p>

        <p
          className="mt-1 break-all text-sm font-semibold text-foreground"
          dir="ltr"
        >
          {email}
        </p>
      </div>

      {/* Form */}
      <Form
        className="flex w-full flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          name="code"
          type="text"
          isRequired
          isInvalid={!!errors.code}
        >
          <Label>رمز التحقق</Label>

          <Input
            {...register("code")}
            fullWidth
            placeholder="000000"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className="text-center text-xl font-semibold tracking-[0.35em]"
            dir="ltr"
          />

          {errors.code && (
            <span className="text-sm text-danger">
              {errors.code.message}
            </span>
          )}
        </TextField>

        {/* Server Error */}
        {serverError && (
          <div
            role="alert"
            className="w-full rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {serverError}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div
            role="status"
            className="w-full rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success"
          >
            {successMessage}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          isDisabled={isSubmitting}
          className="font-semibold"
        >
          {isSubmitting ? "جاري التحقق..." : "تأكيد البريد الإلكتروني"}
        </Button>
      </Form>

      {/* Resend */}
      <div className="mt-7 text-center">
        <p className="text-sm text-default-500">
          لم يصلك الرمز؟
        </p>

        <Button
          variant="tertiary"
          isDisabled={cooldown > 0 || resendLoading}
          onPress={handleResend}
          className="mt-1 font-semibold"
        >
          {resendLoading
            ? "جاري إعادة الإرسال..."
            : cooldown > 0
              ? `إعادة الإرسال بعد ${cooldown} ثانية`
              : "إعادة إرسال الرمز"}
        </Button>
      </div>

      {/* Back */}
      <div className="mt-5 text-center">
        <NextLink
          href="/register"
          className="text-sm font-medium text-default-500 transition-colors hover:text-foreground"
        >
          العودة إلى إنشاء الحساب
        </NextLink>
      </div>
    </div>
  );
}
