import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostList } from "@/components/post-list";
import { ProjectCard } from "@/components/project/project-card";
import { PublicationList } from "@/components/publication";
import { PageHeader, Section } from "@/components/section";
import { getContent } from "@/content";
import { hasLocale, localize } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts } from "@/lib/posts";
import { sortPublications } from "@/lib/utils";

export async function generateMetadata(props: PageProps<"/[lang]/research">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  return { title: getDictionary(lang).research.title, description: (await getContent(lang)).researchStatement };
}

export default async function ResearchPage(props: PageProps<"/[lang]/research">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const { profile, projects, publications, researchDirections, researchStatement, getProject } = await getContent(lang);
  const systems = projects.filter((p) => p.kind === "research");
  const articles = await (await getAllPosts(lang)).filter((p) => p.category === "research");

  return (
    <div className="space-y-20">
      <PageHeader title={t.research.title} description={researchStatement} />

      <Section id="directions" title={t.research.directions}>
        <ol className="space-y-3">
          {researchDirections.map((d, i) => (
            <li key={d.title} className="grid gap-3 rounded-xl border bg-surface p-5 sm:grid-cols-[28px_1fr]">
              <span className="font-mono text-sm text-subtle-foreground">{i + 1}</span>
              <div className="space-y-2">
                <h3 className="font-semibold tracking-tight">{d.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{d.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {d.methods.map((m) => (
                      <span key={m} className="rounded-md bg-muted px-2 py-1 text-xs leading-none text-muted-foreground">
                        {m}
                      </span>
                    ))}
                  </div>
                  {d.projects.length > 0 && (
                    <p className="text-xs text-subtle-foreground">
                      {t.research.in}{" "}
                      {d.projects.map((slug, j) => {
                        const p = getProject(slug);
                        if (!p) return null;
                        return (
                          <span key={slug}>
                            {j > 0 && ", "}
                            <Link
                              href={localize(lang, `/projects/${slug}`)}
                              className="text-muted-foreground underline decoration-border-strong underline-offset-4 hover:text-foreground"
                            >
                              {p.title}
                            </Link>
                          </span>
                        );
                      })}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="systems" title={t.research.projects}>
        <div className="grid gap-3 sm:grid-cols-2">
          {systems.map((p) => (
            <ProjectCard key={p.slug} project={p} lang={lang} />
          ))}
        </div>
      </Section>

      {articles.length > 0 && (
        <Section id="articles" title={t.research.articles} href={localize(lang, "/writing")} linkLabel={t.home.allArticles}>
          <PostList posts={articles} lang={lang} />
        </Section>
      )}

      {publications.length > 0 && (
        <Section id="publications" title={t.research.publications}>
          <PublicationList publications={sortPublications(publications)} highlight={profile.authorName} />
        </Section>
      )}
    </div>
  );
}
