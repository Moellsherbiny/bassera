"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Label,
  Separator,
  TextField,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("البريد الإلكتروني غير صحيح"),

  password: z.string().min(1, "يرجى إدخال كلمة المرور"),

  remember: z.boolean(),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,

      // مهم:
      // نخلي Auth.js يرجع النتيجة بدل redirect تلقائي
      redirect: false,
    });

    if (!result?.ok) {
      setServerError(
        "فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.",
      );

      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setServerError(null);
    setIsGoogleLoading(true);

    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  const isLoading = isSubmitting || isGoogleLoading;

  return (
    <div className="w-full" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">تسجيل الدخول</h1>

        <p className="mt-2 text-sm leading-6 text-default-500">
          سجّل الدخول إلى حسابك لمتابعة رحلة التعلم.
        </p>
      </div>

      {/* Login Form */}
      <Form
        className="flex w-full flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
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
            placeholder="أدخل بريدك الإلكتروني"
            autoComplete="email"
            inputMode="email"
            variant="primary"
            dir="ltr"
          />

          {errors.email && (
            <span className="text-sm text-danger">{errors.email.message}</span>
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
            placeholder="أدخل كلمة المرور"
            autoComplete="current-password"
            variant="primary"
            dir="ltr"
          />

          {errors.password && (
            <span className="text-sm text-danger">
              {errors.password.message}
            </span>
          )}
        </TextField>

        {/* Remember + Forgot */}
        <div className="flex w-full items-center justify-between gap-4">
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <Checkbox
                name={field.name}
                isSelected={field.value}
                isDisabled={isLoading}
                onChange={field.onChange}
                onBlur={field.onBlur}
              >
                تذكرني
              </Checkbox>
            )}
          />

          <NextLink
            href="/forgot-password"
            className="shrink-0 text-sm font-medium text-primary transition-opacity hover:opacity-80"
          >
            نسيت كلمة المرور؟
          </NextLink>
        </div>

        {/* Server Error */}
        {serverError && (
          <div
            role="alert"
            className="w-full rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm leading-6 text-danger"
          >
            {serverError}
          </div>
        )}

        {/* Credentials Submit */}
        <Button
          type="submit"
          size="lg"
          fullWidth
          isDisabled={isLoading}
          className="mt-2 font-semibold"
        >
          {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>
      </Form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3">
        <Separator className="flex-1" />

        <span className="text-xs font-medium text-default-400">أو</span>

        <Separator className="flex-1" />
      </div>

      {/* Google */}
      <Button
        type="button"
        variant="tertiary"
        size="lg"
        fullWidth
        isDisabled={isLoading}
        onPress={handleGoogleSignIn}
        className="font-semibold"
      >
        <Icon icon="devicon:google" className="size-5" />

        {isGoogleLoading
          ? "جاري المتابعة مع Google..."
          : "المتابعة بواسطة Google"}
      </Button>

      {/* Register */}
      <div className="mt-8 flex items-center justify-center gap-1 text-sm">
        <span className="text-default-500">ليس لديك حساب؟</span>

        <NextLink
          href="/register"
          className="font-semibold text-primary transition-opacity hover:opacity-80"
        >
          إنشاء حساب
        </NextLink>
      </div>
    </div>
  );
}
