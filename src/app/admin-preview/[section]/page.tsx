import { notFound } from "next/navigation";
import { getSection } from "@/lib/site/schema";
import { readSiteDataFresh, siteStorage } from "@/lib/site/store";
import { SectionEditor } from "../../admin/_components/section-editor";

export default async function Preview(props: { params: Promise<{ section: string }> }) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { section: key } = await props.params;
  const section = getSection(key);
  if (!section) notFound();
  const data = await readSiteDataFresh();
  return <SectionEditor key={section.key} sectionKey={section.key} initial={(data as unknown as Record<string, unknown>)[section.key]} storage={siteStorage()} />;
}
