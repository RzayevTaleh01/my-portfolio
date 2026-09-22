import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { TimelineDot } from "@/components/timeline";
import type { Experience, ExperienceRole, RoleProject, Volunteering } from "@/content";
import { localize, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
      {items.map((h) => (
        <li key={h} className="flex gap-2.5">
          <span className="mt-[9px] size-1 shrink-0 rounded-full bg-border-strong" />
          {h}
        </li>
      ))}
    </ul>
  );
}

function CredentialLink({ label, href, note }: { label: string; href: string; note: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${note}: ${label}`}
      className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
    >
      {label} <ArrowUpRight className="size-3.5" />
    </a>
  );
}

function Projects({ items, lang }: { items: RoleProject[]; lang: Locale }) {
  const t = getDictionary(lang).experience;
  return (
    <ul className="space-y-3 text-sm leading-relaxed">
      {items.map((p) => (
        <li key={p.name} className="flex gap-2.5">
          <span className="mt-[9px] size-1 shrink-0 rounded-full bg-border-strong" />
          <div className="min-w-0">
            <p className="flex flex-wrap items-baseline gap-x-2.5">
              <span className="font-medium">{p.name}</span>
              {p.slug && (
                <Link
                  href={localize(lang, `/projects/${p.slug}`)}
                  className="inline-flex items-center gap-0.5 text-[13px] font-medium text-accent hover:underline"
                >
                  {t.viewProject} <ArrowRight className="size-3" />
                </Link>
              )}
            </p>
            <p className="text-muted-foreground">{p.detail}</p>
            {p.points && p.points.length > 0 && (
              <ul className="mt-1.5 space-y-1 text-muted-foreground">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="mt-[11px] h-px w-2 shrink-0 bg-border-strong" />
                    {pt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Role({ role, lang, showPeriod }: { role: ExperienceRole; lang: Locale; showPeriod: boolean }) {
  const t = getDictionary(lang).experience;
  return (
    <div className="space-y-2.5">
      <div>
        <h4 className="text-[15px] font-semibold tracking-tight">{role.title}</h4>
        <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          {showPeriod && (
            <>
              <span className="font-mono">{role.period}</span>
              <span aria-hidden>·</span>
            </>
          )}
          <span>{t.kinds[role.kind]}</span>
        </p>
      </div>
      <p className="text-sm leading-relaxed">{role.summary}</p>
      {role.highlights && role.highlights.length > 0 && <Bullets items={role.highlights} />}
      {role.projects && role.projects.length > 0 && <Projects items={role.projects} lang={lang} />}
      {role.stack && <p className="text-xs leading-relaxed text-subtle-foreground">{role.stack.join(" · ")}</p>}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {role.caseStudy && (
          <Link
            href={localize(lang, `/projects/${role.caseStudy}`)}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline"
          >
            {t.caseStudy} <ArrowRight className="size-3.5" />
          </Link>
        )}
        {role.credential && <CredentialLink {...role.credential} note={t.credential} />}
      </div>
    </div>
  );
}

export function ExperienceItem({ item, lang }: { item: Experience; lang: Locale }) {
  const single = item.roles.length === 1;

  return (
    <article className="relative space-y-3 break-inside-avoid">
      <TimelineDot />
      <div>
        <h3 className="font-semibold tracking-tight">{item.organization}</h3>
        <p className="text-xs text-muted-foreground">
          <span className="font-mono">{item.period}</span> · {item.location}
        </p>
      </div>

      {single ? (
        <Role role={item.roles[0]} lang={lang} showPeriod={false} />
      ) : (
        <ol className="space-y-6 border-l pl-5">
          {item.roles.map((role) => (
            <li key={role.title} className="relative">
              <span className="absolute -left-[23px] top-[7px] size-1.5 rounded-full bg-border-strong" />
              <Role role={role} lang={lang} showPeriod />
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

export function VolunteeringItem({ item, lang }: { item: Volunteering; lang: Locale }) {
  const t = getDictionary(lang).experience;
  return (
    <article className="relative space-y-2.5 break-inside-avoid">
      <TimelineDot />
      <div>
        <h3 className="font-semibold tracking-tight">{item.organization}</h3>
        <p className="text-xs text-muted-foreground">
          <span className="font-mono">{item.period}</span> · {item.location}
        </p>
      </div>
      <h4 className="text-[15px] font-semibold tracking-tight">{item.role}</h4>
      <p className="text-sm leading-relaxed">{item.summary}</p>
      {item.highlights && item.highlights.length > 0 && <Bullets items={item.highlights} />}
      {item.stack && <p className="text-xs leading-relaxed text-subtle-foreground">{item.stack.join(" · ")}</p>}
      {item.credential && <CredentialLink {...item.credential} note={t.credential} />}
    </article>
  );
}
