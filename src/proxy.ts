import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE, locales, type Locale } from "@/i18n/config";
import { REGION_HEADER, type Region } from "@/i18n/region";
import { TEST_COOKIE, testOverride, visitorRegion } from "@/lib/visitor-region";

const TEST_COOKIE_MAX_AGE = 60 * 60 * 2;

function preferredLocale(request: NextRequest, region: Region): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;
  return region === "sk" ? "sk" : defaultLocale;
}

export function proxy(request: NextRequest) {
  const test = testOverride(request);
  const region = visitorRegion(request, test);
  const { pathname } = request.nextUrl;
  const hasPrefix = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

  let response: NextResponse;
  if (hasPrefix) {
    const headers = new Headers(request.headers);
    headers.set(REGION_HEADER, region);
    response = NextResponse.next({ request: { headers } });
  } else {
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
  matcher: ["/((?!_next|api|admin|media|icon|apple-icon|.*\\..*).*)"],
};
