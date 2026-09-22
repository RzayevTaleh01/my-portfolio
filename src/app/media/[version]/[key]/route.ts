import { isMediaKey, readMedia } from "@/lib/site/store";

export async function GET(_request: Request, ctx: RouteContext<"/media/[version]/[key]">) {
  const { key } = await ctx.params;
  if (!isMediaKey(key)) return new Response("Not found", { status: 404 });
  const media = await readMedia(key);
  if (!media) return new Response("Not found", { status: 404 });
  return new Response(media.body.slice().buffer, {
    headers: { "Content-Type": media.type, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
