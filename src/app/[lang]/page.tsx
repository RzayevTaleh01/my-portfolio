import { ArrowRight, BrainCircuit, Code2, FileText, Mail } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceItem } from "@/components/experience-item";
import { PostList } from "@/components/post-list";
import { ProjectRow } from "@/components/project/project-card";
import { Section } from "@/components/section";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { getContent } from "@/content";
import { fmt, hasLocale, localize } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts } from "@/lib/posts";

export default async function HomePage(props: PageProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();

  const t = getDictionary(lang);
  const { profile, experience, skills, projects, researchStatement, researchDirections } = getContent(lang);
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const posts = getAllPosts(lang).slice(0, 3);
  const engCount = projects.filter((p) => p.category === "engineering").length;
  const aiCount = projects.filter((p) => p.category === "ai").length;

  const tracks = [
    {
      icon: Code2,
      title: t.home.engineeringTitle,
      text: t.home.engineeringText,
      meta: fmt(t.home.engineeringMeta, { count: engCount }),
      href: localize(lang, "/projects#engineering"),
    },
    {
      icon: BrainCircuit,
      title: t.home.researchTitle,
      text: researchDirections.map((d) => d.title).join(" · "),
      meta: fmt(t.home.researchMeta, { count: aiCount }),
      href: localize(lang, "/research"),
    },
  ];

  return (
    <div className="space-y-20">
      {/* Intro */}
      <section className="space-y-6">
        <h1 className="text-[26px] font-semibold leading-snug tracking-tight sm:text-[32px]">
          {fmt(t.home.greeting, { name: profile.name })}
          <br />
          <span className="text-muted-foreground">{t.home.role}</span>
        </h1>
        <p className="max-w-xl text-[16px] leading-relaxed text-muted-foreground">{profile.intro}</p>
        <ul className="flex flex-wrap gap-2">
          {profile.highlights.map((h) => (
            <li key={h} className="rounded-md border px-2.5 py-1 text-[13px] text-muted-foreground">
              {h}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild>
            <Link href={localize(lang, "/cv")}>
              <FileText className="size-4" /> {t.home.viewCv}
            </Link>
          </Button>
          {profile.email && (
            <Button asChild variant="outline">
              <a href={`mailto:${profile.email}`}>
                <Mail className="size-4" /> {t.home.contact}
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Two tracks */}
      <div className="grid gap-3 sm:grid-cols-2">
        {tracks.map(({ icon: Icon, ...track }) => (
          <Link
            key={track.title}
            href={track.href}
            className="group flex flex-col rounded-xl border bg-surface p-5 transition-colors hover:border-border-strong"
          >
            <Icon className="mb-4 size-5 text-accent" strokeWidth={1.7} />
            <h2 className="mb-1.5 font-semibold tracking-tight">{track.title}</h2>
            <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{track.text}</p>
            <span className="mt-auto inline-flex items-center gap-1 text-[13px] text-subtle-foreground transition-colors group-hover:text-foreground">
              {track.meta} <ArrowRight className="size-3.5" />
            </span>
          </Link>
        ))}
      </div>

      <Section id="experience" title={t.home.experience}>
        <Timeline>
          {experience.map((e) => (
            <ExperienceItem key={`${e.organization}-${e.period}`} item={e} lang={lang} />
          ))}
        </Timeline>
      </Section>

      <Section id="skills" title={t.home.skills}>
        <dl className="space-y-4">
          {skills.map((g) => (
            <div key={g.title} className="grid gap-2 sm:grid-cols-[150px_1fr] sm:gap-6">
              <dt className="pt-1 text-sm font-medium">{g.title}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <span key={s} className="rounded-md bg-muted px-2 py-1 text-[13px] leading-none text-muted-foreground">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="projects" title={t.home.projects} href={localize(lang, "/projects")} linkLabel={t.home.allProjects}>
        <div className="-mt-2 divide-y">
          {featured.map((p) => (
            <ProjectRow key={p.slug} project={p} lang={lang} />
          ))}
        </div>
      </Section>

      <Section id="research" title={t.home.research} href={localize(lang, "/research")} linkLabel={t.home.research}>
        <p className="-mt-1 mb-5 max-w-xl text-[15px] leading-relaxed">{researchStatement}</p>
        <ul className="grid gap-3 sm:grid-cols-3">
          {researchDirections.map((d) => (
            <li key={d.title} className="rounded-xl border bg-surface p-4">
              <p className="text-sm font-semibold tracking-tight">{d.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{d.methods.join(" · ")}</p>
            </li>
          ))}
        </ul>
      </Section>

      {posts.length > 0 && (
        <Section id="articles" title={t.home.articles} href={localize(lang, "/writing")} linkLabel={t.home.allArticles}>
          <PostList posts={posts} lang={lang} />
        </Section>
      )}
    </div>
  );
}
