import { unstable_cache } from "next/cache";
import type { NextRequest } from "next/server";
import { getContent } from "@/content";
import { isRegion, type Region } from "@/i18n/region";
import { renderCvPdf } from "@/lib/cv/render";
import { CV_CACHE_TAG, getPublishedConfig } from "@/lib/cv/store";
import { cvDownloadName, cvFileName } from "@/lib/site/content";
import { SITE_CACHE_TAG } from "@/lib/site/store";
import { visitorRegion } from "@/lib/visitor-region";

const DEPLOYMENT = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "local";

const renderBase64 = async (region: Region) => (await renderCvPdf(region, await getPublishedConfig())).toString("base64");

const cachedPdf =
  process.env.NODE_ENV === "development"
    ? renderBase64
    : unstable_cache(renderBase64, ["cv-pdf", DEPLOYMENT], { tags: [CV_CACHE_TAG, SITE_CACHE_TAG] });

export async function GET(request: NextRequest, ctx: RouteContext<"/cv/[file]">) {
  const { file } = await ctx.params;
  const { name } = (await getContent("en")).profile;
  const current = cvFileName(name);
  if (file === current.replace(/\.pdf$/, "-sk.pdf")) return Response.redirect(new URL(`/cv/${current}`, request.url), 308);
  if (file !== current) return new Response("Not found", { status: 404 });

  const asked = request.nextUrl.searchParams.get("region");
  const region = isRegion(asked) ? asked : visitorRegion(request);
  const pdf = Buffer.from(await cachedPdf(region), "base64");

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${cvDownloadName(name)}"`,
      "Cache-Control": "private, no-store",
      Vary: "x-vercel-ip-country",
    },
  });
}
