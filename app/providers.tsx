"use client";

import type { ThemeProviderProps } from "next-themes";
import {Toast} from "@heroui/react"
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextThemesProvider {...themeProps}>{children}

        <Toast.Provider placement="top" />
      </NextThemesProvider>
    </SessionProvider>
  );
}
