import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { ogContentType, ogImage, ogPhoto, ogSize } from "@/lib/og";
import { getPost } from "@/lib/posts";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Article";

export default async function Image(props: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await props.params;
  const locale = hasLocale(lang) ? lang : "en";
  const post = await getPost(slug, locale);
  if (!post) notFound();
  const { profile } = await getContent(locale);
  return ogImage({ label: post.category, title: post.title, subtitle: post.summary, footer: profile.websiteLabel || profile.name, photo: await ogPhoto() });
}
