import type { MetadataRoute } from "next";
import { getContent, navigation } from "@/content";
import { localeTags, localize, locales } from "@/i18n/config";
import { getAllPosts } from "@/lib/posts";
import { getSiteData } from "@/lib/site/store";

interface Entry {
  path: string;
  lastModified: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getContent("en");
  const base = content.profile.siteUrl.replace(/\/$/, "");
  const updated = (await getSiteData()).updatedAt ?? new Date().toISOString();
  const posts = await getAllPosts("en");

  const entries: Entry[] = [
    ...navigation.map((n) => ({
      path: n.href,
      lastModified: updated,
      changeFrequency: "weekly" as const,
      priority: n.href === "/" ? 1 : 0.8,
    })),
    ...content.projects.map((p) => ({ path: `/projects/${p.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...posts.map((p) => ({ path: `/writing/${p.slug}`, lastModified: p.date, changeFrequency: "monthly" as const, priority: 0.7 })),
    { path: "/privacy", lastModified: updated, changeFrequency: "yearly", priority: 0.2 },
  ];

  return entries.flatMap((entry) =>
    locales.map((lang) => ({
      url: `${base}${localize(lang, entry.path)}`,
      lastModified: new Date(entry.lastModified),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [localeTags[l], `${base}${localize(l, entry.path)}`])),
          "x-default": `${base}${localize("en", entry.path)}`,
        },
      },
    })),
  );
}
