import "server-only";
import path from "node:path";
import { createElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import type { Region } from "@/i18n/region";
import { readMedia } from "@/lib/site/store";
import { CvDocument, registerCvFonts } from "./document";
import { buildCvData, type CvConfig, type CvImage } from "./model";
import { getCvSource } from "./source";

const publicDir = path.join(process.cwd(), "public");

async function cvPhoto(): Promise<CvImage | null> {
  const photo = await readMedia("cv-photo");
  if (!photo) return null;
  const format = photo.type === "image/png" ? "png" : "jpg";
  return { data: Buffer.from(photo.body), format };
}

export async function renderCvPdf(region: Region, config: CvConfig) {
  registerCvFonts(path.join(publicDir, "fonts", "cv"));
  const photo = await cvPhoto();
  const regionConfig = photo ? config.regions[region] : { ...config.regions[region], photo: false };
  const data = buildCvData(await getCvSource(), regionConfig, region, photo ?? "");
  const doc = createElement(CvDocument, { data }) as unknown as React.ReactElement<DocumentProps>;
  return renderToBuffer(doc);
}
