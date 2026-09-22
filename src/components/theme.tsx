"use client";

import { Moon, Sun } from "lucide-react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Light by default for every visitor, whatever the OS setting; dark only once they pick it.
 * A new storage key, so an old "system"/"dark" choice from before this rule does not carry over.
 */
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
      {/* Both icons render; CSS picks one so there is no hydration mismatch. */}
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </button>
  );
}
