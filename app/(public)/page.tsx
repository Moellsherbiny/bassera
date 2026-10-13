import { Button } from "@heroui/react";
import Image from "next/image";
import NextLink from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الصفحة الرئيسية",
};

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="mx-auto flex min-h-[calc(100vh-10.25rem)] max-w-7xl items-center px-6 py-2">
          <div className="grid w-full items-center gap-16 lg:grid-cols-2">
            {/* Hero Content */}
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl lg:text-5xl">
                تعلّم بطريقة تناسبك.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-default-500 sm:text-xl">
                بَصيرة هي بيئة تعليمية تكيفية مدعومة بالذكاء الاصطناعي، تقدم
                المحتوى التعليمي بصورة بصرية وتفاعلية بما يتناسب مع احتياجات كل
                متعلم.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="primary" size="lg" fullWidth className="font-semibold sm:w-auto">
                  <NextLink
                    href="/login"
                  
                  >
                    ابدأ التعلم
                  </NextLink>
                </Button>
                <Button variant="outline" size="lg" fullWidth className="font-semibold sm:w-auto">
                  <NextLink href="/about">عن بَصيـــــــــرة</NextLink>
                </Button>
              </div>
            </div>

            {/* Visual */}
            <div className="relative hidden justify-center lg:flex">
              <div className="relative flex aspect-square w-[420px] items-center justify-center">
                <div className="absolute inset-10 rotate-6 rounded-[3rem] border border-divider bg-default-50" />

                <div className="absolute inset-10 -rotate-3 rounded-[3rem] border border-divider bg-background" />

                <div className="relative z-10 flex size-64 items-center justify-center rounded-[3rem] border border-divider bg-background shadow-xl">
                  <div className="flex flex-col items-center">
                    <Image
                      src="/favicon.ico"
                      alt="بَصيرة"
                      width={72}
                      height={72}
                      priority
                    />

                    <span className="mt-4 text-2xl font-bold">بَصيرة</span>

                    <span className="mt-1 text-xs font-medium tracking-[0.25em] text-default-400">
                      BASEERA
                    </span>
                  </div>
                </div>

                <div className="absolute right-0 top-16 z-20 rounded-2xl border border-divider bg-background px-4 py-3 shadow-lg">
                  <p className="text-xs text-default-400">Adaptive</p>

                  <p className="mt-1 text-sm font-semibold">Learning</p>
                </div>

                <div className="absolute bottom-14 left-0 z-20 rounded-2xl border border-divider bg-background px-4 py-3 shadow-lg">
                  <p className="text-xs text-default-400">Visual</p>

                  <p className="mt-1 text-sm font-semibold">Learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
