import type { Region } from "@/i18n/region";
import { cvFiles } from "@/lib/cv/model";
import { renderCvPdf } from "@/lib/cv/render";
import { getPublishedConfig } from "@/lib/cv/store";

/**
 * The downloadable CVs, generated from the site content and the selection
 * approved in /admin:
 *   /cv/taleh-rzayev-cv-sk.pdf - Slovakia
 *   /cv/taleh-rzayev-cv.pdf    - other countries
 * Built once and cached; saving in /admin expires the cache (see api/admin/cv-config).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(cvFiles).map((file) => ({ file }));
}

export async function GET(_request: Request, ctx: RouteContext<"/cv/[file]">) {
  const { file } = await ctx.params;
  const region = (Object.keys(cvFiles) as Region[]).find((r) => cvFiles[r] === file);
  if (!region) return new Response("Not found", { status: 404 });

  const pdf = await renderCvPdf(region, await getPublishedConfig());
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Taleh_Rzayev_Resume.pdf"',
    },
  });
}
