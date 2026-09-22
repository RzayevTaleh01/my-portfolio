import "server-only";
import type { Metadata } from "next";
import type { Profile } from "@/content";
import { localeTags, localize, locales, type Locale } from "@/i18n/config";

export const DESCRIPTION_LIMIT = 160;

export function clamp(text: string, limit = DESCRIPTION_LIMIT) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit - 1);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(", "), cut.lastIndexOf(" "));
  return `${cut.slice(0, stop > limit * 0.6 ? stop : cut.length).replace(/[.,]$/, "")}…`;
}

export function siteUrl(profile: Profile) {
  return profile.siteUrl.replace(/\/$/, "");
}

export function absolute(profile: Profile, path: string) {
  return `${siteUrl(profile)}${path}`;
}

function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(locales.map((l) => [localeTags[l], localize(l, path)])),
    "x-default": localize("en", path),
  };
}

interface PageSeo {
  lang: Locale;
  path: string;
  title: string;
  description: string;
  profile: Profile;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noTitleTemplate?: boolean;
}

export function pageMetadata({ lang, path, title, description, profile, type = "website", publishedTime, modifiedTime, tags, noTitleTemplate }: PageSeo): Metadata {
  const canonical = localize(lang, path);
  const summary = clamp(description);
  return {
    title: noTitleTemplate ? { absolute: title } : title,
    description: summary,
    alternates: { canonical, languages: languageAlternates(path) },
    openGraph: {
      type: type === "profile" ? "profile" : type,
      url: absolute(profile, canonical),
      siteName: profile.name,
      title,
      description: summary,
      locale: localeTags[lang].replace("-", "_"),
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeTags[l].replace("-", "_")),
      ...(type === "article" ? { publishedTime, modifiedTime, authors: [profile.name], tags } : {}),
    },
    twitter: { card: "summary_large_image", title, description: summary },
  };
}
