import { getDictionary } from "@/i18n/dictionaries";
import { isAdmin } from "@/lib/admin-auth";
import { readSiteDataFresh, siteStorage } from "@/lib/site/store";
import { getPath, textKeys } from "@/lib/site/texts";
import { TextsEditor } from "../../_components/texts-editor";

export default async function TextsPage() {
  if (!(await isAdmin())) return null;
  const storage = siteStorage();
  const data = storage === "none" ? null : await readSiteDataFresh();
  const defaults = {
    en: Object.fromEntries(textKeys.map((k) => [k, String(getPath(getDictionary("en"), k) ?? "")])),
    sk: Object.fromEntries(textKeys.map((k) => [k, String(getPath(getDictionary("sk"), k) ?? "")])),
  };
  return <TextsEditor keys={textKeys} initial={data?.texts ?? {}} defaults={defaults} storage={storage} />;
}
