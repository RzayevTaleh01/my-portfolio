"use client";

import { Check, ChevronRight, Copy } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { TextLink } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import type { Publication, PublicationType } from "@/content";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<PublicationType, string> = {
  journal: "Journal",
  conference: "Conference",
  workshop: "Workshop",
  preprint: "Preprint",
  thesis: "Thesis",
};

const STATUS_LABEL = { accepted: "Accepted", "under-review": "Under review" } as const;

const LINK_LABEL = {
  pdf: "PDF",
  arxiv: "arXiv",
  doi: "DOI",
  code: "Code",
  slides: "Slides",
  project: "Project",
} as const;

function Authors({ authors, highlight }: { authors: string[]; highlight: string }) {
  return (
    <>
      {authors.map((a, i) => (
        <Fragment key={`${a}-${i}`}>
          {i > 0 && ", "}
          <span className={cn(a === highlight && "font-medium text-foreground underline decoration-border underline-offset-2")}>
            {a}
          </span>
        </Fragment>
      ))}
    </>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="absolute right-2 top-2 flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function PublicationItem({ pub, highlight }: { pub: Publication; highlight: string }) {
  const [panel, setPanel] = useState<"abstract" | "bibtex" | null>(null);
  const toggle = (p: "abstract" | "bibtex") => setPanel((cur) => (cur === p ? null : p));
  const links = Object.entries(pub.links ?? {}).filter(([, href]) => Boolean(href)) as [
    keyof typeof LINK_LABEL,
    string,
  ][];

  return (
    <article className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {pub.venueShort && <Badge variant="solid">{pub.venueShort} {pub.year}</Badge>}
        <Badge variant="outline">{TYPE_LABEL[pub.type]}</Badge>
        {pub.status !== "published" && <Badge>{STATUS_LABEL[pub.status]}</Badge>}
      </div>
      <h3 className="font-medium leading-snug">{pub.title}</h3>
      <p className="text-sm text-muted-foreground">
        <Authors authors={pub.authors} highlight={highlight} />
      </p>
      <p className="text-sm italic text-muted-foreground">
        {pub.venue}, {pub.year}
        {pub.note && <span className="not-italic"> · {pub.note}</span>}
      </p>

      {(links.length > 0 || pub.abstract || pub.bibtex) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
          {pub.abstract && (
            <PanelToggle open={panel === "abstract"} onClick={() => toggle("abstract")}>
              Abstract
            </PanelToggle>
          )}
          {pub.bibtex && (
            <PanelToggle open={panel === "bibtex"} onClick={() => toggle("bibtex")}>
              BibTeX
            </PanelToggle>
          )}
          {links.map(([key, href]) => (
            <TextLink key={key} href={href}>
              {LINK_LABEL[key]}
            </TextLink>
          ))}
        </div>
      )}

      {panel === "abstract" && pub.abstract && (
        <p className="rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">{pub.abstract}</p>
      )}
      {panel === "bibtex" && pub.bibtex && (
        <div className="relative">
          <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 pr-20 font-mono text-xs leading-relaxed">
            {pub.bibtex}
          </pre>
          <CopyButton text={pub.bibtex} />
        </div>
      )}
    </article>
  );
}

function PanelToggle({ open, onClick, children }: { open: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      className="inline-flex items-center gap-0.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
    >
      <ChevronRight className={cn("size-3.5 transition-transform", open && "rotate-90")} />
      {children}
    </button>
  );
}

/** Filterable publication list, grouped by year. */
export function PublicationList({ publications, highlight }: { publications: Publication[]; highlight: string }) {
  const types = useMemo(
    () => (Object.keys(TYPE_LABEL) as PublicationType[]).filter((t) => publications.some((p) => p.type === t)),
    [publications],
  );
  const [filter, setFilter] = useState<PublicationType | "all">("all");
  const visible = filter === "all" ? publications : publications.filter((p) => p.type === filter);
  const years = [...new Set(visible.map((p) => p.year))].sort((a, b) => b - a);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter publications">
        {(["all", ...types] as const).map((t) => {
          const count = t === "all" ? publications.length : publications.filter((p) => p.type === t).length;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={filter === t}
              onClick={() => setFilter(t)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-[13px] transition-colors",
                filter === t ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t === "all" ? "All" : TYPE_LABEL[t]} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-10">
        {years.map((year) => (
          <div key={year} className="grid gap-6 sm:grid-cols-[4rem_1fr]">
            <div className="font-mono text-sm text-muted-foreground">{year}</div>
            <div className="space-y-8">
              {visible
                .filter((p) => p.year === year)
                .map((p) => (
                  <PublicationItem key={p.id} pub={p} highlight={highlight} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
