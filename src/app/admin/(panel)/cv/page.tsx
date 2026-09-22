import { isAdmin } from "@/lib/admin-auth";
import { getCvSource } from "@/lib/cv/source";
import { getPublishedConfig, hasBlobStore } from "@/lib/cv/store";
import { CvBuilder } from "../../_components/cv-builder";

export default async function CvBuilderPage() {
  if (!(await isAdmin())) return null;
  const storage = hasBlobStore() ? "blob" : process.env.NODE_ENV === "development" ? "file" : "none";
  return <CvBuilder source={await getCvSource()} initialConfig={await getPublishedConfig()} storage={storage} />;
}
