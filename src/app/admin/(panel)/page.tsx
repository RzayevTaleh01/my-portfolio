import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { hasSiteData, readSiteDataFresh, siteStorage } from "@/lib/site/store";
import { sections } from "@/lib/site/schema";

const storageText = {
  blob: "Vercel Blob - saving publishes to the live site at once.",
  file: "Local file .content/site.json (npm run dev without a Blob store).",
  none: "No storage - connect a Vercel Blob store to this project and redeploy.",
};

export default async function Overview() {
  if (!(await isAdmin())) return null;
  const storage = siteStorage();
  const filled = storage !== "none" && (await hasSiteData());
  const data = filled ? await readSiteDataFresh() : null;

  const count = (key: string) => {
    const value = (data as unknown as Record<string, unknown> | null)?.[key];
    return Array.isArray(value) ? `${value.length}` : value ? "" : "-";
  };

  return (
    <div>
      <header className="border-b px-5 py-3 lg:px-8">
        <h1 className="text-base font-semibold tracking-tight">Overview</h1>
        <p className="text-xs text-muted-foreground">
          {data?.updatedAt ? `Last change ${new Date(data.updatedAt).toLocaleString()}` : "No content saved yet"}
        </p>
      </header>
      <div className="space-y-6 px-5 py-6 lg:px-8">
        <section className="rounded-xl border bg-surface p-4 text-sm sm:p-5">
          <p className="font-medium">Storage</p>
          <p className="mt-1 text-muted-foreground">{storageText[storage]}</p>
          {storage !== "none" && !filled && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
              The store is empty, so the site has no content. Upload your content file under{" "}
              <Link href="/admin/backup" className="font-medium underline underline-offset-2">
                Backup
              </Link>{" "}
              and your photos under{" "}
              <Link href="/admin/media" className="font-medium underline underline-offset-2">
                Photos
              </Link>
              .
            </p>
          )}
        </section>

        <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/cv" className="group rounded-xl border bg-surface p-4 transition-colors hover:border-border-strong">
            <p className="flex items-center justify-between text-sm font-medium">
              CV builder <ArrowRight className="size-3.5 text-subtle-foreground group-hover:text-foreground" />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Choose what the PDF resumes contain.</p>
          </Link>
          {sections.map((s) => (
            <Link
              key={s.key}
              href={`/admin/content/${s.key}`}
              className="group rounded-xl border bg-surface p-4 transition-colors hover:border-border-strong"
            >
              <p className="flex items-center justify-between text-sm font-medium">
                <span>
                  {s.title}
                  {s.list && <span className="ml-2 font-mono text-xs font-normal text-subtle-foreground">{count(s.key)}</span>}
                </span>
                <ArrowRight className="size-3.5 text-subtle-foreground group-hover:text-foreground" />
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
