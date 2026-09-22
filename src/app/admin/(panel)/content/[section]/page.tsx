import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getSection } from "@/lib/site/schema";
import { readSiteDataFresh, siteStorage } from "@/lib/site/store";
import { SectionEditor } from "../../../_components/section-editor";

export default async function ContentPage(props: PageProps<"/admin/content/[section]">) {
  if (!(await isAdmin())) return null;
  const { section: key } = await props.params;
  const section = getSection(key);
  if (!section) notFound();

  const storage = siteStorage();
  const data = storage === "none" ? null : await readSiteDataFresh();
  const value = data ? (data as unknown as Record<string, unknown>)[section.key] : section.list ? [] : {};

  return <SectionEditor key={section.key} sectionKey={section.key} initial={value} storage={storage} />;
}
