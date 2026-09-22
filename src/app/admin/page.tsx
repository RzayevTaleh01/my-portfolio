import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { getCvSource } from "@/lib/cv/source";
import { getPublishedConfig, hasBlobStore } from "@/lib/cv/store";
import { AdminApp, Login } from "./admin-app";

export default async function AdminPage() {
  if (!(await isAdmin())) return <Login configured={isAdminConfigured()} />;

  const storage = hasBlobStore() ? "blob" : process.env.NODE_ENV === "development" ? "file" : "none";
  return <AdminApp source={getCvSource()} initialConfig={await getPublishedConfig()} storage={storage} />;
}
