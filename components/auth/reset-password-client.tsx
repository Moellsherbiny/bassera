
"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { resetPassword } from "@/actions/auth/reset-password";

const resetPasswordSchema = z
  .object({
    code: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "رمز التحقق يجب أن يتكون من 6 أرقام."),

    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل."),

    confirmPassword: z.string().min(
      1,
      "يرجى تأكيد كلمة المرور.",
    ),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "كلمتا المرور غير متطابقتين.",
      path: ["confirmPassword"],
    },
  );

type ResetPasswordInput = z.infer<
  typeof resetPasswordSchema
>;

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (
    data: ResetPasswordInput,
  ) => {
    setServerError(null);

    if (!email) {
      setServerError(
        "رابط إعادة تعيين كلمة المرور غير صالح.",
      );
      return;
    }

    const result = await resetPassword({
      email,
      code: data.code,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    router.push("/login?reset=success");
  };

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
              d="M16.5 10.5V7.75a4.5 4.5 0 0 0-9 0v2.75"
            />
            <rect
              width="13.5"
              height="10.5"
              x="5.25"
              y="10.5"
              rx="2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14.25v2.25"
            />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          إعادة تعيين كلمة المرور
        </h1>

        <p className="mt-3 text-sm leading-6 text-default-500">
          أدخل رمز التحقق الذي أرسلناه إلى بريدك الإلكتروني،
          ثم أنشئ كلمة مرور جديدة.
        </p>

        {email && (
          <div
            dir="ltr"
            className="mt-4 rounded-xl bg-default-100 px-4 py-3 text-center text-sm font-medium text-default-700"
          >
            {email}
          </div>
        )}
      </div>

      {/* Form */}
      <Form
        className="flex w-full flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* OTP */}
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
            dir="ltr"
            className="text-center tracking-[0.35em]"
          />

          {errors.code && (
            <span className="text-sm text-danger">
              {errors.code.message}
            </span>
          )}
        </TextField>

        {/* New Password */}
        <TextField
          name="password"
          type="password"
          isRequired
          isInvalid={!!errors.password}
        >
          <Label>كلمة المرور الجديدة</Label>

          <Input
            {...register("password")}
            fullWidth
            placeholder="أدخل كلمة المرور الجديدة"
            autoComplete="new-password"
            dir="ltr"
          />

          {errors.password && (
            <span className="text-sm text-danger">
              {errors.password.message}
            </span>
          )}
        </TextField>

        {/* Confirm Password */}
        <TextField
          name="confirmPassword"
          type="password"
          isRequired
          isInvalid={!!errors.confirmPassword}
        >
          <Label>تأكيد كلمة المرور</Label>

          <Input
            {...register("confirmPassword")}
            fullWidth
            placeholder="أعد إدخال كلمة المرور"
            autoComplete="new-password"
            dir="ltr"
          />

          {errors.confirmPassword && (
            <span className="text-sm text-danger">
              {errors.confirmPassword.message}
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

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          fullWidth
          isDisabled={isSubmitting || !email}
          className="mt-2 font-semibold"
        >
          {isSubmitting
            ? "جاري تحديث كلمة المرور..."
            : "تحديث كلمة المرور"}
        </Button>
      </Form>

      {/* Back to Login */}
      <div className="mt-8 flex items-center justify-center gap-1 text-sm">
        <span className="text-default-500">
          تذكرت كلمة المرور؟
        </span>

        <NextLink
          href="/login"
          className="font-semibold text-primary transition-opacity hover:opacity-80"
        >
          تسجيل الدخول
        </NextLink>
      </div>

      {/* Request new code */}
      <div className="mt-4 text-center">
        <NextLink
          href={`/forgot-password${
            email
              ? `?email=${encodeURIComponent(email)}`
              : ""
          }`}
          className="text-sm font-medium text-default-500 transition-colors hover:text-primary"
        >
          طلب رمز جديد
        </NextLink>
      </div>
    </div>
  );
}
