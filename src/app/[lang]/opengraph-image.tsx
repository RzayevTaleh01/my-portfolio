import { getContent } from "@/content";
import { hasLocale } from "@/i18n/config";
import { ogContentType, ogImage, ogPhoto, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Portfolio";

export default async function Image(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params;
  const { profile } = await getContent(hasLocale(lang) ? lang : "en");
  return ogImage({ title: profile.name, subtitle: profile.headline, footer: profile.websiteLabel || profile.name, photo: await ogPhoto() });
}
