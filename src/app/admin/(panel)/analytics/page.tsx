import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { analyticsConfigured, getAnalytics, propertyId, type AnalyticsRow } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const RANGES = [7, 28, 90];

function Setup() {
  return (
    <div className="space-y-4 px-5 py-6 text-sm lg:px-8">
      <p className="text-muted-foreground">
        Connect a Google Analytics property to see visitor numbers here. The site itself already reports to Google Analytics as soon as the
        measurement ID is filled in under Profile.
      </p>
      <ol className="list-decimal space-y-2 pl-5 text-[13px] leading-relaxed text-muted-foreground marker:text-subtle-foreground">
        <li>In Google Cloud, create a project and enable the Google Analytics Data API.</li>
        <li>Create a service account and download its JSON key.</li>
        <li>
          In Google Analytics, open Admin → Property access management and add the service account e-mail as a <strong>Viewer</strong>.
        </li>
        <li>
          In Vercel, add the environment variables <code className="font-mono text-foreground">GA_PROPERTY_ID</code> (the numeric property id) and{" "}
          <code className="font-mono text-foreground">GA_SERVICE_ACCOUNT</code> (the whole JSON key), then redeploy.
        </li>
      </ol>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-surface px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
    </div>
  );
}

function Bars({ perDay }: { perDay: { date: string; users: number; views: number }[] }) {
  const max = Math.max(1, ...perDay.map((d) => d.users));
  const day = (value: string) => `${value.slice(6, 8)}.${value.slice(4, 6)}`;
  return (
    <div className="rounded-xl border bg-surface p-4">
      <p className="mb-3 text-sm font-semibold tracking-tight">Visitors per day</p>
      <div className="flex h-36 items-end gap-[3px]">
        {perDay.map((d) => (
          <div
            key={d.date}
            title={`${day(d.date)}: ${d.users} visitors, ${d.views} views`}
            className="min-w-[3px] flex-1 rounded-t bg-accent/70 transition-colors hover:bg-accent"
            style={{ height: `${Math.max(2, (d.users / max) * 100)}%` }}
          />
        ))}
      </div>
      {perDay.length > 0 && (
        <div className="mt-2 flex justify-between font-mono text-[11px] text-subtle-foreground">
          <span>{day(perDay[0].date)}</span>
          <span>{day(perDay[perDay.length - 1].date)}</span>
        </div>
      )}
    </div>
  );
}

function Table({ title, rows, mono }: { title: string; rows: AnalyticsRow[]; mono?: boolean }) {
  const max = Math.max(1, ...rows.map((r) => r.views));
  return (
    <div className="rounded-xl border bg-surface">
      <p className="border-b px-4 py-2.5 text-sm font-semibold tracking-tight">{title}</p>
      {rows.length === 0 ? (
        <p className="px-4 py-3 text-[13px] text-muted-foreground">No data yet.</p>
      ) : (
        <ul className="divide-y">
          {rows.map((row) => (
            <li key={row.label} className="relative flex items-center gap-3 px-4 py-2 text-[13px]">
              <span className="absolute inset-y-0 left-0 bg-accent-soft/60" style={{ width: `${(row.views / max) * 100}%` }} />
              <span className={cn("relative min-w-0 flex-1 truncate", mono && "font-mono text-xs")}>{row.label || "(not set)"}</span>
              <span className="relative shrink-0 font-mono text-xs text-muted-foreground">{row.users}</span>
              <span className="relative w-12 shrink-0 text-right font-mono text-xs">{row.views}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function AnalyticsPage(props: PageProps<"/admin/analytics">) {
  if (!(await isAdmin())) return null;
  const { range } = await props.searchParams;
  const days = RANGES.includes(Number(range)) ? Number(range) : 28;

  if (!analyticsConfigured()) {
    return (
      <div>
        <header className="border-b px-5 py-3 lg:px-8">
          <h1 className="text-base font-semibold tracking-tight">Analytics</h1>
          <p className="text-xs text-muted-foreground">Google Analytics is not connected yet.</p>
        </header>
        <Setup />
      </div>
    );
  }

  let data: Awaited<ReturnType<typeof getAnalytics>> | null = null;
  let error: string | null = null;
  try {
    data = await getAnalytics(days);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <div>
      <header className="flex flex-wrap items-center gap-3 border-b px-5 py-3 lg:px-8">
        <div className="mr-auto">
          <h1 className="text-base font-semibold tracking-tight">Analytics</h1>
          <p className="text-xs text-muted-foreground">Google Analytics property {propertyId()} · numbers refresh every 15 minutes.</p>
        </div>
        <div className="flex rounded-lg border bg-muted/60 p-0.5">
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/admin/analytics?range=${r}`}
              className={cn(
                "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                r === days ? "bg-surface shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r} days
            </Link>
          ))}
        </div>
      </header>

      {error ? (
        <div className="space-y-3 px-5 py-6 lg:px-8">
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-900">{error}</p>
          <Setup />
        </div>
      ) : (
        data && (
          <div className="space-y-4 px-5 py-6 lg:px-8">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat label="Visitors" value={data.users.toLocaleString()} />
              <Stat label="Sessions" value={data.sessions.toLocaleString()} />
              <Stat label="Page views" value={data.views.toLocaleString()} />
              <Stat label="Engagement" value={`${Math.round(data.engagementRate * 100)}%`} />
            </div>
            <Bars perDay={data.perDay} />
            <div className="grid gap-4 lg:grid-cols-2">
              <Table title="Pages" rows={data.pages} mono />
              <Table title="Countries" rows={data.countries} />
              <Table title="Sources" rows={data.sources} />
              <Table title="Devices" rows={data.devices} />
            </div>
            <p className="text-xs text-muted-foreground">Each row shows visitors and page views.</p>
          </div>
        )
      )}
    </div>
  );
}
