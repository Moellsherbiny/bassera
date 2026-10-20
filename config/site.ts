export type SiteConfig = typeof siteConfig;

export const siteConfig = {
   name: "بيئة التعلم بالإنفوجرافيك الذكي",
  englishName: "DLE Graph-AI",

 description:
    "بيئة تعلم ذكية مدعومة بالذكاء الاصطناعي، تقدم المحتوى التعليمي من خلال الإنفوجرافيك التفاعلي بما يتناسب مع احتياجات كل متعلم.",

  tagline: "AI-Powered Infographic Learning",


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