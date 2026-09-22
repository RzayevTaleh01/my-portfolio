import { writeFile } from "node:fs/promises";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { CV_PATH, normalizeConfig, regions } from "@/lib/cv/model";
import { renderCvPdf } from "@/lib/cv/render";
import { CV_CACHE_TAG, hasBlobStore, LOCAL_CONFIG_FILE, saveToBlob } from "@/lib/cv/store";

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Signed out - sign in again." }, { status: 401 });

  const dev = process.env.NODE_ENV === "development";
  if (!hasBlobStore() && !dev) {
    return Response.json({ error: "No Vercel Blob store is connected to this project." }, { status: 503 });
  }

  const config = normalizeConfig(await request.json());
  config.updatedAt = new Date().toISOString();

  try {
    await Promise.all(regions.map((r) => renderCvPdf(r, config)));
  } catch (error) {
    return Response.json({ error: `The PDF did not render: ${error instanceof Error ? error.message : error}` }, { status: 422 });
  }

  if (hasBlobStore()) await saveToBlob(config);
  if (dev) await writeFile(LOCAL_CONFIG_FILE, `${JSON.stringify(config, null, 2)}\n`, "utf8");

  revalidateTag(CV_CACHE_TAG, { expire: 0 });
  revalidatePath(CV_PATH);

  return Response.json({ config, storage: hasBlobStore() ? "blob" : "file" });
}
