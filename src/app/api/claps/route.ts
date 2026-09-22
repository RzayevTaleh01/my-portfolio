import { randomUUID } from "node:crypto";
import { revalidateTag } from "next/cache";
import { cookies, headers } from "next/headers";
import { addClap, CLAPS_CACHE_TAG, getClapCount, type ClapRecord } from "@/lib/claps";

const COOKIE = "portfolio_clap";
const ONE_YEAR = 60 * 60 * 24 * 365;

function decode(value: string | null) {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function visitor(id: string, page: string | undefined): Promise<ClapRecord> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined;
  return {
    id,
    at: new Date().toISOString(),
    ip,
    country: h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? undefined,
    region: decode(h.get("x-vercel-ip-country-region")),
    city: decode(h.get("x-vercel-ip-city")),
    language: h.get("accept-language")?.split(",")[0] || undefined,
    userAgent: h.get("user-agent") ?? undefined,
    referer: h.get("referer") ?? undefined,
    page,
  };
}

export async function GET() {
  const clapped = Boolean((await cookies()).get(COOKIE)?.value);
  return Response.json({ count: await getClapCount(), clapped }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const store = await cookies();
  if (store.get(COOKIE)?.value) {
    return Response.json({ count: await getClapCount(), clapped: true });
  }

  const body = (await request.json().catch(() => ({}))) as { page?: unknown };
  const page = typeof body.page === "string" ? body.page.slice(0, 200) : undefined;
  const id = randomUUID();
  try {
    await addClap(await visitor(id, page));
  } catch (error) {
    console.error("[claps] Saving a clap failed:", error);
    return Response.json({ error: "The clap was not saved." }, { status: 500 });
  }

  store.set(COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: ONE_YEAR });
  revalidateTag(CLAPS_CACHE_TAG, { expire: 0 });
  return Response.json({ count: await getClapCount(), clapped: true });
}
