export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "بَصيرة",
  englishName: "BASEERA",

  description:
    "منصة تعليمية تكيفية مدعومة بالذكاء الاصطناعي لتقديم محتوى بصري تفاعلي يناسب احتياجات المتعلم.",

  tagline: "AI-Powered Adaptive Learning",

  navItems: [
    {
      label: "الرئيسية",
      href: "/",
    },
    {
      label: "عن المنصة",
      href: "/about",
    },
  ],

  navMenuItems: [
    {
      label: "الرئيسية",
      href: "/",
    },
    {
      label: "عن المنصة",
      href: "/#about",
    },
    {
      label: "تسجيل الدخول",
      href: "/login",
    },
  ],

  links: {
    github: "",
  },
};