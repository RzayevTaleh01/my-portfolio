import { getContent } from "@/content";
import { hasLocale, localize, locales } from "@/i18n/config";
import { getAllPosts } from "@/lib/posts";
import { absolute, clamp } from "@/lib/seo";
import { getSiteTexts } from "@/lib/site/site-texts";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(_request: Request, ctx: RouteContext<"/[lang]/feed.xml">) {
  const { lang } = await ctx.params;
  if (!hasLocale(lang)) return new Response("Not found", { status: 404 });

  const { profile } = await getContent(lang);
  const t = (await getSiteTexts(lang)).writing;
  const posts = await getAllPosts(lang);
  const self = absolute(profile, localize(lang, "/feed.xml"));

  const items = posts
    .map((post) => {
      const url = absolute(profile, localize(lang, `/writing/${post.slug}`));
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(clamp(post.summary, 400))}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${escape(post.category)}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${profile.name} - ${t.title}`)}</title>
    <link>${absolute(profile, localize(lang, "/writing"))}</link>
    <description>${escape(clamp(t.description, 400))}</description>
    <language>${lang}</language>
    <managingEditor>${escape(profile.email ?? "")} (${escape(profile.name)})</managingEditor>
    <lastBuildDate>${new Date(posts[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=3600" },
  });
}
