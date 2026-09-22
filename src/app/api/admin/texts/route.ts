import { isAdmin } from "@/lib/admin-auth";
import type { Localized } from "@/lib/site/localized";
import { publishSiteData, storageError } from "@/lib/site/publish";
import { readSiteDataFresh } from "@/lib/site/store";
import { textKeys, type TextKey } from "@/lib/site/texts";

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Signed out - sign in again." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { texts?: Record<string, { en?: string; sk?: string }> } | null;
  const texts: Partial<Record<TextKey, Localized<string>>> = {};
  for (const key of textKeys) {
    const value = body?.texts?.[key];
    const en = value?.en?.trim() ?? "";
    const sk = value?.sk?.trim() ?? "";
    if (en || sk) texts[key] = sk ? { en, sk } : { en };
  }

  try {
    const data = await readSiteDataFresh();
    data.texts = texts;
    const updatedAt = await publishSiteData(data);
    return Response.json({ texts, updatedAt });
  } catch (error) {
    return storageError(error);
  }
}
