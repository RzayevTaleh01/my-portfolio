"use client";

import { useState } from "react";
import type { TextKey } from "@/lib/site/texts";
import { cn } from "@/lib/utils";
import { inputClass } from "./fields";
import { EditorHeader, useDirtyGuard, type Storage } from "./section-editor";

type Pair = { en?: string; sk?: string };

const groupTitles: Record<string, string> = {
  home: "Home page",
  projects: "Projects page",
  writing: "Articles page",
  assistant: "AI assistant",
};

export function TextsEditor({
  keys,
  initial,
  defaults,
  storage,
}: {
  keys: readonly TextKey[];
  initial: Partial<Record<TextKey, Pair>>;
  defaults: Record<"en" | "sk", Record<string, string>>;
  storage: Storage;
}) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(() => JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const dirty = JSON.stringify(value) !== saved;
  useDirtyGuard(dirty);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/texts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: value }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setValue(body.texts);
      setSaved(JSON.stringify(body.texts));
      setMessage({ tone: "ok", text: "Saved - the site uses the new texts now." });
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : String(e) });
    }
    setSaving(false);
  }

  const groups = [...new Set(keys.map((k) => k.split(".")[0]))];

  return (
    <div>
      <EditorHeader
        title="Site texts"
        description="Texts around the content. Empty fields use the built-in text shown as a hint. {name}-style placeholders are filled in."
        dirty={dirty}
        saving={saving}
        storage={storage}
        onSave={save}
        message={message}
      />
      <div className="max-w-5xl space-y-6 px-5 py-6 lg:px-8">
        {groups.map((group) => (
          <section key={group} className="space-y-4 rounded-xl border bg-surface p-4 sm:p-5">
            <h2 className="text-sm font-semibold tracking-tight">{groupTitles[group] ?? group}</h2>
            {keys
              .filter((k) => k.startsWith(`${group}.`))
              .map((key) => {
                const pair = value[key] ?? {};
                const long = (defaults.en[key] ?? "").length > 70 || (pair.en ?? "").length > 70;
                return (
                  <div key={key} className="space-y-1.5">
                    <p className="font-mono text-[11px] text-muted-foreground">{key.slice(group.length + 1)}</p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {(["en", "sk"] as const).map((lang) => {
                        const props = {
                          value: pair[lang] ?? "",
                          placeholder: defaults[lang][key],
                          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                            setValue((v) => ({ ...v, [key]: { ...v[key], [lang]: e.target.value } })),
                        };
                        return (
                          <div key={lang} className="flex gap-1.5">
                            <span className="w-6 shrink-0 pt-2 font-mono text-[10px] font-medium uppercase text-subtle-foreground">{lang}</span>
                            {long ? (
                              <textarea rows={3} {...props} className={cn(inputClass, "leading-6")} />
                            ) : (
                              <input {...props} className={cn(inputClass, "h-9 py-0")} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </section>
        ))}
      </div>
    </div>
  );
}
