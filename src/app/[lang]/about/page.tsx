import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/section";
import { getContent, withRegion } from "@/content";
import { fmt, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getRegion } from "@/lib/region";

export async function generateMetadata(props: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).about;
  return { title: t.title, description: fmt(t.description, { name: (await getContent(lang)).profile.name }) };
}

export default async function AboutPage(props: PageProps<"/[lang]/about">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const profile = withRegion(await getContent(lang), await getRegion());

  return (
    <div>
      <PageHeader title={getDictionary(lang).about.title} />
      <div className="-mt-4 max-w-2xl space-y-4 text-[15px] leading-relaxed">
        {profile.bio.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}
