import Image from "next/image";
import NextLink from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand Panel */}
        <section className="relative hidden overflow-hidden bg-default-50 lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-primary/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            {/* Logo */}
            <NextLink
              href="/"
              className="flex w-fit items-center gap-2.5 text-foreground"
              aria-label="DLE Graph-AI"
            >
              <Image
                src="/favicon.ico"
                alt=""
                width={38}
                height={38}
                priority
              />

              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold">DLE Graph-AI</span>

                <span className="mt-1 text-[9px] font-medium text-default-400">
                  بيئة التعلم بالإنفوجرافيك الذكي
                </span>
              </div>
            </NextLink>

            {/* Message */}
            <div className="max-w-md">
              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                تعلّم بطريقة
                <span className="block text-primary">تناسبك.</span>
              </h1>

              <p className="mt-6 leading-8 text-default-500">
                بيئة تعليمية تكيفية تجمع بين الذكاء الاصطناعي، المحتوى البصري،
                والفيديو لتقديم تجربة تعلم أكثر تفاعلًا وملاءمة لاحتياجاتك.
              </p>
            </div>

            {/* Footer */}
            <p className="text-xs text-default-400">
              AI-Powered Adaptive Learning
            </p>
          </div>
        </section>

        {/* Auth Content */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <NextLink
                href="/"
                className="flex items-center gap-2.5 text-foreground"
                aria-label="DLE Graph-AI"
              >
                <Image
                  src="/favicon.ico"
                  alt=""
                  width={36}
                  height={36}
                  priority
                />

                <div className="flex flex-col leading-none">
                  <span className="text-base font-bold">DLE Graph-AI</span>

                  <span className="mt-1 text-[8px] font-medium text-default-400">
                    بيئة التعلم بالإنفوجرافيك الذكي
                  </span>
                </div>
              </NextLink>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
