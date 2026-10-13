"use client";

import { Bars } from "@gravity-ui/icons";
import { Separator } from "@heroui/react";

import { ThemeSwitch } from "@/components/theme-switch";
import { UserMenu } from "../user-menu";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  title: string;
  description?: string;
}

export function DashboardHeader({
  onMenuClick,
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-divider bg-background/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Right side */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="فتح القائمة"
            onClick={onMenuClick}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-default-500 transition-colors hover:bg-default-100 hover:text-foreground lg:hidden"
          >
            <Bars width={20} height={20} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
              {title}
            </h1>

            {description && (
              <p className="hidden truncate text-xs text-default-400 sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Left side */}
        <div className="flex shrink-0 items-center gap-3">
          <ThemeSwitch />
          <Separator orientation="vertical" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}