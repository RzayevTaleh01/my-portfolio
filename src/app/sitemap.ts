import type { MetadataRoute } from "next";
import { getContent, navigation } from "@/content";
import { localeTags, localize, locales } from "@/i18n/config";
import { getAllPosts } from "@/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getContent("en").profile.siteUrl.replace(/\/$/, "");
  const paths = [
    ...navigation.map((n) => n.href),
    ...getContent("en").projects.map((p) => `/projects/${p.slug}`),
    ...getAllPosts("en").map((p) => `/writing/${p.slug}`),
  ];

  // One entry per page and language, each listing its translations.
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${base}${localize(lang, path)}`,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [localeTags[l], `${base}${localize(l, path)}`])),
      },
    })),
  );
}
