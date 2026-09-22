import { isAdmin } from "@/lib/admin-auth";
import { siteStorage } from "@/lib/site/store";
import { BackupPanel } from "../../_components/backup-panel";

export default async function BackupPage() {
  if (!(await isAdmin())) return null;
  return (
    <div>
      <header className="border-b px-5 py-3 lg:px-8">
        <h1 className="text-base font-semibold tracking-tight">Backup</h1>
        <p className="text-xs text-muted-foreground">Download or restore all site content.</p>
      </header>
      <BackupPanel disabled={siteStorage() === "none"} />
    </div>
  );
}
