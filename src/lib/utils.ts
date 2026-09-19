import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Publication } from "@/content/types";
import { localeTags, type Locale } from "@/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatters = new Map<Locale, Intl.DateTimeFormat>();

export function formatDate(iso: string, locale: Locale) {
  let f = formatters.get(locale);
  if (!f) {
    f = new Intl.DateTimeFormat(localeTags[locale], { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
    formatters.set(locale, f);
  }
  return f.format(new Date(iso));
}

export function sortPublications(items: Publication[]) {
  return [...items].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}
