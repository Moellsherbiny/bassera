"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Avatar, Dropdown, Label } from "@heroui/react";
import {
  ArrowRightFromSquare,
  Gear,
  House,
  Person,
} from "@gravity-ui/icons";

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "طالب",
  TEACHER: "مدرس",
  ADMIN: "مدير",
};

const DASHBOARD_HREF: Record<string, string> = {
  STUDENT: "/dashboard/student",
  TEACHER: "/dashboard/teacher",
  ADMIN: "/dashboard",
};

export function UserMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div
        aria-hidden="true"
        className="size-9 animate-pulse rounded-full bg-default-100/60"
      />
    );
  }

  if (status !== "authenticated" || !session?.user) {
    return null;
  }

  const user = session.user;
  const role = user.role ?? "";

  const displayName = user.name ?? "حسابي";
  const roleLabel = ROLE_LABELS[role] ?? "مستخدم";
  const dashboardHref = DASHBOARD_HREF[role] ?? "/dashboard";

  const userInitial = (user.name?.trim() || user.email?.trim() || "U")
    .charAt(0)
    .toUpperCase();

  const userAvatar = (
    <Avatar size="sm">
      {user.image ? (
        <Avatar.Image src={user.image} alt={displayName} />
      ) : null}
      <Avatar.Fallback>{userInitial}</Avatar.Fallback>
    </Avatar>
  );

  return (
    <Dropdown>
      <Dropdown.Trigger className="flex items-center gap-2 rounded-full">
        <div className="hidden flex-col items-end gap-0 text-right sm:flex">
          <Label className="max-w-32 truncate">{displayName}</Label>
          <span className="text-xs text-muted">{roleLabel}</span>
        </div>
        {userAvatar}
      </Dropdown.Trigger>

      <Dropdown.Popover>
        <div className="flex items-center gap-2 px-3 pb-1 pt-3">
          {userAvatar}
          <div className="flex min-w-0 flex-col gap-0">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p dir="ltr" className="truncate text-xs text-muted">
              {user.email}
            </p>
            <p className="mt-1 text-[11px] text-default-400">{roleLabel}</p>
          </div>
        </div>

        <Dropdown.Menu
          aria-label="خيارات الحساب"
          onAction={(key) => {
            switch (key) {
              case "dashboard":
                router.push(dashboardHref);
                break;
              case "profile":
                router.push("/dashboard/profile");
                break;
              case "settings":
                router.push("/dashboard/settings");
                break;
              case "logout":
                signOut({ callbackUrl: "/" });
                break;
            }
          }}
        >
          <Dropdown.Item id="dashboard" textValue="لوحة التحكم">
            <div className="flex w-full items-center gap-2">
              <House className="size-4" />
              <Label>لوحة التحكم</Label>
            </div>
          </Dropdown.Item>

          <Dropdown.Item id="profile" textValue="الملف الشخصي">
            <div className="flex w-full items-center gap-2">
              <Person className="size-4" />
              <Label>الملف الشخصي</Label>
            </div>
          </Dropdown.Item>

          <Dropdown.Item id="settings" textValue="الإعدادات">
            <div className="flex w-full items-center gap-2">
              <Gear className="size-4" />
              <Label>الإعدادات</Label>
            </div>
          </Dropdown.Item>

          <Dropdown.Item id="logout" textValue="تسجيل الخروج" variant="danger">
            <div className="flex w-full items-center gap-2">
              <ArrowRightFromSquare className="size-4 text-danger" />
              <Label>تسجيل الخروج</Label>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}