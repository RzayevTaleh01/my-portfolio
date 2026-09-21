import { writeFile } from "node:fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";
import type { Region } from "@/i18n/region";
import { isAdmin } from "@/lib/admin-auth";
import { cvFiles, normalizeConfig } from "@/lib/cv/model";
import { renderCvPdf } from "@/lib/cv/render";
import { CV_CACHE_TAG, hasBlobStore, LOCAL_CONFIG_FILE, saveToBlob } from "@/lib/cv/store";

/**
 * Saves the CV selection from /admin and republishes both PDFs.
 *   With a Blob store (live site): written to Vercel Blob, the download links
 *   switch to the new PDFs on the next request - no redeploy.
 *   Under `npm run dev`: also written to src/content/cv/cv-config.json.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Signed out - sign in again." }, { status: 401 });

  const dev = process.env.NODE_ENV === "development";
  if (!hasBlobStore() && !dev) {
    return Response.json({ error: "No Vercel Blob store is connected to this project." }, { status: 503 });
  }

  const config = normalizeConfig(await request.json());
  config.updatedAt = new Date().toISOString();

  // Both PDFs must render before anything is published.
  try {
    await Promise.all((Object.keys(cvFiles) as Region[]).map((r) => renderCvPdf(r, config)));
  } catch (error) {
    return Response.json({ error: `The PDF did not render: ${error instanceof Error ? error.message : error}` }, { status: 422 });
  }

  if (hasBlobStore()) await saveToBlob(config);
  if (dev) await writeFile(LOCAL_CONFIG_FILE, `${JSON.stringify(config, null, 2)}\n`, "utf8");

  // The next download is rebuilt from the new selection instead of served stale.
  revalidateTag(CV_CACHE_TAG, { expire: 0 });
  Object.values(cvFiles).forEach((file) => revalidatePath(`/cv/${file}`));

  return Response.json({ config, storage: hasBlobStore() ? "blob" : "file" });
}
