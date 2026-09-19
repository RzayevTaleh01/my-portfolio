import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/content";
import { localize, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

export function ProjectMeta({ project, lang, className }: { project: Project; lang: Locale; className?: string }) {
  const t = getDictionary(lang).projects;
  return (
    <p className={cn("flex items-center gap-2 text-xs text-subtle-foreground", className)}>
      <span className={project.kind === "research" ? "font-medium text-accent" : "font-medium"}>{t.kind[project.kind]}</span>
      <span aria-hidden>·</span>
      <span>{project.year}</span>
    </p>
  );
}

/** Case-study card - the whole card links to the detail page. */
export function ProjectCard({ project, lang }: { project: Project; lang: Locale }) {
  return (
    <Link
      href={localize(lang, `/projects/${project.slug}`)}
      className="group flex h-full flex-col rounded-xl border bg-surface p-5 transition-colors hover:border-border-strong"
    >
      <ProjectMeta project={project} lang={lang} className="mb-3" />
      <h3 className="mb-1.5 text-[17px] font-semibold tracking-tight">{project.title}</h3>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
      <div className="mt-auto flex items-end justify-between gap-4">
        <div className="flex flex-wrap gap-1">
          {project.stack
            .flatMap((g) => g.items)
            .slice(0, 4)
            .map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
        </div>
        <ArrowRight className="size-4 shrink-0 text-subtle-foreground transition-colors group-hover:text-foreground" />
      </div>
    </Link>
  );
}

/** Compact row version used on the home page. */
export function ProjectRow({ project, lang }: { project: Project; lang: Locale }) {
  const t = getDictionary(lang).projects;
  return (
    <Link
      href={localize(lang, `/projects/${project.slug}`)}
      className="group grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h3 className="font-semibold tracking-tight transition-colors group-hover:text-accent">{project.title}</h3>
          <ProjectMeta project={project} lang={lang} />
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
      </div>
      <span className="hidden items-center gap-1 text-[13px] text-subtle-foreground transition-colors group-hover:text-foreground sm:inline-flex">
        {t.caseStudy} <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}
