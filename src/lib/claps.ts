import "server-only";
import { list, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import { hasBlobStore } from "@/lib/cv/store";

/**
 * Applause for the portfolio. Every clap is its own small blob
 * (claps/<visitor id>.json), so two visitors clapping at once can never
 * overwrite each other - the count is simply the number of blobs.
 * Under `npm run dev` without a Blob store the claps live in memory.
 */
const PREFIX = "claps/";

/** Tag on the cached count; a new clap expires it. */
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

/** Records one clap for this visitor; a second clap with the same id is ignored. */
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
    // Already clapped - the blob exists and must not be overwritten.
    if (error instanceof Error && /already exists/i.test(error.message)) return;
    throw error;
  }
}
