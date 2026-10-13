"use client";

import { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button, Tooltip } from "@heroui/react";
import clsx from "clsx";
import { Moon, Sun } from "@gravity-ui/icons";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={clsx(
          "size-9 animate-pulse rounded-full bg-default-100/60",
          className,
        )}
      />
    );
  }

  const isLight = resolvedTheme === "light";
  const label = isLight ? "تفعيل الوضع الداكن" : "تفعيل الوضع الفاتح";

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button
          isIconOnly
          variant="ghost"
          size="sm"
          aria-label={label}
          aria-pressed={isLight}
          onPress={() => setTheme(isLight ? "dark" : "light")}
          className={clsx(
            "border border-divider text-default-500",
            "data-[hover=true]:text-foreground",
            className,
          )}
        >
          <span className="relative grid size-[18px] place-items-center overflow-hidden">
            <Sun
              width={18}
              height={18}
              aria-hidden="true"
              className={clsx(
                "absolute transition-all duration-300 ease-out motion-reduce:transition-none",
                isLight
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-50 opacity-0",
              )}
            />
            <Moon
              width={18}
              height={18}
              aria-hidden="true"
              className={clsx(
                "absolute transition-all duration-300 ease-out motion-reduce:transition-none",
                isLight
                  ? "rotate-90 scale-50 opacity-0"
                  : "rotate-0 scale-100 opacity-100",
              )}
            />
          </span>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Tooltip.Arrow />
        {label}
      </Tooltip.Content>
    </Tooltip>
  );
};
