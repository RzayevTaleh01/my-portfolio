import "server-only";
import { list, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import { hasBlobStore } from "@/lib/cv/store";

const PREFIX = "claps/";

export const CLAPS_CACHE_TAG = "claps";

const devClaps: Set<string> = ((globalThis as { __devClaps?: Set<string> }).__devClaps ??= new Set());

async function countFromBlob() {
  let count = 0;
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    count += page.blobs.length;
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return count;
}

const cachedCount = unstable_cache(countFromBlob, ["claps-count"], { tags: [CLAPS_CACHE_TAG], revalidate: 300 });

export async function getClapCount() {
  if (!hasBlobStore()) return devClaps.size;
  try {
    return await cachedCount();
  } catch (error) {
    console.error("[claps] Counting claps in Vercel Blob failed:", error);
    return 0;
  }
}

export async function addClap(visitorId: string) {
  if (!hasBlobStore()) {
    devClaps.add(visitorId);
    return;
  }
  try {
    await put(`${PREFIX}${visitorId}.json`, JSON.stringify({ at: new Date().toISOString() }), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: "application/json",
    });
  } catch (error) {
    if (error instanceof Error && /already exists/i.test(error.message)) return;
    throw error;
  }
}
