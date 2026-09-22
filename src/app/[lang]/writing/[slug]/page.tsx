import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/components/mdx";
import { CategoryBadge } from "@/components/post-list";
import { fmt, hasLocale, localize, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getAllPosts, getPost } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const all = await Promise.all(locales.map(async (lang) => (await getAllPosts(lang)).map((post) => ({ lang, slug: post.slug }))));
  return all.flat();
}

export async function generateMetadata(props: PageProps<"/[lang]/writing/[slug]">): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (!hasLocale(lang)) return {};
  const post = await getPost(slug, lang);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date },
  };
}

export default async function PostPage(props: PageProps<"/[lang]/writing/[slug]">) {
  const { lang, slug } = await props.params;
  if (!hasLocale(lang)) notFound();
  const post = await getPost(slug, lang);
  if (!post) notFound();
  const t = getDictionary(lang).writing;

  return (
    <article lang={post.locale}>
      <Link
        href={localize(lang, "/writing")}
        className="no-print mb-10 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> {t.back}
      </Link>

      <header className="mb-12 space-y-4 border-b pb-10">
        <div className="flex items-center gap-2">
          <CategoryBadge category={post.category} lang={lang} />
          <span className="text-xs text-subtle-foreground">{fmt(t.minRead, { count: post.minutes })}</span>
        </div>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="text-[17px] leading-relaxed text-muted-foreground">{post.summary}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1 text-[13px] text-subtle-foreground">
          <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </header>

      <div className="prose max-w-none prose-headings:scroll-mt-24 prose-p:leading-[1.8]">
        <Mdx source={post.content} lang={lang} />
      </div>
    </article>
  );
}
