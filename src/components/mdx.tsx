import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { localize, type Locale } from "@/i18n/config";

const prettyCode: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark" },
  keepBackground: false,
};

/** Internal links in posts are written without a locale ("/projects/x") and prefixed here. */
function anchorFor(lang: Locale) {
  return function Anchor({ href = "", ...props }: React.ComponentProps<"a">) {
    if (href.startsWith("#")) return <a href={href} {...props} />;
    if (href.startsWith("/")) return <Link href={localize(lang, href)} {...props} />;
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  };
}

/** Use inside posts: <Callout>Text</Callout> */
function Callout({ children }: { children: React.ReactNode }) {
  return <div className="not-prose my-6 rounded-lg border bg-muted/40 px-4 py-3 text-sm leading-relaxed">{children}</div>;
}

export function Mdx({ source, lang }: { source: string; lang: Locale }) {
  return (
    <MDXRemote
      source={source}
      components={{ a: anchorFor(lang), Callout }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeSlug, rehypeKatex, [rehypePrettyCode, prettyCode]],
        },
      }}
    />
  );
}
