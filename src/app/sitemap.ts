import type { MetadataRoute } from "next";
import { getContent, navigation } from "@/content";
import { localeTags, localize, locales } from "@/i18n/config";
import { getAllPosts } from "@/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (await getContent("en")).profile.siteUrl.replace(/\/$/, "");
  const paths = [
    ...navigation.map((n) => n.href),
    ...(await getContent("en")).projects.map((p) => `/projects/${p.slug}`),
    ...(await getAllPosts("en")).map((p) => `/writing/${p.slug}`),
  ];

  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${base}${localize(lang, path)}`,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [localeTags[l], `${base}${localize(l, path)}`])),
      },
    })),
  );
}
