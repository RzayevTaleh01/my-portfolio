import { revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { CLAPS_CACHE_TAG, deleteClap } from "@/lib/claps";

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Signed out - sign in again." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id") ?? "";
  try {
    await deleteClap(id);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
  revalidateTag(CLAPS_CACHE_TAG, { expire: 0 });
  return Response.json({ ok: true });
}
