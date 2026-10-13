
"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
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

import { forgotPassword } from "@/actions/auth/forgot-password";

const forgotPasswordSchema = z.object({
  email: z
    .email("البريد الإلكتروني غير صحيح")
    .toLowerCase(),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null);

    const result = await forgotPassword(data);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    router.push(
      `/reset-password?email=${encodeURIComponent(data.email)}`,
    );
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
          نسيت كلمة المرور؟
        </h1>

        <p className="mt-3 text-sm leading-6 text-default-500">
          أدخل البريد الإلكتروني المرتبط بحسابك، وسنرسل لك
          رمز تحقق لإعادة تعيين كلمة المرور.
        </p>
      </div>

      {/* Form */}
      <Form
        className="flex w-full flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          name="email"
          type="email"
          isRequired
          isInvalid={!!errors.email}
        >
          <Label>البريد الإلكتروني</Label>

          <Input
            {...register("email")}
            fullWidth
            placeholder="example@email.com"
            autoComplete="email"
            inputMode="email"
            dir="ltr"
          />

          {errors.email && (
            <span className="text-sm text-danger">
              {errors.email.message}
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

        <Button
          type="submit"
          size="lg"
          fullWidth
          isDisabled={isSubmitting}
          className="font-semibold"
        >
          {isSubmitting
            ? "جاري إرسال الرمز..."
            : "إرسال رمز التحقق"}
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
    </div>
  );
}
