import "server-only";
import { headers } from "next/headers";
import { isRegion, REGION_HEADER, type Region } from "@/i18n/region";

/** The visitor's region for the current request (set by src/proxy.ts). */
export async function getRegion(): Promise<Region> {
  const value = (await headers()).get(REGION_HEADER);
  return isRegion(value) ? value : "intl";
}
