import { writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizeConfig } from "@/lib/cv/model";

const file = path.join(process.cwd(), "src", "content", "cv", "cv-config.json");

/**
 * Saves the CV selection from /admin into src/content/cv/cv-config.json.
 * Only while running `next dev` on your own machine: the deployed site is
 * read-only, and the PDFs are rebuilt from this file on the next deploy.
 */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Saving works only in local development (npm run dev)." }, { status: 403 });
  }
  const config = normalizeConfig(await request.json());
  config.updatedAt = new Date().toISOString();
  await writeFile(file, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  return Response.json(config);
}
