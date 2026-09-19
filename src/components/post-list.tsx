import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { fmt, localize, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { PostCategory, PostMeta } from "@/lib/posts";
import { cn, formatDate } from "@/lib/utils";

export function CategoryBadge({ category, lang }: { category: PostCategory; lang: Locale }) {
  const label = getDictionary(lang).writing.category[category];
  return <Badge variant={category === "research" ? "accent" : "outline"}>{label}</Badge>;
}

export function PostList({ posts, lang, className }: { posts: PostMeta[]; lang: Locale; className?: string }) {
  const t = getDictionary(lang).writing;
  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">{t.empty}</p>;
  }
  return (
    <ul className={cn("divide-y border-y", className)}>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={localize(lang, `/writing/${post.slug}`)}
            className="group grid gap-1 py-5 sm:grid-cols-[120px_1fr_auto] sm:gap-6"
          >
            <time dateTime={post.date} className="pt-1 font-mono text-xs text-subtle-foreground">
              {formatDate(post.date, lang)}
            </time>
            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={post.category} lang={lang} />
                <span className="text-xs text-subtle-foreground">{fmt(t.minRead, { count: post.minutes })}</span>
                {post.locale !== lang && (
                  <span className="text-xs uppercase text-subtle-foreground">{post.locale}</span>
                )}
              </div>
              <h3 className="font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent">
                {post.title}
                {post.draft && <span className="ml-2 text-xs font-normal text-subtle-foreground">({t.draft})</span>}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{post.summary}</p>
            </div>
            <ArrowRight className="mt-1.5 hidden size-4 text-subtle-foreground transition-colors group-hover:text-foreground sm:block" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
