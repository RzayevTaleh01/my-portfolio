import { randomUUID } from "node:crypto";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { addClap, CLAPS_CACHE_TAG, getClapCount } from "@/lib/claps";

/** Set once a visitor has clapped; its value names their clap in storage. */
const COOKIE = "portfolio_clap";
const ONE_YEAR = 60 * 60 * 24 * 365;

/** The current count, and whether this visitor has already clapped. */
export async function GET() {
  const clapped = Boolean((await cookies()).get(COOKIE)?.value);
  return Response.json({ count: await getClapCount(), clapped }, { headers: { "Cache-Control": "no-store" } });
}

/** One clap per visitor: a repeat clap only returns the count. */
export async function POST() {
  const store = await cookies();
  if (store.get(COOKIE)?.value) {
    return Response.json({ count: await getClapCount(), clapped: true });
  }

  const id = randomUUID();
  try {
    await addClap(id);
  } catch (error) {
    console.error("[claps] Saving a clap failed:", error);
    return Response.json({ error: "The clap was not saved." }, { status: 500 });
  }

  store.set(COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: ONE_YEAR });
  revalidateTag(CLAPS_CACHE_TAG, { expire: 0 });
  return Response.json({ count: await getClapCount(), clapped: true });
}
