"use client";

import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import clsx from "clsx";

import { ListUl, Xmark } from "@gravity-ui/icons";
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { useSession, signOut } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { UserMenu } from "./user-menu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const user = session?.user;

  const roleLabel =
    user?.role === "STUDENT"
      ? "طالب"
      : user?.role === "TEACHER"
        ? "مدرس"
        : user?.role === "ADMIN"
          ? "مدير"
          : "مستخدم";

  const dashboardHref = 'dashboard';

  const handleSignOut = async () => {
    setIsMenuOpen(false);

    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-divider bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <NextLink
          href="/"
          className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
          aria-label="بَصيرة"
        >
          <Image
            src="/favicon.ico"
            alt=""
            width={34}
            height={34}
            priority
            className="size-[34px]"
          />

          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">
              بَصيـــــــــرة
            </span>

            <span className="mt-1 text-[9px] font-medium tracking-[0.2em] text-default-400">
              BASEERA
            </span>
          </div>
        </NextLink>

        {/* Desktop Navigation */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden items-center gap-1 lg:flex"
        >
          {siteConfig.navItems.map((item) => (
            <NextLink
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-medium px-3 py-2",
                "text-sm font-medium text-default-500",
                "transition-colors",
                "hover:bg-default-100 hover:text-foreground",
              )}
            >
              {item.label}
            </NextLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 sm:flex">
          <ThemeSwitch />

          {isLoading ? (
            <div className="h-9 w-28 animate-pulse rounded-medium bg-default-100" />
          ) : isAuthenticated && user ? (
            <>
              {/* Dashboard */}
              <Button variant="tertiary" className="font-semibold">
                <NextLink href={dashboardHref}>لوحة التحكم</NextLink>
              </Button>

              <UserMenu/>
            </>
          ) : (
            <>
              <Button variant="tertiary" className="font-semibold">
                <NextLink href="/login">تسجيل الدخول</NextLink>
              </Button>

              <Button variant="primary" className="font-semibold">
                <NextLink href="/register">إنشاء حساب</NextLink>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 sm:hidden">
          <ThemeSwitch />

          {isAuthenticated && user && (
            <Avatar size="sm">
              {user.image ? (
                <Avatar.Image
                  src={user.image}
                  alt={user.name ?? "صورة المستخدم"}
                />
              ) : null}
            </Avatar>
          )}

          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            onClick={() => setIsMenuOpen((open) => !open)}
            className={clsx(
              "flex size-10 items-center justify-center rounded-medium",
              "text-foreground transition-colors",
              "hover:bg-default-100",
              isMenuOpen && "bg-default-100",
            )}
          >
            {isMenuOpen ? (
              <Xmark width={20} height={20} aria-hidden="true" />
            ) : (
              <ListUl width={20} height={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-divider bg-background/95 px-4 py-4 backdrop-blur-xl sm:hidden"
        >
          <nav aria-label="التنقل الرئيسي" className="mx-auto max-w-7xl">
            <ul className="flex flex-col gap-1">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <NextLink
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx(
                      "block rounded-medium px-3 py-2.5",
                      "text-sm font-medium text-default-600",
                      "transition-colors",
                      "hover:bg-default-100 hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </NextLink>
                </li>
              ))}

              <li className="mt-3 border-t border-divider pt-3">
                {isLoading ? (
                  <div className="h-11 w-full animate-pulse rounded-medium bg-default-100" />
                ) : isAuthenticated && user ? (
                  <div className="flex flex-col gap-2">
                    {/* User info */}
                    <div className="flex items-center gap-3 rounded-xl bg-default-50 px-3 py-3">
                      <Avatar size="sm">
                        {user.image ? (
                          <Avatar.Image
                            src={user.image}
                            alt={user.name ?? "صورة المستخدم"}
                          />
                        ) : null}

                        <Avatar.Fallback>
                          {(user.name ?? user.email ?? "U")
                            .charAt(0)
                            .toUpperCase()}
                        </Avatar.Fallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                          {user.name ?? "حسابي"}
                        </p>

                        <p className="text-xs text-default-400">{roleLabel}</p>
                      </div>
                    </div>

                    {/* Dashboard */}
                    <Button
                      fullWidth
                      variant="primary"
                      onPress={() => setIsMenuOpen(false)}
                      className="font-semibold"
                    >
                      <NextLink href={dashboardHref}>لوحة التحكم</NextLink>
                    </Button>

                    {/* Logout */}
                    <Button
                      fullWidth
                      variant="danger-soft"
                      onPress={handleSignOut}
                      className="font-semibold"
                    >
                      تسجيل الخروج
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="tertiary"
                      onPress={() => setIsMenuOpen(false)}
                      className="font-semibold"
                    >
                      <NextLink href="/login">تسجيل الدخول</NextLink>
                    </Button>

                    <Button
                      variant="primary"
                      onPress={() => setIsMenuOpen(false)}
                      className="font-semibold"
                    >
                      <NextLink href="/register">إنشاء حساب</NextLink>
                    </Button>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
