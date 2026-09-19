/**
 * Visitor region, derived from the IP country that the host adds to each request
 * (Vercel: x-vercel-ip-country, Cloudflare: cf-ipcountry).
 *   "sk"   → visitors from Slovakia
 *   "intl" → everyone else
 * src/proxy.ts resolves it once and forwards it to pages in REGION_HEADER.
 */
export type Region = "sk" | "intl";

export const REGION_HEADER = "x-visitor-region";

export function regionFromCountry(country: string | null | undefined): Region {
  return country?.toUpperCase() === "SK" ? "sk" : "intl";
}

export function isRegion(value: string | null | undefined): value is Region {
  return value === "sk" || value === "intl";
}
