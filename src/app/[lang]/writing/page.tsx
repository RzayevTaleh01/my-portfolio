import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import { PageHeader } from "@/components/section";
import { WritingFilter } from "@/components/writing-filter";
import { hasLocale } from "@/i18n/config";
import { getSiteTexts } from "@/lib/site/site-texts";
import { getAllPosts } from "@/lib/posts";

export async function generateMetadata(props: PageProps<"/[lang]/writing">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const t = (await getSiteTexts(lang)).writing;
  return { title: t.title, description: t.description };
}

export default async function WritingPage(props: PageProps<"/[lang]/writing">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const t = (await getSiteTexts(lang)).writing;

  return (
    <div>
      <PageHeader title={t.title} description={t.description} />
      <Reveal>
        <WritingFilter posts={await getAllPosts(lang)} lang={lang} />
      </Reveal>
    </div>
  );
}
