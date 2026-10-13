
"use client";

import { useState } from "react";
import {
  Button,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  type RegisterInput,
} from "@/schemas/auth";
import { createAccount } from "@/actions/auth/register";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);

    const result = await createAccount(data);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    router.push(
      `/verify-email?email=${encodeURIComponent(data.email)}`,
    );
  };

  return (
    <div className="w-full" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          إنشاء حساب
        </h1>

        <p className="mt-2 text-sm leading-6 text-default-500">
          أنشئ حسابك وابدأ رحلة تعلم تناسب احتياجاتك.
        </p>
      </div>

      <Form
        className="flex w-full flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Name */}
        <TextField
          name="name"
          type="text"
          isRequired
          isInvalid={!!errors.name}
        >
          <Label>الاسم</Label>

          <Input
            {...register("name")}
            fullWidth
            placeholder="أدخل اسمك بالكامل"
            autoComplete="name"
          />

          {errors.name && (
            <span className="text-sm text-danger">
              {errors.name.message}
            </span>
          )}
        </TextField>

        {/* Phone */}
        <TextField
          name="phone"
          type="tel"
          isRequired
          isInvalid={!!errors.phone}
        >
          <Label>رقم الموبايل</Label>

          <Input
            {...register("phone")}
            fullWidth
            placeholder="01xxxxxxxxx"
            autoComplete="tel"
            inputMode="tel"
          />

          {errors.phone && (
            <span className="text-sm text-danger">
              {errors.phone.message}
            </span>
          )}
        </TextField>

        {/* Email */}
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
          />

          {errors.email && (
            <span className="text-sm text-danger">
              {errors.email.message}
            </span>
          )}
        </TextField>

        {/* Password */}
        <TextField
          name="password"
          type="password"
          isRequired
          isInvalid={!!errors.password}
        >
          <Label>كلمة المرور</Label>

          <Input
            {...register("password")}
            fullWidth
            placeholder="أنشئ كلمة مرور قوية"
            autoComplete="new-password"
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
            className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger"
          >
            {serverError}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          fullWidth
          isDisabled={isSubmitting}
          className="mt-2 font-semibold"
        >
          {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
        </Button>
      </Form>

      {/* Login */}
      <div className="mt-8 flex items-center justify-center gap-1 text-sm">
        <span className="text-default-500">
          لديك حساب بالفعل؟
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
