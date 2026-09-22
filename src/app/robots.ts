import type { MetadataRoute } from "next";
import { getContent } from "@/content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = (await getContent("en")).profile.siteUrl.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    host: base,
    sitemap: `${base}/sitemap.xml`,
  };
}
