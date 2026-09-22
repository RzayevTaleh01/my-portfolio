import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion";
import { PageHeader } from "@/components/section";
import { WritingFilter } from "@/components/writing-filter";
import { hasLocale } from "@/i18n/config";
import { getSiteTexts } from "@/lib/site/site-texts";
import { JsonLd } from "@/components/json-ld";
import { getContent } from "@/content";
import { getAllPosts } from "@/lib/posts";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, listSchema } from "@/lib/structured-data";

export async function generateMetadata(props: PageProps<"/[lang]/writing">): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const t = (await getSiteTexts(lang)).writing;
  const { profile } = await getContent(lang);
  return pageMetadata({ lang, path: "/writing", title: t.title, description: t.description, profile });
}

export default async function WritingPage(props: PageProps<"/[lang]/writing">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const texts = await getSiteTexts(lang);
  const t = texts.writing;
  const { profile } = await getContent(lang);
  const posts = await getAllPosts(lang);

  return (
    <div>
      <JsonLd
        data={[
          listSchema(profile, lang, t.title, posts.map((p) => ({ title: p.title, path: `/writing/${p.slug}` }))),
          breadcrumbSchema(profile, lang, [
            { name: texts.nav.home, path: "/" },
            { name: t.title, path: "/writing" },
          ]),
        ]}
      />
      <PageHeader title={t.title} description={t.description} />
      <Reveal>
        <WritingFilter posts={posts} lang={lang} />
      </Reveal>
    </div>
  );
}
