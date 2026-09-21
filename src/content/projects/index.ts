import type { Project } from "../types";
import { aments } from "./aments";
import { cryptoTrader } from "./crypto-trader";
import { devcodeLms } from "./devcode-lms";
import { diaspor } from "./diaspor";
import { edumediaProjects } from "./edumedia";
import { etacxi } from "./etacxi";
import { eduvision } from "./eduvision";
import { langvis } from "./langvis";
import { unecTtj } from "./unec-ttj";
import { vacancyBot } from "./vacancy-bot";

// Order here is the display order.
export const projects: Project[] = [
  diaspor,
  unecTtj,
  etacxi,
  ...edumediaProjects,
  eduvision,
  langvis,
  devcodeLms,
  cryptoTrader,
  vacancyBot,
  aments,
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null;
}
