import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { CV_CACHE_TAG } from "@/lib/cv/store";
import type { SiteData } from "./data";
import { saveSiteData, SITE_CACHE_TAG } from "./store";

export async function publishSiteData(data: SiteData) {
  data.updatedAt = new Date().toISOString();
  await saveSiteData(data);
  revalidateTag(SITE_CACHE_TAG, { expire: 0 });
  revalidateTag(CV_CACHE_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return data.updatedAt;
}

export function storageError(error: unknown) {
  return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
}
