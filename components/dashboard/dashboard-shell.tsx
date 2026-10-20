"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { DashboardSidebar } from "./sidebar";
import { DashboardHeader } from "./dashboard-header";
import { getPageMeta } from "./nav-config";

interface DashboardShellProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

const COLLAPSE_STORAGE_KEY = "dle-graph-ai:sidebar-collapsed";

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Restore the rail preference after mount to avoid an SSR/client mismatch
  useEffect(() => {
    const stored = window.localStorage.getItem(COLLAPSE_STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
    setMounted(true);
  }, []);

  const handleCollapsedChange = (next: boolean) => {
    setCollapsed(next);
    window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(next));
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const meta = getPageMeta(pathname);
  const resolvedTitle = title ?? meta.title;
  const resolvedDescription = description ?? meta.description;

  // Only apply the rail offset once mounted, matching the sidebar's own guard
  const isRail = mounted && collapsed;

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <DashboardSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        collapsed={isRail}
        onCollapsedChange={handleCollapsedChange}
      />

      <div
        className={clsx(
          "transition-[padding] duration-200 ease-out",
          isRail ? "lg:pr-[76px]" : "lg:pr-64",
        )}
      >
        <DashboardHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={resolvedTitle}
          description={resolvedDescription}
        />

        <main className="min-h-[calc(100vh-4rem)] px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}