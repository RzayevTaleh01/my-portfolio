import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";
import { REGION_HEADER, regionFromCountry, type Region } from "@/i18n/region";

/**
 * Test mode: with the secret token (GEO_TEST_TOKEN) you can browse the live site
 * as a visitor from any country:
 *   /en/cv?country=LV&t=<token>   → switches and remembers it for two hours
 *   /en/cv?country=reset&t=<token> → back to your real country
 */
const TEST_COOKIE = "geo_test_country";
const TEST_COOKIE_MAX_AGE = 60 * 60 * 2;

function testOverride(request: NextRequest): { country: string | null; write?: string } {
  const token = process.env.GEO_TEST_TOKEN;
  const given = request.nextUrl.searchParams.get("t");
  const asked = request.nextUrl.searchParams.get("country");

  if (token && given === token && asked) {
    return asked === "reset" ? { country: null, write: "reset" } : { country: asked, write: asked };
  }
  return { country: request.cookies.get(TEST_COOKIE)?.value ?? null };
}

/** Country from the hosting platform's geo-IP header. Absent locally. */
function visitorCountry(request: NextRequest): string | null {
  // Local development needs no token: http://localhost:3000/?country=SK
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

/** A saved choice always wins; otherwise Slovak for visitors from Slovakia, English for everyone else. */
function preferredLocale(request: NextRequest, region: Region): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;
  return region === "sk" ? "sk" : defaultLocale;
}

export function proxy(request: NextRequest) {
  const test = testOverride(request);
  const region = regionFromCountry(test.country ?? visitorCountry(request));
  const { pathname } = request.nextUrl;
  const hasPrefix = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

  let response: NextResponse;
  if (hasPrefix) {
    // Forward the region to the pages. Always overwritten, so a client cannot spoof it.
    const headers = new Headers(request.headers);
    headers.set(REGION_HEADER, region);
    response = NextResponse.next({ request: { headers } });
  } else {
    // "/projects" → "/sk/projects" or "/en/projects"
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request, region)}${pathname === "/" ? "" : pathname}`;
    response = NextResponse.redirect(url);
  }

  if (test.write === "reset") {
    response.cookies.delete(TEST_COOKIE);
  } else if (test.write) {
    response.cookies.set(TEST_COOKIE, test.write, { path: "/", maxAge: TEST_COOKIE_MAX_AGE, sameSite: "lax" });
  }
  return response;
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, PDF, sitemap.xml…).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
