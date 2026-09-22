import "server-only";
import { cache } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { pick } from "./localized";
import { getSiteData } from "./store";
import { withTexts } from "./texts";

export const getSiteTexts = cache(async (locale: Locale): Promise<Dictionary> => {
  const { texts } = await getSiteData();
  const values = Object.fromEntries(Object.entries(texts).map(([key, value]) => [key, value ? pick(value, locale) : ""]));
  return withTexts(getDictionary(locale), values);
});
