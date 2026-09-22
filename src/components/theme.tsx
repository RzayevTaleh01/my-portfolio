"use client";

import { Moon, Sun } from "lucide-react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="theme-choice" disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}

export function ThemeToggle({ label, bordered = false }: { label: string; bordered?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      aria-label={label}
      title={label}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground",
        bordered ? "border bg-surface hover:border-border-strong" : "hover:bg-muted",
      )}
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </button>
  );
}
