import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { Region } from "@/i18n/region";
import { CvDocument, registerCvFonts } from "./document";
import { buildCvData, type CvConfig } from "./model";
import { getCvSource } from "./source";

const publicDir = path.join(process.cwd(), "public");

export async function renderCvPdf(region: Region, config: CvConfig) {
  registerCvFonts(path.join(publicDir, "fonts", "cv"));
  const photo = { data: await readFile(path.join(publicDir, "avatar-cv.jpg")), format: "jpg" as const };
  const data = buildCvData(getCvSource(), config.regions[region], region, photo);
  const doc = createElement(CvDocument, { data }) as unknown as React.ReactElement<DocumentProps>;
  return renderToBuffer(doc);
}
