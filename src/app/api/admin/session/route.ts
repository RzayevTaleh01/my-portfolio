import { endSession, isAdminConfigured, isCorrectCode, startSession } from "@/lib/admin-auth";

/** Sign in with the admin code. */
export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return Response.json({ error: "ADMIN_CODE is not set on the server." }, { status: 503 });
  }
  const { code } = (await request.json().catch(() => ({}))) as { code?: unknown };
  if (typeof code !== "string" || !isCorrectCode(code)) {
    // Slows down guessing.
    await new Promise((r) => setTimeout(r, 800));
    return Response.json({ error: "Wrong code." }, { status: 401 });
  }
  await startSession();
  return Response.json({ ok: true });
}

/** Sign out. */
export async function DELETE() {
  await endSession();
  return Response.json({ ok: true });
}
