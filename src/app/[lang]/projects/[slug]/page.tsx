import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GitHubIcon } from "@/components/icons";
import { ArchitectureDiagram } from "@/components/project/architecture";
import { CodeBlock } from "@/components/project/code-block";
import { Formula } from "@/components/project/formula";
import { ProjectMeta } from "@/components/project/project-card";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { getContent } from "@/content";
import { hasLocale, localize, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => getContent(lang).projects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata(props: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (!hasLocale(lang)) return {};
  const project = getContent(lang).getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.tagline };
}

function Bullet() {
  return <span className="mt-[9px] size-1 shrink-0 rounded-full bg-border-strong" />;
}

export default async function ProjectPage(props: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).caseStudy;
  const { projects, getProject } = getContent(lang);
  const project = getProject(slug);
  if (!project) notFound();

  const next = projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length];

  // Only sections with content get a number, so numbering never skips.
  const sections = [
    "overview",
    project.problem?.length ? "problem" : null,
    project.architecture ? "architecture" : null,
    project.components?.length ? "components" : null,
    project.flow?.length ? "flow" : null,
    project.deepDives?.length ? "deep-dives" : null,
    project.decisions?.length ? "decisions" : null,
    "stack",
    project.next?.length ? "next" : null,
  ].filter(Boolean) as string[];
  const n = (id: string) => String(sections.indexOf(id) + 1).padStart(2, "0");

  const { links } = project;

  return (
    <article className="space-y-16">
      <header className="space-y-6">
        <Link
          href={localize(lang, "/projects")}
          className="no-print inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> {t.allProjects}
        </Link>
        <div className="space-y-3">
          <ProjectMeta project={project} lang={lang} />
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
          <p className="max-w-xl text-[16px] leading-relaxed text-muted-foreground">{project.tagline}</p>
        </div>

        {(links.repo || links.docs || links.demo) && (
          <div className="flex flex-wrap gap-2">
            {links.repo && (
              <Button asChild size="sm">
                <a href={links.repo} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon size={14} /> {t.sourceCode}
                </a>
              </Button>
            )}
            {links.docs && (
              <Button asChild size="sm" variant="outline">
                <a href={links.docs} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="size-3.5" /> {t.documentation}
                </a>
              </Button>
            )}
            {links.demo && (
              <Button asChild size="sm" variant="outline">
                <a href={links.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5" /> {t.liveDemo}
                </a>
              </Button>
            )}
          </div>
        )}

        {project.facts && (
          <dl
            className="grid grid-cols-2 overflow-hidden rounded-xl border bg-surface sm:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
            style={{ "--cols": project.facts.length } as React.CSSProperties}
          >
            {project.facts.map((f, i) => (
              <div
                key={f.label}
                className={`space-y-1 p-4 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t sm:border-t-0" : ""} ${i > 0 ? "sm:border-l" : ""}`}
              >
                <dt className="text-xs text-subtle-foreground">{f.label}</dt>
                <dd className="text-sm font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      <Section id="overview" title={t.overview} index={n("overview")}>
        <div className="space-y-4 text-[15px] leading-relaxed">
          {project.overview.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>

      {project.problem?.length ? (
        <Section id="problem" title={t.problem} index={n("problem")}>
          <div className="space-y-4 border-l-2 border-accent/50 pl-5 text-[15px] leading-relaxed text-muted-foreground">
            {project.problem.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Section>
      ) : null}

      {project.architecture && (
        <Section id="architecture" title={t.architecture} index={n("architecture")}>
          <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">{project.architecture.summary}</p>
          <ArchitectureDiagram layers={project.architecture.layers} label={t.architectureLabel} />
        </Section>
      )}

      {project.components?.length ? (
        <Section id="components" title={t.components} index={n("components")}>
          <div className="grid gap-3 sm:grid-cols-2">
            {project.components.map((c) => (
              <div key={c.name} className="flex flex-col rounded-xl border bg-surface p-5">
                <p className="font-semibold tracking-tight">{c.name}</p>
                <p className="mb-3 text-[13px] text-accent">{c.role}</p>
                <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {c.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5">
                      <Bullet />
                      {pt}
                    </li>
                  ))}
                </ul>
                {c.tech && <p className="mt-auto pt-4 font-mono text-[11px] text-subtle-foreground">{c.tech}</p>}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {project.flow?.length ? (
        <Section id="flow" title={t.flow} index={n("flow")}>
          <ol className="relative space-y-5 before:absolute before:bottom-3 before:left-[13px] before:top-3 before:w-px before:bg-border">
            {project.flow.map((s, i) => (
              <li key={`${s.title}-${i}`} className="relative flex gap-4">
                <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border bg-surface font-mono text-[11px] text-muted-foreground">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {project.deepDives?.length ? (
        <Section id="deep-dives" title={t.deepDives} index={n("deep-dives")}>
          <div className="space-y-12">
            {project.deepDives.map((d) => (
              <div key={d.title} className="space-y-4">
                <h3 className="text-[17px] font-semibold tracking-tight">{d.title}</h3>
                {d.body.map((p) => (
                  <p key={p} className="text-[15px] leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
                {d.formula && <Formula tex={d.formula} />}
                {d.code && <CodeBlock {...d.code} />}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {project.decisions?.length ? (
        <Section id="decisions" title={t.decisions} index={n("decisions")}>
          <div className="-mt-2 divide-y">
            {project.decisions.map((d) => (
              <div key={d.title} className="grid gap-1 py-4 sm:grid-cols-[200px_1fr] sm:gap-8">
                <p className="font-medium leading-snug">{d.title}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{d.detail}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section id="stack" title={t.stack} index={n("stack")}>
        <dl className="space-y-3">
          {project.stack.map((g) => (
            <div key={g.group} className="grid gap-2 sm:grid-cols-[120px_1fr] sm:gap-6">
              <dt className="pt-1 text-[13px] text-subtle-foreground">{g.group}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <span key={s} className="rounded-md bg-muted px-2 py-1 text-[13px] leading-none text-muted-foreground">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {project.next?.length ? (
        <Section id="next" title={t.next} index={n("next")}>
          <ul className="space-y-2 text-[15px] leading-relaxed text-muted-foreground">
            {project.next.map((x) => (
              <li key={x} className="flex gap-2.5">
                <Bullet />
                {x}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Link
        href={localize(lang, `/projects/${next.slug}`)}
        className="no-print group flex items-center justify-between gap-6 rounded-xl border bg-surface p-5 transition-colors hover:border-border-strong"
      >
        <div>
          <p className="mb-1 text-xs text-subtle-foreground">{t.nextCaseStudy}</p>
          <p className="text-lg font-semibold tracking-tight">{next.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{next.tagline}</p>
        </div>
        <ArrowRight className="size-5 shrink-0 text-subtle-foreground transition-colors group-hover:text-foreground" />
      </Link>
    </article>
  );
}
