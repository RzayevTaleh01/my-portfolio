import "server-only";
import { cache } from "react";
import type { Locale } from "@/i18n/config";
import type { Region } from "@/i18n/region";
import { buildContent, profileFor, type SiteContent } from "@/lib/site/content";
import { getSiteData } from "@/lib/site/store";

export * from "./types";
export type { SiteContent };

export const getContent = cache(async (locale: Locale): Promise<SiteContent> => buildContent(await getSiteData(), locale));

export function withRegion(content: SiteContent, region: Region) {
  return profileFor(content, region);
}

export { navigation } from "./navigation";
