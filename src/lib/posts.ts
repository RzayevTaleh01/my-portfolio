import "server-only";
import readingTime from "reading-time";
import { getContent } from "@/content";
import type { Locale } from "@/i18n/config";
import type { PostCategory } from "@/lib/site/data";

export type { PostCategory };

export interface PostMeta {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: PostCategory;
  tags: string[];
  minutes: number;
  draft: boolean;
  locale: Locale;
}

export interface Post extends PostMeta {
  content: string;
}

const visible = (post: { draft: boolean }) => process.env.NODE_ENV === "development" || !post.draft;

async function allPosts(locale: Locale): Promise<Post[]> {
  const { posts } = await getContent(locale);
  return posts
    .filter((p) => p.slug && visible(p))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      summary: p.summary,
      date: p.date,
      category: p.category,
      tags: p.tags ?? [],
      draft: p.draft === true,
      minutes: Math.max(1, Math.round(readingTime(p.body).minutes)),
      locale: p.locale,
      content: p.body,
    }))
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getPost(slug: string, locale: Locale): Promise<Post | null> {
  return (await allPosts(locale)).find((p) => p.slug === slug) ?? null;
}

export async function getAllPosts(locale: Locale): Promise<PostMeta[]> {
  return (await allPosts(locale)).map((post) => {
    const meta: Partial<Post> = { ...post };
    delete meta.content;
    return meta as PostMeta;
  });
}
