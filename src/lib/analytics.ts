import "server-only";
import { createSign } from "node:crypto";
import { unstable_cache } from "next/cache";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const API = "https://analyticsdata.googleapis.com/v1beta";
const REVALIDATE = 60 * 15;

export interface AnalyticsRow {
  label: string;
  extra?: string;
  users: number;
  views: number;
}

export interface AnalyticsSummary {
  users: number;
  sessions: number;
  views: number;
  engagementRate: number;
  perDay: { date: string; users: number; views: number }[];
  pages: AnalyticsRow[];
  countries: AnalyticsRow[];
  sources: AnalyticsRow[];
  devices: AnalyticsRow[];
}

function credentials() {
  const raw = process.env.GA_SERVICE_ACCOUNT;
  if (raw) {
    const parsed = JSON.parse(raw) as { client_email?: string; private_key?: string };
    if (parsed.client_email && parsed.private_key) return { email: parsed.client_email, key: parsed.private_key };
  }
  const email = process.env.GA_CLIENT_EMAIL;
  const key = process.env.GA_PRIVATE_KEY;
  return email && key ? { email, key } : null;
}

export function propertyId() {
  return process.env.GA_PROPERTY_ID?.replace(/^properties\//, "").trim() || "";
}

export type AnalyticsStatus = { state: "ready" } | { state: "missing"; missing: string[] } | { state: "invalid"; message: string };

export function analyticsStatus(): AnalyticsStatus {
  const missing: string[] = [];
  if (!propertyId()) missing.push("GA_PROPERTY_ID");
  try {
    if (!credentials()) missing.push("GA_SERVICE_ACCOUNT");
  } catch {
    return { state: "invalid", message: "GA_SERVICE_ACCOUNT is set but is not valid JSON - paste the whole key file, including the outer braces." };
  }
  if (missing.length) return { state: "missing", missing };
  if (!/^\d+$/.test(propertyId())) {
    return { state: "invalid", message: `GA_PROPERTY_ID should be the numeric property id (for example 501234567), not "${propertyId()}".` };
  }
  return { state: "ready" };
}

const base64url = (input: Buffer | string) => Buffer.from(input).toString("base64url");

async function accessToken() {
  const creds = credentials();
  if (!creds) throw new Error("GA_SERVICE_ACCOUNT (or GA_CLIENT_EMAIL and GA_PRIVATE_KEY) is not set.");

  const now = Math.floor(Date.now() / 1000);
  const claim = { iss: creds.email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 };
  const unsigned = `${base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${base64url(JSON.stringify(claim))}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(creds.key.replace(/\\n/g, "\n"), "base64url");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
    cache: "no-store",
  });
  const body = (await res.json()) as { access_token?: string; error_description?: string; error?: string };
  if (!res.ok || !body.access_token) throw new Error(body.error_description ?? body.error ?? `Google refused the key (HTTP ${res.status}).`);
  return body.access_token;
}

interface ReportResponse {
  rows?: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }[];
  error?: { message?: string };
}

async function runReport(body: Record<string, unknown>): Promise<ReportResponse["rows"]> {
  const token = await accessToken();
  const res = await fetch(`${API}/properties/${propertyId()}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = (await res.json()) as ReportResponse;
  if (!res.ok) throw new Error(json.error?.message ?? `Google Analytics refused the request (HTTP ${res.status}).`);
  return json.rows ?? [];
}

const num = (value: string | undefined) => Number(value ?? 0) || 0;

async function table(dimension: string, days: number, limit: number, extraDimension?: string): Promise<AnalyticsRow[]> {
  const dimensions = [{ name: dimension }, ...(extraDimension ? [{ name: extraDimension }] : [])];
  const rows = await runReport({
    dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
    dimensions,
    metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit,
  });
  return (rows ?? []).map((row) => ({
    label: row.dimensionValues[0]?.value ?? "",
    extra: extraDimension ? row.dimensionValues[1]?.value : undefined,
    users: num(row.metricValues[0]?.value),
    views: num(row.metricValues[1]?.value),
  }));
}

async function buildAnalytics(days: number): Promise<AnalyticsSummary> {
  const [totals, perDay, pages, countries, sources, devices] = await Promise.all([
    runReport({
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }, { name: "engagementRate" }],
    }),
    runReport({
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
      limit: 400,
    }),
    table("pagePath", days, 15),
    table("country", days, 15),
    table("sessionSource", days, 10),
    table("deviceCategory", days, 5),
  ]);

  const t = totals?.[0]?.metricValues ?? [];
  return {
    users: num(t[0]?.value),
    sessions: num(t[1]?.value),
    views: num(t[2]?.value),
    engagementRate: num(t[3]?.value),
    perDay: (perDay ?? []).map((row) => ({
      date: row.dimensionValues[0]?.value ?? "",
      users: num(row.metricValues[0]?.value),
      views: num(row.metricValues[1]?.value),
    })),
    pages,
    countries,
    sources,
    devices,
  };
}

export const getAnalytics = (days: number) =>
  unstable_cache(() => buildAnalytics(days), ["ga-report", String(days)], { revalidate: REVALIDATE })();
