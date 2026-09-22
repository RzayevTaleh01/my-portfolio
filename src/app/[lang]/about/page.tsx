import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/section";
import { getContent, withRegion } from "@/content";
import { fmt, hasLocale } from "@/i18n/config";
import { JsonLd } from "@/components/json-ld";
import { getDictionary } from "@/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, personId } from "@/lib/structured-data";
import { getRegion } from "@/lib/region";

export async function generateMetadata(props: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).about;
  const content = await getContent(lang);
  return pageMetadata({
    lang,
    path: "/about",
    title: t.title,
    description: fmt(t.description, { name: content.profile.name }),
    profile: content.profile,
    type: "profile",
  });
}

export default async function AboutPage(props: PageProps<"/[lang]/about">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const content = await getContent(lang);
  const profile = withRegion(content, await getRegion());
  const t = getDictionary(lang);

  return (
    <div>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: t.about.title,
            description: profile.intro,
            mainEntity: { "@id": personId(profile) },
          },
          breadcrumbSchema(profile, lang, [
            { name: t.nav.home, path: "/" },
            { name: t.about.title, path: "/about" },
          ]),
        ]}
      />
      <PageHeader title={t.about.title} />
      <div className="-mt-4 max-w-2xl space-y-4 text-[15px] leading-relaxed">
        {profile.bio.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}
