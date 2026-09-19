import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";

/**
 * Articles live in content/posts:
 *   my-post.mdx      English (required)
 *   my-post.az.mdx   Azerbaijani translation (optional)
 *   my-post.sk.mdx   Slovak translation (optional)
 * A missing translation falls back to English.
 */
const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostCategory = "engineering" | "research";

export interface PostMeta {
  slug: string;
  title: string;
  summary: string;
  date: string;
  category: PostCategory;
  tags: string[];
  minutes: number;
  draft: boolean;
  /** Language the post is actually shown in (differs from the page when it falls back). */
  locale: Locale;
}

export interface Post extends PostMeta {
  content: string;
}

function parse(file: string, slug: string, locale: Locale): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  for (const key of ["title", "summary", "date", "category"] as const) {
    if (!data[key]) throw new Error(`Post "${file}" is missing required frontmatter field "${key}".`);
  }
  if (data.category !== "engineering" && data.category !== "research") {
    throw new Error(`Post "${file}" has invalid category "${data.category}" (use "engineering" or "research").`);
  }

  return {
    slug,
    title: data.title,
    summary: data.summary,
    // gray-matter parses bare YAML dates into Date objects.
    date: data.date instanceof Date ? data.date.toISOString() : String(data.date),
    category: data.category,
    tags: data.tags ?? [],
    draft: data.draft === true,
    minutes: Math.max(1, Math.round(readingTime(content).minutes)),
    locale,
    content,
  };
}

function findFile(slug: string, locale: Locale): { file: string; locale: Locale } | null {
  const candidates: [string, Locale][] = [];
  if (locale !== defaultLocale) candidates.push([`${slug}.${locale}.mdx`, locale], [`${slug}.${locale}.md`, locale]);
  candidates.push([`${slug}.mdx`, defaultLocale], [`${slug}.md`, defaultLocale]);
  for (const [file, l] of candidates) {
    if (fs.existsSync(path.join(POSTS_DIR, file))) return { file, locale: l };
  }
  return null;
}

/** Base slugs: files without a locale suffix. */
function slugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ""))
    .filter((name) => {
      const suffix = name.split(".").pop() ?? "";
      return !(name.includes(".") && hasLocale(suffix));
    });
}

const visible = (post: Post) => process.env.NODE_ENV === "development" || !post.draft;

export function getPost(slug: string, locale: Locale): Post | null {
  const found = findFile(slug, locale);
  if (!found) return null;
  const post = parse(found.file, slug, found.locale);
  return visible(post) ? post : null;
}

export function getAllPosts(locale: Locale): PostMeta[] {
  return slugs()
    .map((slug) => getPost(slug, locale))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map((post) => {
      const meta: Partial<Post> = { ...post };
      delete meta.content;
      return meta as PostMeta;
    });
}
