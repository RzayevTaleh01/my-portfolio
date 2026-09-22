import type { NextRequest } from "next/server";
import { regionFromCountry, type Region } from "@/i18n/region";

export const TEST_COOKIE = "geo_test_country";

export function testOverride(request: NextRequest): { country: string | null; write?: string } {
  const token = process.env.GEO_TEST_TOKEN;
  const given = request.nextUrl.searchParams.get("t");
  const asked = request.nextUrl.searchParams.get("country");

  if (token && given === token && asked) {
    return asked === "reset" ? { country: null, write: "reset" } : { country: asked, write: asked };
  }
  return { country: request.cookies.get(TEST_COOKIE)?.value ?? null };
}

function visitorCountry(request: NextRequest): string | null {
  if (process.env.NODE_ENV === "development") {
    const override = request.nextUrl.searchParams.get("country");
    if (override) return override;
  }
  return (
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry") ??
    request.headers.get("x-country-code")
  );
}

export function visitorRegion(request: NextRequest, test = testOverride(request)): Region {
  return regionFromCountry(test.country ?? visitorCountry(request));
}
