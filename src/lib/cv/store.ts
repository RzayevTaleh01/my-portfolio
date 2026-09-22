import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import bundledConfig from "@/content/cv/cv-config.json";
import { normalizeConfig, type CvConfig } from "./model";

const BLOB_PATH = "cv/cv-config.json";
export const LOCAL_CONFIG_FILE = path.join(process.cwd(), "src", "content", "cv", "cv-config.json");

export const CV_CACHE_TAG = "cv";

export function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

async function readFromBlob(): Promise<unknown | null> {
  if (!hasBlobStore()) return null;
  try {
    const result = await get(BLOB_PATH, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return JSON.parse(await new Response(result.stream).text());
  } catch (error) {
    console.error("[cv] Reading the CV config from Vercel Blob failed:", error);
    return null;
  }
}

const cachedBlobConfig = unstable_cache(readFromBlob, ["cv-config"], { tags: [CV_CACHE_TAG], revalidate: 3600 });

export async function getPublishedConfig(): Promise<CvConfig> {
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
