import { unstable_cache } from "next/cache";
import type { NextRequest } from "next/server";
import { isRegion, type Region } from "@/i18n/region";
import { CV_DOWNLOAD_NAME, CV_FILE, CV_PATH } from "@/lib/cv/model";
import { renderCvPdf } from "@/lib/cv/render";
import { CV_CACHE_TAG, getPublishedConfig } from "@/lib/cv/store";
import { visitorRegion } from "@/lib/visitor-region";

const LEGACY_FILES = ["taleh-rzayev-cv-sk.pdf"];

const cachedPdf = unstable_cache(
  async (region: Region) => (await renderCvPdf(region, await getPublishedConfig())).toString("base64"),
  ["cv-pdf"],
  { tags: [CV_CACHE_TAG] },
);

export async function GET(request: NextRequest, ctx: RouteContext<"/cv/[file]">) {
  const { file } = await ctx.params;
  if (LEGACY_FILES.includes(file)) return Response.redirect(new URL(CV_PATH, request.url), 308);
  if (file !== CV_FILE) return new Response("Not found", { status: 404 });

  const asked = request.nextUrl.searchParams.get("region");
  const region = isRegion(asked) ? asked : visitorRegion(request);
  const pdf = Buffer.from(await cachedPdf(region), "base64");

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${CV_DOWNLOAD_NAME}"`,
      "Cache-Control": "private, no-store",
      Vary: "x-vercel-ip-country",
    },
  });
}
