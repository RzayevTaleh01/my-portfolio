import "server-only";
import { del, get, list, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import { hasBlobStore } from "@/lib/cv/store";

const PREFIX = "claps/";

export const CLAPS_CACHE_TAG = "claps";

export interface ClapRecord {
  id: string;
  at: string;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  language?: string;
  userAgent?: string;
  referer?: string;
  page?: string;
}

const devClaps: Map<string, ClapRecord> = ((globalThis as { __devClapRecords?: Map<string, ClapRecord> }).__devClapRecords ??= new Map());

async function allBlobs() {
  const blobs: { pathname: string; uploadedAt: Date }[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

const cachedCount = unstable_cache(async () => (await allBlobs()).length, ["claps-count"], { tags: [CLAPS_CACHE_TAG], revalidate: 300 });

export async function getClapCount() {
  if (!hasBlobStore()) return devClaps.size;
  try {
    return await cachedCount();
  } catch (error) {
    console.error("[claps] Counting claps in Vercel Blob failed:", error);
    return 0;
  }
}

export async function addClap(record: ClapRecord) {
  if (!hasBlobStore()) {
    devClaps.set(record.id, record);
    return;
  }
  try {
    await put(`${PREFIX}${record.id}.json`, JSON.stringify(record), {
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

const idOf = (pathname: string) => pathname.slice(PREFIX.length).replace(/\.json$/, "");

async function readRecord(blob: { pathname: string; uploadedAt: Date }): Promise<ClapRecord> {
  const fallback = { id: idOf(blob.pathname), at: new Date(blob.uploadedAt).toISOString() };
  try {
    const result = await get(blob.pathname, { access: "private" });
    if (!result || result.statusCode !== 200) return fallback;
    return { ...fallback, ...(JSON.parse(await new Response(result.stream).text()) as Partial<ClapRecord>), id: fallback.id };
  } catch {
    return fallback;
  }
}

export async function listClaps(): Promise<ClapRecord[]> {
  if (!hasBlobStore()) return [...devClaps.values()].sort((a, b) => b.at.localeCompare(a.at));
  const blobs = await allBlobs();
  const records: ClapRecord[] = [];
  for (let i = 0; i < blobs.length; i += 10) {
    records.push(...(await Promise.all(blobs.slice(i, i + 10).map(readRecord))));
  }
  return records.sort((a, b) => b.at.localeCompare(a.at));
}

export async function deleteClap(id: string) {
  if (!/^[\w-]+$/.test(id)) throw new Error("Invalid id.");
  if (!hasBlobStore()) {
    devClaps.delete(id);
    return;
  }
  await del(`${PREFIX}${id}.json`);
}
