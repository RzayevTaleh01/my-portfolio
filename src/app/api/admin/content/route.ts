import { isAdmin } from "@/lib/admin-auth";
import type { SiteData } from "@/lib/site/data";
import { pick } from "@/lib/site/localized";
import { cleanSection } from "@/lib/site/normalize";
import { publishSiteData, storageError } from "@/lib/site/publish";
import { getSection } from "@/lib/site/schema";
import { readSiteDataFresh } from "@/lib/site/store";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function slugProblem(items: unknown, what: string): string | null {
  if (!Array.isArray(items)) return null;
  const seen = new Set<string>();
  for (const [i, item] of items.entries()) {
    const slug = String((item as { slug?: unknown }).slug ?? "");
    const name = pick((item as { title?: unknown }).title as string, "en") || `#${i + 1}`;
    if (!SLUG.test(slug)) return `${what} "${name}": the slug must be lowercase letters, digits and dashes.`;
    if (seen.has(slug)) return `Two ${what}s use the slug "${slug}".`;
    seen.add(slug);
  }
  return null;
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Signed out - sign in again." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { section?: string; value?: unknown } | null;
  const section = getSection(body?.section ?? "");
  if (!section) return Response.json({ error: "Unknown section." }, { status: 400 });

  const value = cleanSection(section.fields, Boolean(section.list), body?.value);
  const problem =
    section.key === "projects" ? slugProblem(value, "project") : section.key === "posts" ? slugProblem(value, "article") : null;
  if (problem) return Response.json({ error: problem }, { status: 422 });

  try {
    const data = await readSiteDataFresh();
    (data as unknown as Record<string, unknown>)[section.key] = value;
    const updatedAt = await publishSiteData(data as SiteData);
    return Response.json({ value, updatedAt });
  } catch (error) {
    return storageError(error);
  }
}
