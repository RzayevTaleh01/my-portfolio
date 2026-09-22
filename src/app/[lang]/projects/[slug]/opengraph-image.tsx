import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { ogContentType, ogImage, ogPhoto, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Case study";

export default async function Image(props: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await props.params;
  const content = await getContent(hasLocale(lang) ? lang : "en");
  const project = content.getProject(slug);
  if (!project) notFound();
  return ogImage({ label: project.kind, title: project.title, subtitle: project.tagline, footer: content.profile.websiteLabel || content.profile.name, photo: await ogPhoto() });
}
