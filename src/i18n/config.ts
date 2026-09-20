export const locales = ["en", "sk"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Cookie that remembers the visitor's language choice (read by src/proxy.ts). */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeNames: Record<Locale, string> = {
  en: "English",
  sk: "Slovenčina",
};

/** BCP 47 tags for Intl date formatting and <html lang>. */
export const localeTags: Record<Locale, string> = {
  en: "en-US",
  sk: "sk-SK",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Prefixes an internal path with the locale: ("sk", "/projects") → "/sk/projects". */
export function localize(locale: Locale, path: string) {
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Replaces "{name}" placeholders in a dictionary string. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}
