"use client";

import { Download, LoaderCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function BackupPanel({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function download() {
    setMessage(null);
    const res = await fetch("/api/admin/backup");
    if (!res.ok) {
      setMessage({ tone: "error", text: ((await res.json().catch(() => ({}))) as { error?: string }).error ?? `HTTP ${res.status}` });
      return;
    }
    const name = res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] ?? "site.json";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(await res.blob());
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function restore(file: File) {
    setMessage(null);
    let data: unknown;
    try {
      data = JSON.parse(await file.text());
    } catch {
      setMessage({ tone: "error", text: "The file is not valid JSON." });
      return;
    }
    if (!confirm("Replace all site content with this file? Photos are kept.")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/backup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setMessage({ tone: "ok", text: "Restored - the site shows this content now." });
      router.refresh();
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : String(e) });
    }
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  return (
    <div className="max-w-3xl space-y-4 px-5 py-6 lg:px-8">
      <section className="space-y-2 rounded-xl border bg-surface p-4 sm:p-5">
        <h2 className="text-sm font-semibold tracking-tight">Download a backup</h2>
        <p className="text-[13px] text-muted-foreground">All content as one JSON file: profile, experience, projects, articles and texts. Photos are not included.</p>
        <Button size="sm" variant="outline" onClick={download}>
          <Download className="size-3.5" /> Download JSON
        </Button>
      </section>
      <section className="space-y-2 rounded-xl border bg-surface p-4 sm:p-5">
        <h2 className="text-sm font-semibold tracking-tight">Restore or import</h2>
        <p className="text-[13px] text-muted-foreground">
          Replaces everything with a backup file - for example .content/site.json from your computer to fill a new Blob store.
        </p>
        <input ref={input} type="file" accept="application/json,.json" className="hidden" onChange={(e) => e.target.files?.[0] && restore(e.target.files[0])} />
        <Button size="sm" variant="outline" disabled={busy || disabled} onClick={() => input.current?.click()}>
          {busy ? <LoaderCircle className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />} Upload JSON
        </Button>
        {message && <p className={message.tone === "ok" ? "text-[13px] text-emerald-700" : "text-[13px] text-red-600"}>{message.text}</p>}
      </section>
    </div>
  );
}
