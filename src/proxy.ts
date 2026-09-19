import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";
import { REGION_HEADER, regionFromCountry, type Region } from "@/i18n/region";

/** Country from the hosting platform's geo-IP header. Absent locally. */
function visitorCountry(request: NextRequest): string | null {
  // Local testing only: http://localhost:3000/?country=SK
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
  const region = regionFromCountry(visitorCountry(request));
  const { pathname } = request.nextUrl;
  const hasPrefix = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

  if (!hasPrefix) {
    // "/projects" → "/sk/projects" or "/en/projects"
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request, region)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // Forward the region to the pages. Always overwritten, so a client cannot spoof it.
  const headers = new Headers(request.headers);
  headers.set(REGION_HEADER, region);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, PDF, sitemap.xml…).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
