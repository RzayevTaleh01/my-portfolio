import { GitFork, Star } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GitHubIcon } from "@/components/icons";
import { ProjectCard } from "@/components/project/project-card";
import { ArrowLink, PageHeader, Section } from "@/components/section";
import { Timeline, TimelineDot } from "@/components/timeline";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRepos } from "@/lib/github";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export async function generateMetadata(props: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).projects;
  return { title: t.title, description: t.description };
}

export default async function ProjectsPage(props: PageProps<"/[lang]/projects">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();

  const t = getDictionary(lang).projects;
  const { profile, projects, archive } = getContent(lang);
  const repos = await getRepos(profile.githubUsername);
  const githubUrl = `https://github.com/${profile.githubUsername}`;

  // Display order; a kind with no projects is skipped.
  const groups = (["work", "freelance", "research", "hobby"] as const).map((kind) => ({ kind, ...t.groups[kind] }));

  return (
    <div className="space-y-20">
      <PageHeader title={t.title} description={t.description} />

      {groups.map(({ kind, title, intro }) => {
        const items = projects.filter((p) => p.kind === kind);
        if (items.length === 0) return null;
        return (
          <Section key={kind} id={kind} title={title}>
            <p className="-mt-2 mb-5 text-sm text-muted-foreground">{intro}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((p) => (
                <ProjectCard key={p.slug} project={p} lang={lang} />
              ))}
            </div>
          </Section>
        );
      })}

      <Section id="archive" title={t.archive}>
        <Timeline gap="space-y-8">
          {archive.map((p) => (
            <div key={p.repo} className="relative grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-6">
              <TimelineDot />
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted-foreground">{p.year}</p>
                <p className="mt-1 text-sm font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-0.5 text-xs text-subtle-foreground">{p.stack.join(" · ")}</p>
              </div>
              <div className="flex gap-4 sm:pt-5">
                {p.demo && <ArrowLink href={p.demo}>{t.live}</ArrowLink>}
                <ArrowLink href={p.repo}>{t.code}</ArrowLink>
              </div>
            </div>
          ))}
        </Timeline>
      </Section>

      <Section id="github" title={t.github} href={githubUrl} linkLabel={`@${profile.githubUsername}`}>
        {repos && repos.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {repos.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col rounded-xl border bg-surface p-4 transition-colors hover:border-border-strong"
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <GitHubIcon size={13} className="text-subtle-foreground" />
                  <p className="truncate font-mono text-[13px]">{r.name}</p>
                </div>
                <p className="mb-3 line-clamp-2 text-[13px] text-muted-foreground">{r.description ?? t.noDescription}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle-foreground">
                  {r.language && <span>{r.language}</span>}
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3" /> {r.stars}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="size-3" /> {r.forks}
                  </span>
                  <span className="ml-auto">{formatDate(r.updatedAt, lang)}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <ArrowLink href={githubUrl}>{t.reposError}</ArrowLink>
        )}
      </Section>
    </div>
  );
}
