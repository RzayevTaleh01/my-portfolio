import { isAdmin } from "@/lib/admin-auth";
import { listClaps } from "@/lib/claps";
import { ClapsTable } from "../../_components/claps-table";

export default async function ClapsPage() {
  if (!(await isAdmin())) return null;
  const claps = await listClaps();
  return (
    <div>
      <header className="border-b px-5 py-3 lg:px-8">
        <h1 className="text-base font-semibold tracking-tight">Claps</h1>
        <p className="text-xs text-muted-foreground">{claps.length} visitors applauded the portfolio.</p>
      </header>
      <ClapsTable claps={claps} />
    </div>
  );
}
