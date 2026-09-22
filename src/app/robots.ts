import type { MetadataRoute } from "next";
import { getContent } from "@/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${(await getContent("en")).profile.siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
