"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { PostList } from "@/components/post-list";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { PostCategory, PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";

/** Underlined tabs: the active tab gets an accent line that slides between tabs. */
export function WritingFilter({ posts, lang }: { posts: PostMeta[]; lang: Locale }) {
  const t = getDictionary(lang).writing;
  const [filter, setFilter] = useState<PostCategory | "all">("all");
  const visible = filter === "all" ? posts : posts.filter((p) => p.category === filter);
  const options = ["all", "engineering", "research"] as const;

  return (
    <div>
      <div className="flex gap-6 border-b" role="tablist">
        {options.map((o) => {
          const active = filter === o;
          const count = o === "all" ? posts.length : posts.filter((p) => p.category === o).length;
          return (
            <button
              key={o}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(o)}
              className={cn(
                "relative -mb-px flex items-center gap-1.5 pb-3 pt-1 text-sm transition-colors",
                active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {o === "all" ? t.all : t.category[o]}
              <span
                className={cn(
                  "rounded px-1.5 py-px text-[11px] tabular-nums",
                  active ? "bg-accent-soft text-accent" : "bg-muted text-subtle-foreground",
                )}
              >
                {count}
              </span>
              {active && (
                <motion.span
                  layoutId="writing-tab"
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <PostList posts={visible} lang={lang} />
    </div>
  );
}
