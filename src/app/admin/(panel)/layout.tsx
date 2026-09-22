import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { AdminShell } from "../_components/shell";
import { Login } from "../_components/login";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) return <Login configured={isAdminConfigured()} />;
  return <AdminShell>{children}</AdminShell>;
}
