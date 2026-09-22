import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import { PageHeader } from "@/components/section";
import { getContent } from "@/content";
import { fmt, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(props: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).privacy;
  const { profile } = await getContent(lang);
  return { ...pageMetadata({ lang, path: "/privacy", title: t.title, description: t.description, profile }), robots: { index: false, follow: true } };
}

function WithEmail({ text, email }: { text: string; email?: string }) {
  const parts = text.split("{email}");
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 &&
        (email ? (
          <a href={`mailto:${email}`} className="underline decoration-border-strong underline-offset-4 hover:decoration-foreground">
            {email}
          </a>
        ) : (
          "-"
        ))}
    </Fragment>
  ));
}

export default async function PrivacyPage(props: PageProps<"/[lang]/privacy">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).privacy;
  const { profile } = await getContent(lang);
  const text = (s: string) => <WithEmail text={fmt(s, { name: profile.name })} email={profile.email} />;

  return (
    <div>
      <PageHeader title={t.title} />
      <div className="-mt-4 max-w-2xl space-y-8 text-[15px] leading-relaxed">
        <p className="text-sm text-muted-foreground">{t.updated}</p>
        {t.sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p}>{text(p)}</p>
            ))}
            {section.items.length > 0 && (
              <ul className="list-disc space-y-1.5 pl-5 marker:text-subtle-foreground">
                {section.items.map((item) => (
                  <li key={item}>{text(item)}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
