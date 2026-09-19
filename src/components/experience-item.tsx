import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TimelineDot } from "@/components/timeline";
import type { Experience } from "@/content";
import { localize, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/** One entry on the experience timeline (render inside <Timeline>). */
export function ExperienceItem({ item, lang }: { item: Experience; lang: Locale }) {
  const t = getDictionary(lang).experience;
  return (
    <article className="relative space-y-2.5">
      <TimelineDot />
      <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
        <span className="font-mono">{item.period}</span>
        <span aria-hidden>·</span>
        <span>{t.kinds[item.kind]}</span>
      </p>
      <div>
        <h3 className="font-semibold tracking-tight">{item.role}</h3>
        <p className="text-sm text-muted-foreground">
          {item.organization} · {item.location}
        </p>
      </div>
      <p className="text-sm leading-relaxed">{item.summary}</p>
      {item.highlights && item.highlights.length > 0 && (
        <ul className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
          {item.highlights.map((h) => (
            <li key={h} className="flex gap-2.5">
              <span className="mt-[9px] size-1 shrink-0 rounded-full bg-border-strong" />
              {h}
            </li>
          ))}
        </ul>
      )}
      {item.stack && <p className="text-xs leading-relaxed text-subtle-foreground">{item.stack.join(" · ")}</p>}
      {item.caseStudy && (
        <Link
          href={localize(lang, `/projects/${item.caseStudy}`)}
          className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline"
        >
          {t.caseStudy} <ArrowRight className="size-3.5" />
        </Link>
      )}
    </article>
  );
}
