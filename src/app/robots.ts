import type { MetadataRoute } from "next";
import { getContent } from "@/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${getContent("en").profile.siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
