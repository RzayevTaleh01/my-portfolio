import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import bundledConfig from "@/content/cv/cv-config.json";
import { normalizeConfig, type CvConfig } from "./model";

/**
 * Where the approved CV selection lives.
 *   Vercel Blob (private store) - written by /admin on the live site, read by the PDF route.
 *   src/content/cv/cv-config.json - the fallback before anything is saved to Blob,
 *   and the copy `npm run dev` writes locally.
 */
const BLOB_PATH = "cv/cv-config.json";
export const LOCAL_CONFIG_FILE = path.join(process.cwd(), "src", "content", "cv", "cv-config.json");

/** Tag on everything built from the saved selection; saving expires it. */
export const CV_CACHE_TAG = "cv";

/** A Blob store is connected: Vercel adds BLOB_READ_WRITE_TOKEN (or BLOB_STORE_ID with OIDC). */
export function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

async function readFromBlob(): Promise<unknown | null> {
  if (!hasBlobStore()) return null;
  try {
    // useCache: false - straight from storage, so a save is visible at once.
    const result = await get(BLOB_PATH, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return JSON.parse(await new Response(result.stream).text());
  } catch (error) {
    console.error("[cv] Reading the CV config from Vercel Blob failed:", error);
    return null;
  }
}

// Cached between saves; the hourly revalidate only heals a failed read.
const cachedBlobConfig = unstable_cache(readFromBlob, ["cv-config"], { tags: [CV_CACHE_TAG], revalidate: 3600 });

/** The selection the live PDFs are built from. */
export async function getPublishedConfig(): Promise<CvConfig> {
  // `npm run dev` without Blob: the file on disk, so a local save shows up at once.
  if (!hasBlobStore() && process.env.NODE_ENV === "development") {
    return normalizeConfig(JSON.parse(await readFile(LOCAL_CONFIG_FILE, "utf8")));
  }
  return normalizeConfig((await cachedBlobConfig()) ?? bundledConfig);
}

export async function saveToBlob(config: CvConfig) {
  await put(BLOB_PATH, JSON.stringify(config, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
