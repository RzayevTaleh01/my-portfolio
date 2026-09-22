"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ClapRecord } from "@/lib/claps";
import { cn } from "@/lib/utils";

const countryNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

function countryName(code?: string) {
  if (!code) return "Unknown";
  try {
    return countryNames?.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function flag(code?: string) {
  if (!code || !/^[a-z]{2}$/i.test(code)) return "";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

function device(ua?: string) {
  if (!ua) return "-";
  const browser =
    /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Other";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Android/.test(ua)
      ? "Android"
      : /iPhone|iPad|iOS/.test(ua)
        ? "iOS"
        : /Mac OS X/.test(ua)
          ? "macOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Other";
  const bot = /bot|crawler|spider|headless/i.test(ua);
  return `${browser} · ${os}${bot ? " · bot" : ""}`;
}

export function ClapsTable({ claps }: { claps: ClapRecord[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [country, setCountry] = useState("all");

  const byCountry = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of claps) counts.set(c.country ?? "", (counts.get(c.country ?? "") ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [claps]);

  const shown = country === "all" ? claps : claps.filter((c) => (c.country ?? "") === country);

  const [now] = useState(() => Date.now());
  const since = (days: number) => claps.filter((c) => now - new Date(c.at).getTime() < days * 86400000).length;
  const stats = [
    { label: "Total claps", value: claps.length },
    { label: "Countries", value: byCountry.filter(([code]) => code).length },
    { label: "Last 7 days", value: since(7) },
    { label: "Last 24 hours", value: since(1) },
  ];

  async function remove(c: ClapRecord) {
    if (!confirm(`Delete the clap from ${c.ip ?? "an unknown IP"}? The counter goes down by one.`)) return;
    setBusy(c.id);
    const res = await fetch(`/api/admin/claps?id=${encodeURIComponent(c.id)}`, { method: "DELETE" });
    setBusy(null);
    if (!res.ok) {
      alert(((await res.json().catch(() => ({}))) as { error?: string }).error ?? `HTTP ${res.status}`);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-5 px-5 py-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-surface px-4 py-3">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {[["all", claps.length] as const, ...byCountry].map(([code, n]) => (
          <button
            key={code || "unknown"}
            onClick={() => setCountry(code)}
            className={cn(
              "rounded-full border px-3 py-1 text-[13px] transition-colors",
              country === code ? "border-foreground bg-foreground text-background" : "bg-surface hover:border-border-strong",
            )}
          >
            {code === "all" ? "All" : `${flag(code)} ${countryName(code)}`} <span className="ml-1 font-mono text-xs opacity-70">{n}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="text-sm text-muted-foreground">No claps yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-surface">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b bg-muted/40 text-xs text-muted-foreground">
              <tr>
                {["When", "IP address", "Country", "Region / city", "Language", "Device", "Page", ""].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {shown.map((c) => (
                <tr key={c.id} className="align-top hover:bg-muted/30">
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-xs">{new Date(c.at).toLocaleString()}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-xs">
                    {c.ip ? (
                      <a href={`https://ipinfo.io/${c.ip}`} target="_blank" rel="noopener noreferrer" className="underline decoration-border-strong underline-offset-2 hover:decoration-foreground">
                        {c.ip}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    {flag(c.country)} {countryName(c.country)}
                  </td>
                  <td className="px-3 py-2">{[c.region, c.city].filter(Boolean).join(" / ") || "-"}</td>
                  <td className="whitespace-nowrap px-3 py-2">{c.language ?? "-"}</td>
                  <td className="whitespace-nowrap px-3 py-2" title={c.userAgent}>
                    {device(c.userAgent)}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{c.page ?? "-"}</td>
                  <td className="px-2 py-1.5 text-right">
                    <button
                      onClick={() => remove(c)}
                      disabled={busy === c.id}
                      aria-label="Delete clap"
                      title="Delete clap"
                      className="rounded-md p-1.5 text-subtle-foreground transition-colors hover:bg-muted hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Country, region and city come from Vercel&apos;s location headers at the moment of the clap. Claps saved before this list existed only have a date.
        Click an IP address to look it up.
      </p>
    </div>
  );
}
