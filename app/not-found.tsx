import type { Metadata } from "next";
import NextLink from "next/link";
import { Button } from "@heroui/react";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
};

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-6"
    >
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0
          opacity-40
          [background-image:linear-gradient(to_right,hsl(var(--heroui-default-200)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--heroui-default-200)/0.35)_1px,transparent_1px)]
          [background-size:48px_48px]
          [mask-image:radial-gradient(circle_at_center,black_0%,transparent_70%)]
        "
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        {/* Visual */}
        <div className="relative mb-8">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[2rem] bg-primary/10 blur-2xl"
          />

          <div className="relative flex size-40 items-center justify-center rounded-[2rem] border border-divider bg-background/70 shadow-small backdrop-blur-xl sm:size-48">
            <span className="select-none text-7xl font-black tracking-[-0.08em] text-primary sm:text-8xl">
              404
            </span>

            <span
              aria-hidden="true"
              className="absolute right-5 top-5 size-2 rounded-full bg-primary"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-7 left-6 size-1.5 rounded-full bg-primary/50"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-5 right-8 size-1 rounded-full bg-default-400"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="max-w-xl">
          <p className="mb-2 text-sm font-semibold text-primary">
            المسار غير موجود
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            يبدو أننا فقدنا هذا المسار
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-default-500 sm:text-base">
            الصفحة التي تبحث عنها غير موجودة، أو ربما تم تغيير مكانها. دعنا
            نعيدك إلى مساحة التعلّم الخاصة بك.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            variant="primary"
            size="lg"
            className="min-w-40 font-semibold"
          >
            <NextLink href="/" className="w-full">
            العودة للرئيسية
            </NextLink>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="min-w-40 font-semibold"
          >
            <NextLink href="/dashboard" className="w-full ">
              لوحة التحكم
            </NextLink>
        
          </Button>
        </div>

        {/* Brand */}
        <p className="mt-10 text-xs font-medium text-default-400">
          بَصيـــرة · BASEERA
        </p>
      </div>
    </main>
  );
}