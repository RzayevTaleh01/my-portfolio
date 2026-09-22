import { isAdmin } from "@/lib/admin-auth";
import type { SiteData } from "@/lib/site/data";
import { publishSiteData, storageError } from "@/lib/site/publish";
import { readSiteDataFresh } from "@/lib/site/store";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Signed out - sign in again." }, { status: 401 });
  const data = await readSiteDataFresh();
  return new Response(`${JSON.stringify(data, null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="site-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Signed out - sign in again." }, { status: 401 });

  const data = (await request.json().catch(() => null)) as SiteData | null;
  if (!data || typeof data !== "object" || data.version !== 1 || !data.profile || !Array.isArray(data.projects)) {
    return Response.json({ error: "This is not a site backup file." }, { status: 400 });
  }

  try {
    const current = await readSiteDataFresh();
    const updatedAt = await publishSiteData({ ...data, mediaVersion: Math.max(data.mediaVersion ?? 0, current.mediaVersion ?? 0) + 1 });
    return Response.json({ updatedAt });
  } catch (error) {
    return storageError(error);
  }
}
