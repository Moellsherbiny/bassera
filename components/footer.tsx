import Image from "next/image";
import NextLink from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-divider">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 py-8 sm:flex-row">
          {/* Brand */}
          <NextLink
            href="/"
            className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
            aria-label="DLE Graph-AI"
          >
            <Image src="/favicon.ico" alt="" width={28} height={28} />

            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold">DLE Graph-AI</span>

              <span className="mt-1 text-[8px] font-medium text-default-400">
                بيئة التعلم بالإنفوجرافيك الذكي
              </span>
            </div>
          </NextLink>

          {/* Navigation */}
          <nav className="flex items-center gap-5">
            <NextLink
              href="/about"
              className="text-sm text-default-500 transition-colors hover:text-foreground"
            >
              عن المنصة
            </NextLink>

            <NextLink
              href="/login"
              className="text-sm text-default-500 transition-colors hover:text-foreground"
            >
              تسجيل الدخول
            </NextLink>
          </nav>

          {/* Copyright */}
          <p dir="ltr" className="text-xs text-default-400">
            © {new Date().getFullYear()}  DLE Graph-AI
          </p>
        </div>
      </div>
    </footer>
  );
};
