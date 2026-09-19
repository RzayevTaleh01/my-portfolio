import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { PrintButton } from "@/components/print-button";
import { getContent } from "@/content";
import { fmt, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { withRegion } from "@/content/locations";
import { getRegion } from "@/lib/region";
import { sortPublications } from "@/lib/utils";

export async function generateMetadata(props: PageProps<"/[lang]/cv">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).cv;
  return { title: t.title, description: fmt(t.description, { name: getContent(lang).profile.name }) };
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid-page space-y-5 pt-4 print:pt-2">
      <h2 className="border-b pb-3 text-lg font-semibold tracking-tight print:text-black">{title}</h2>
      {children}
    </section>
  );
}

function Row({ when, children }: { when: string; children: React.ReactNode }) {
  return (
    <div className="grid break-inside-avoid gap-1 sm:grid-cols-[150px_1fr] sm:gap-6 print:grid-cols-[120px_1fr] print:gap-4">
      <p className="font-mono text-xs leading-6 text-muted-foreground">{when}</p>
      <div className="text-sm leading-6">{children}</div>
    </div>
  );
}

export default async function CvPage(props: PageProps<"/[lang]/cv">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).cv;
  const content = getContent(lang);
  const { experience, education, skills, publications, certificates, languages } = content;
  const profile = withRegion(content.profile, lang, await getRegion());
  const links = profile.socials.filter((s) => s.platform !== "email");

  return (
    <div className="space-y-8 print:space-y-5 print:text-black">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.headline}</p>
          <p className="text-sm text-muted-foreground">
            {profile.email && <a href={`mailto:${profile.email}`}>{profile.email}</a>}
            {" · "}
            {profile.location}
            {links.map((s) => (
              <Fragment key={s.href}>
                {" · "}
                <a href={s.href} className="underline decoration-border-strong underline-offset-4">
                  {s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </Fragment>
            ))}
          </p>
        </div>
        <PrintButton pdf={profile.cvPdf} labels={{ pdf: t.pdf, print: t.print }} />
      </header>

      <CvSection title={t.profile}>
        <p className="text-sm leading-6">{profile.intro}</p>
      </CvSection>

      <CvSection title={t.experience}>
        {experience.map((e) => (
          <Row key={`${e.organization}-${e.role}`} when={e.period}>
            <p className="font-medium">
              {e.role} · {e.organization}
            </p>
            <p className="text-muted-foreground">{e.summary}</p>
            {e.stack && <p className="text-xs text-subtle-foreground">{e.stack.join(", ")}</p>}
          </Row>
        ))}
      </CvSection>

      <CvSection title={t.education}>
        {education.map((e) => (
          <Row key={e.institution} when={e.period}>
            <p className="font-medium">
              {e.degree} - {e.field}
            </p>
            <p className="text-muted-foreground">
              {e.institution}, {e.location}
            </p>
          </Row>
        ))}
      </CvSection>

      <CvSection title={t.skills}>
        {skills.map((g) => (
          <Row key={g.title} when={g.title}>
            {g.skills.join(", ")}
          </Row>
        ))}
      </CvSection>

      {publications.length > 0 && (
        <CvSection title={t.publications}>
          <ol className="space-y-3">
            {sortPublications(publications).map((p) => (
              <li key={p.id} className="break-inside-avoid text-sm leading-6">
                {p.authors.map((a, i) => (
                  <Fragment key={`${a}-${i}`}>
                    {i > 0 && ", "}
                    {a === profile.authorName ? <strong className="font-semibold">{a}</strong> : a}
                  </Fragment>
                ))}
                . <span className="font-medium">{p.title}</span>. <span className="italic">{p.venue}</span>, {p.year}.
              </li>
            ))}
          </ol>
        </CvSection>
      )}

      <CvSection title={t.certificates}>
        {certificates.map((c) => (
          <Row key={c.title} when={c.issuer}>
            {c.title}
          </Row>
        ))}
      </CvSection>

      <CvSection title={t.languages}>
        {languages.map((l) => (
          <Row key={l.name} when={l.name}>
            {l.level}
          </Row>
        ))}
      </CvSection>
    </div>
  );
}
