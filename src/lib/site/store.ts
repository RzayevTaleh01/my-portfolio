import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { hasBlobStore } from "@/lib/cv/store";
import type { SiteData } from "./data";
import { emptySiteData } from "./data";

export const SITE_CACHE_TAG = "site";

const DATA_PATH = "site/content.json";
const MEDIA_PREFIX = "site/media/";

export const LOCAL_DIR = path.join(process.cwd(), ".content");
const LOCAL_DATA = path.join(LOCAL_DIR, "site.json");
const LOCAL_MEDIA = path.join(LOCAL_DIR, "media");

export const mediaKeys = ["avatar", "cv-photo"] as const;
export type MediaKey = (typeof mediaKeys)[number];

export function isMediaKey(value: string): value is MediaKey {
  return (mediaKeys as readonly string[]).includes(value);
}

const localOnly = () => !hasBlobStore() && process.env.NODE_ENV === "development";

async function readBlobJson(pathname: string): Promise<unknown | null> {
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return JSON.parse(await new Response(result.stream).text());
}

async function readFromBlob(): Promise<SiteData | null> {
  if (!hasBlobStore()) return null;
  try {
    return (await readBlobJson(DATA_PATH)) as SiteData | null;
  } catch (error) {
    console.error("[site] Reading the site data from Vercel Blob failed:", error);
    return null;
  }
}

const cachedBlobData = unstable_cache(readFromBlob, ["site-data"], { tags: [SITE_CACHE_TAG], revalidate: 3600 });

async function readLocalStrict(): Promise<SiteData | null> {
  const text = await readFile(LOCAL_DATA, "utf8").catch((error: NodeJS.ErrnoException) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  return text === null ? null : (JSON.parse(text) as SiteData);
}

async function readLocal(): Promise<SiteData | null> {
  try {
    return await readLocalStrict();
  } catch (error) {
    console.error("[site] Reading .content/site.json failed:", error);
    return null;
  }
}

export const getSiteData = cache(async (): Promise<SiteData> => {
  const data = localOnly() ? await readLocal() : await cachedBlobData();
  return { ...emptySiteData(), ...(data ?? {}) };
});

export async function readSiteDataFresh(): Promise<SiteData> {
  if (!localOnly() && !hasBlobStore()) throw new Error("No Vercel Blob store is connected to this project.");
  const data = localOnly() ? await readLocalStrict() : ((await readBlobJson(DATA_PATH)) as SiteData | null);
  return { ...emptySiteData(), ...(data ?? {}) };
}

export async function hasSiteData() {
  return (localOnly() ? await readLocal() : await readFromBlob()) !== null;
}

export function siteStorage(): "blob" | "file" | "none" {
  if (hasBlobStore()) return "blob";
  return process.env.NODE_ENV === "development" ? "file" : "none";
}

export async function saveSiteData(data: SiteData) {
  const body = `${JSON.stringify(data, null, 2)}\n`;
  if (hasBlobStore()) {
    await put(DATA_PATH, body, { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
  } else if (localOnly()) {
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(LOCAL_DATA, body, "utf8");
  } else {
    throw new Error("No Vercel Blob store is connected to this project.");
  }
}

export async function readMedia(key: MediaKey): Promise<{ body: Uint8Array; type: string } | null> {
  if (localOnly()) {
    try {
      const meta = JSON.parse(await readFile(path.join(LOCAL_MEDIA, `${key}.json`), "utf8")) as { type: string };
      return { body: new Uint8Array(await readFile(path.join(LOCAL_MEDIA, key))), type: meta.type };
    } catch {
      return null;
    }
  }
  if (!hasBlobStore()) return null;
  try {
    const result = await get(`${MEDIA_PREFIX}${key}`, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return { body: new Uint8Array(await new Response(result.stream).arrayBuffer()), type: result.blob.contentType };
  } catch (error) {
    console.error(`[site] Reading ${key} from Vercel Blob failed:`, error);
    return null;
  }
}

export async function saveMedia(key: MediaKey, body: ArrayBuffer, type: string) {
  if (hasBlobStore()) {
    await put(`${MEDIA_PREFIX}${key}`, body, { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: type });
  } else if (localOnly()) {
    await mkdir(LOCAL_MEDIA, { recursive: true });
    await writeFile(path.join(LOCAL_MEDIA, key), new Uint8Array(body));
    await writeFile(path.join(LOCAL_MEDIA, `${key}.json`), JSON.stringify({ type }), "utf8");
  } else {
    throw new Error("No Vercel Blob store is connected to this project.");
  }
}
