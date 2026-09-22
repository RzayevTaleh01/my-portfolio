import type { Locale } from "@/i18n/config";

export type Localized<T> = { en: T; sk?: T };

export type MaybeLocalized<T> = T | Localized<T>;

export function isLocalized(value: unknown): value is Localized<unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.includes("en") && keys.every((k) => k === "en" || k === "sk");
}

function filled(value: unknown) {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function pick<T>(value: MaybeLocalized<T>, locale: Locale): T {
  if (!isLocalized(value)) return value as T;
  const own = (value as Localized<T>)[locale];
  return filled(own) ? (own as T) : (value as Localized<T>).en;
}

export function resolve<T>(value: unknown, locale: Locale): T {
  if (isLocalized(value)) return resolve<T>(pick(value, locale), locale);
  if (Array.isArray(value)) return value.map((v) => resolve(v, locale)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v, locale)])) as T;
  }
  return value as T;
}
