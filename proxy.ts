
import { auth } from "@/auth";
import { NextResponse } from "next/server";

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
  "/reset-password",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const isDashboardRoute = pathname.startsWith("/dashboard");

  const isAuthRoute = authRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`),
  );

  // مستخدم غير مسجل ويحاول دخول Dashboard
  if (isDashboardRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);

    loginUrl.searchParams.set(
      "callbackUrl",
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  // مستخدم مسجل ويحاول دخول Auth Routes
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL("/dashboard", req.nextUrl),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/verify",
    "/reset-password",
  ],
};