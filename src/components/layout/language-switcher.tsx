"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { LOCALE_COOKIE, localeNames, locales, type Locale } from "@/i18n/config";
import { startRouteProgress } from "@/components/top-loader";
import { cn } from "@/lib/utils";

function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

/** Language dropdown - keeps the current page and remembers the choice in a cookie. */
export function LanguageSwitcher({ current, label, className }: { current: Locale; label: string; className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const change = (l: Locale) => {
    if (l === current) return;
    rememberLocale(l);
    startRouteProgress();
    const rest = pathname.replace(/^\/[^/]+/, "");
    router.push(`/${l}${rest}${window.location.hash}`);
  };

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label={label}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-lg border bg-surface px-2.5 text-[13px] font-medium text-foreground transition-colors hover:border-border-strong data-[state=open]:border-border-strong",
          className,
        )}
      >
        <Globe className="size-3.5 text-muted-foreground" />
        <span className="uppercase">{current}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="dialog-overlay z-50 min-w-44 rounded-xl border bg-surface p-1 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.25)]"
        >
          {locales.map((l) => (
            <DropdownMenu.Item
              key={l}
              onSelect={() => change(l)}
              lang={l}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none data-[highlighted]:bg-muted"
            >
              <span className="w-6 text-xs font-semibold uppercase text-subtle-foreground">{l}</span>
              <span className="flex-1">{localeNames[l]}</span>
              {l === current && <Check className="size-3.5 text-accent" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
