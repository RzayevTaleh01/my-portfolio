"use client";

import { LoaderCircle, Save, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getSection, type SectionKey } from "@/lib/site/schema";
import { cn } from "@/lib/utils";
import { Fields, inputClass, ListEditor } from "./fields";
import { setAdminDirty } from "./shell";

export type Storage = "blob" | "file" | "none";

export function useDirtyGuard(dirty: boolean) {
  useEffect(() => {
    setAdminDirty(dirty);
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => () => setAdminDirty(false), []);
}

export function EditorHeader({
  title,
  description,
  dirty,
  saving,
  storage,
  onSave,
  message,
  children,
}: {
  title: string;
  description: string;
  dirty: boolean;
  saving: boolean;
  storage: Storage;
  onSave: () => void;
  message: { tone: "ok" | "error"; text: string } | null;
  children?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3 px-5 py-3 lg:px-8">
        <div className="mr-auto min-w-0">
          <h1 className="text-base font-semibold tracking-tight">{title}</h1>
          <p className="truncate text-xs text-muted-foreground">
            {description}
            {dirty && <span className="ml-2 font-medium text-amber-600">· unsaved changes</span>}
          </p>
        </div>
        {children}
        <Button size="sm" onClick={onSave} disabled={!dirty || saving || storage === "none"}>
          {saving ? <LoaderCircle className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
          {storage === "blob" ? "Save & publish" : "Save"}
        </Button>
      </div>
      {storage === "none" && (
        <p className="px-5 pb-2 text-[13px] text-amber-700 lg:px-8">No Vercel Blob store is connected, so nothing can be saved here.</p>
      )}
      {message && (
        <p className={cn("px-5 pb-2 text-[13px] lg:px-8", message.tone === "ok" ? "text-emerald-700" : "text-red-600")}>{message.text}</p>
      )}
    </header>
  );
}

export function SectionEditor({ sectionKey, initial, storage }: { sectionKey: SectionKey; initial: unknown; storage: Storage }) {
  const section = getSection(sectionKey)!;
  const [value, setValue] = useState<unknown>(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const dirty = JSON.stringify(value) !== saved;
  useDirtyGuard(dirty);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: sectionKey, value }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setValue(body.value);
      setSaved(JSON.stringify(body.value));
      setMessage({ tone: "ok", text: storage === "blob" ? "Published - the site shows the new version now." : "Saved to .content/site.json." });
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : String(e) });
    }
    setSaving(false);
  }

  return (
    <div>
      <EditorHeader title={section.title} description={section.description} dirty={dirty} saving={saving} storage={storage} onSave={save} message={message}>
        {section.list && (
          <label className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-subtle-foreground" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter"
              className={cn(inputClass, "h-8 w-44 py-0 pl-8 text-[13px]")}
              aria-label="Filter entries"
            />
          </label>
        )}
      </EditorHeader>
      <div className="max-w-5xl px-5 py-6 lg:px-8">
        {section.list ? (
          <ListEditor
            field={{ fields: section.fields, itemLabel: section.list.itemLabel, singular: section.list.singular }}
            value={Array.isArray(value) ? value : []}
            onChange={setValue}
            filter={filter}
            top
          />
        ) : (
          <div className="rounded-xl border bg-surface p-4 sm:p-5">
            <Fields fields={section.fields} value={(value ?? {}) as Record<string, unknown>} onChange={setValue} />
          </div>
        )}
      </div>
    </div>
  );
}
