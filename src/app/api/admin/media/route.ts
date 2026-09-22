import { isAdmin } from "@/lib/admin-auth";
import { publishSiteData, storageError } from "@/lib/site/publish";
import { isMediaKey, readSiteDataFresh, saveMedia } from "@/lib/site/store";

const MAX_BYTES = 5 * 1024 * 1024;

const allowed: Record<string, string[]> = {
  avatar: ["image/webp", "image/jpeg", "image/png"],
  "cv-photo": ["image/jpeg", "image/png"],
};

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Signed out - sign in again." }, { status: 401 });

  const form = await request.formData().catch(() => null);
  const key = String(form?.get("key") ?? "");
  const file = form?.get("file");
  if (!isMediaKey(key)) return Response.json({ error: "Unknown photo." }, { status: 400 });
  if (!(file instanceof File)) return Response.json({ error: "Choose a file." }, { status: 400 });
  if (!allowed[key].includes(file.type)) {
    return Response.json({ error: `Use ${allowed[key].map((t) => t.replace("image/", "").toUpperCase()).join(", ")}.` }, { status: 415 });
  }
  if (file.size > MAX_BYTES) return Response.json({ error: "The file is larger than 5 MB." }, { status: 413 });

  try {
    await saveMedia(key, await file.arrayBuffer(), file.type);
    const data = await readSiteDataFresh();
    data.mediaVersion = (data.mediaVersion ?? 0) + 1;
    const updatedAt = await publishSiteData(data);
    return Response.json({ mediaVersion: data.mediaVersion, updatedAt });
  } catch (error) {
    return storageError(error);
  }
}
