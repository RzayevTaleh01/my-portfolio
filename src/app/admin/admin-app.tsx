"use client";

import { Download, ExternalLink, FileJson, LoaderCircle, LogOut, RefreshCw, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Region } from "@/i18n/region";
import {
  buildCatalog,
  buildCvData,
  catalogIds,
  cvFiles,
  regionLabels,
  type CatalogGroup,
  type CatalogItem,
  type CvConfig,
  type CvRegionConfig,
  type CvSource,
} from "@/lib/cv/model";
import { cn } from "@/lib/utils";
import { ADMIN_CODE_SHA256, sha256 } from "./access";

const SESSION_KEY = "cv-admin";

interface Props {
  source: CvSource;
  initialConfig: CvConfig;
  canSave: boolean;
}

// Signed in for this browser tab only (sessionStorage).
const AUTH_EVENT = "cv-admin-auth";

function readAuth() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === ADMIN_CODE_SHA256;
  } catch {
    return false;
  }
}

function writeAuth(on: boolean) {
  try {
    if (on) sessionStorage.setItem(SESSION_KEY, ADMIN_CODE_SHA256);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {}
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function subscribeAuth(callback: () => void) {
  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
}

export function AdminApp(props: Props) {
  // null on the server: nothing renders until the browser knows.
  const authed = useSyncExternalStore(subscribeAuth, readAuth, () => null);

  if (authed === null) return null;
  if (!authed) return <Login onSuccess={() => writeAuth(true)} />;
  return <CvBuilder {...props} onLogout={() => writeAuth(false)} />;
}

// ─── Login ────────────────────────────────────────────────

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if ((await sha256(code.trim())) === ADMIN_CODE_SHA256) {
        onSuccess();
        return;
      }
      setError("Wrong code.");
    } catch {
      setError("This browser can't check the code here - open the panel over https or on localhost.");
    }
    setBusy(false);
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border bg-surface p-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">Admin</h1>
          <p className="text-sm text-muted-foreground">Enter the access code.</p>
        </div>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring"
          placeholder="Code"
          aria-label="Access code"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy || !code}>
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : null} Sign in
        </Button>
      </form>
    </main>
  );
}

// ─── CV builder ───────────────────────────────────────────

function useCvPreview(source: CvSource, config: CvRegionConfig, region: Region) {
  const [url, setUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = useRef(0);

  const generate = useCallback(async () => {
    const id = ++run.current;
    setBusy(true);
    try {
      const [{ pdf }, { CvDocument, registerCvFonts }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/cv/document"),
      ]);
      registerCvFonts(`${window.location.origin}/fonts/cv`);
      const data = buildCvData(source, config, region, `${window.location.origin}/avatar-cv.jpg`);
      const blob = await pdf(<CvDocument data={data} />).toBlob();
      if (id !== run.current) return;
      setUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(blob);
      });
      setError(null);
    } catch (e) {
      if (id === run.current) setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (id === run.current) setBusy(false);
    }
  }, [source, config, region]);

  useEffect(() => {
    const timer = setTimeout(generate, 450);
    return () => clearTimeout(timer);
  }, [generate]);

  return { url, busy, error, regenerate: generate };
}

function CvBuilder({ source, initialConfig, canSave, onLogout }: Props & { onLogout: () => void }) {
  const [saved, setSaved] = useState(initialConfig);
  const [config, setConfig] = useState(initialConfig);
  const [region, setRegion] = useState<Region>("sk");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const current = config.regions[region];
  const other: Region = region === "sk" ? "intl" : "sk";
  const catalog = useMemo(() => buildCatalog(source, current.language), [source, current.language]);
  const known = useMemo(() => catalogIds(catalog), [catalog]);
  const stale = current.items.filter((i) => !known.has(i));
  const dirty = JSON.stringify(config.regions) !== JSON.stringify(saved.regions);
  const preview = useCvPreview(source, current, region);

  const update = (patch: Partial<CvRegionConfig>) =>
    setConfig((c) => ({ ...c, regions: { ...c.regions, [region]: { ...c.regions[region], ...patch } } }));

  const setItems = (ids: string[], on: boolean) => {
    const set = new Set(current.items);
    ids.forEach((id) => (on ? set.add(id) : set.delete(id)));
    // Keep the file order stable: catalog order first, unknown ids last.
    const ordered = [...known].filter((id) => set.has(id));
    update({ items: [...ordered, ...[...set].filter((id) => !known.has(id))] });
  };

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/cv-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setSaved(body);
      setConfig(body);
      setMessage({ tone: "ok", text: "Saved to src/content/cv/cv-config.json. Deploy to publish the new PDFs." });
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : String(e) });
    }
    setSaving(false);
  }

  function exportJson() {
    const blob = new Blob([`${JSON.stringify({ ...config, updatedAt: new Date().toISOString() }, null, 2)}\n`], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "cv-config.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const profile = source[current.language].profile;

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto">
            <h1 className="text-base font-semibold tracking-tight">CV builder</h1>
            <p className="text-xs text-muted-foreground">
              {saved.updatedAt ? `Last saved ${new Date(saved.updatedAt).toLocaleString()}` : "Not saved yet"}
              {dirty && <span className="ml-2 font-medium text-amber-600">· unsaved changes</span>}
            </p>
          </div>

          <div role="tablist" aria-label="Region" className="flex rounded-lg border bg-muted/60 p-0.5">
            {(["sk", "intl"] as Region[]).map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={region === r}
                onClick={() => setRegion(r)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                  region === r ? "bg-surface shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {regionLabels[r]}
              </button>
            ))}
          </div>

          {canSave ? (
            <Button size="sm" onClick={save} disabled={!dirty || saving}>
              {saving ? <LoaderCircle className="size-3.5 animate-spin" /> : <Save className="size-3.5" />} Save both CVs
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={exportJson} title="Replace src/content/cv/cv-config.json with this file">
              <FileJson className="size-3.5" /> Export config
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onLogout} aria-label="Log out">
            <LogOut className="size-3.5" />
          </Button>
        </div>
        {message && (
          <p
            className={cn(
              "mx-auto max-w-[1500px] px-4 pb-2 text-[13px]",
              message.tone === "ok" ? "text-emerald-700" : "text-red-600",
            )}
          >
            {message.text}
          </p>
        )}
        {!canSave && (
          <p className="mx-auto max-w-[1500px] px-4 pb-2 text-[13px] text-muted-foreground">
            Read-only here. Run <code className="font-mono">npm run dev</code> and open localhost:3000/admin to save - or
            export the config and put it in <code className="font-mono">src/content/cv/cv-config.json</code>.
          </p>
        )}
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Card
            title={`${regionLabels[region]} CV`}
            aside={
              <Button
                size="sm"
                variant="ghost"
                onClick={() => update({ ...config.regions[other] })}
                title={`Replace everything here with the ${regionLabels[other]} CV`}
              >
                Copy from {regionLabels[other]}
              </Button>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="CV language">
                <select
                  value={current.language}
                  onChange={(e) => update({ language: e.target.value as Locale })}
                  className={inputClass}
                >
                  <option value="en">English</option>
                  <option value="sk">Slovenčina</option>
                </select>
              </Field>
              <Field label="Address">
                <input
                  value={current.location}
                  onChange={(e) => update({ location: e.target.value })}
                  placeholder={source[current.language].regionLocation[region]}
                  className={inputClass}
                />
              </Field>
              <Field label="Headline" wide>
                <input
                  value={current.headline}
                  onChange={(e) => update({ headline: e.target.value })}
                  placeholder={profile.headline}
                  className={inputClass}
                />
              </Field>
              <Field label="About me (empty = the site intro)" wide>
                <textarea
                  value={current.summary}
                  onChange={(e) => update({ summary: e.target.value })}
                  placeholder={profile.intro}
                  rows={5}
                  className={cn(inputClass, "h-auto py-2 leading-6")}
                />
              </Field>
              <Field label="Nationality">
                <input value={current.nationality} onChange={(e) => update({ nationality: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Date of birth">
                <input
                  value={current.dateOfBirth}
                  onChange={(e) => update({ dateOfBirth: e.target.value })}
                  placeholder="DD/MM/YYYY"
                  className={inputClass}
                />
              </Field>
              <Field label="Phone number">
                <input value={current.phone} onChange={(e) => update({ phone: e.target.value })} className={inputClass} />
              </Field>
              <Field label="Mother tongue">
                <input value={current.motherTongue} onChange={(e) => update({ motherTongue: e.target.value })} className={inputClass} />
              </Field>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <Toggle checked={current.photo} onChange={(photo) => update({ photo })} label="Photo" />
              <Toggle checked={current.showStack} onChange={(showStack) => update({ showStack })} label="Technologies under entries" />
            </div>
          </Card>

          {stale.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
              <span className="mr-auto">
                {stale.length} approved {stale.length === 1 ? "entry no longer exists" : "entries no longer exist"} in the content (renamed or
                removed).
              </span>
              <Button size="sm" variant="outline" onClick={() => update({ items: current.items.filter((i) => known.has(i)) })}>
                Clean up
              </Button>
            </div>
          )}

          {catalog.map((group) => (
            <CatalogCard key={group.key} group={group} selected={current.items} onChange={setItems} />
          ))}
        </div>

        <div className="lg:sticky lg:top-[88px] lg:h-[calc(100dvh-112px)]">
          <div className="flex h-full min-h-[70dvh] flex-col overflow-hidden rounded-xl border bg-surface">
            <div className="flex flex-wrap items-center gap-2 border-b px-4 py-2.5">
              <p className="mr-auto text-[13px] font-medium">
                Preview {preview.busy && <LoaderCircle className="ml-1 inline size-3.5 animate-spin text-muted-foreground" />}
              </p>
              <Button size="sm" variant="ghost" onClick={preview.regenerate} aria-label="Regenerate preview">
                <RefreshCw className="size-3.5" />
              </Button>
              {preview.url && (
                <Button size="sm" variant="outline" asChild>
                  <a href={preview.url} download="Taleh_Rzayev_Resume.pdf">
                    <Download className="size-3.5" /> Draft PDF
                  </a>
                </Button>
              )}
              <Button size="sm" variant="outline" asChild>
                <a href={`/cv/${cvFiles[region]}`} target="_blank" rel="noreferrer" title="The PDF the site serves right now">
                  <ExternalLink className="size-3.5" /> Published
                </a>
              </Button>
            </div>
            {preview.error ? (
              <p className="p-4 text-sm text-red-600">Preview failed: {preview.error}</p>
            ) : preview.url ? (
              <iframe key={preview.url} src={`${preview.url}#view=FitH`} title="CV preview" className="w-full flex-1 bg-muted" />
            ) : (
              <div className="grid flex-1 place-items-center text-sm text-muted-foreground">Generating…</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pieces ───────────────────────────────────────────────

const inputClass = "h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:border-ring";

function Card({ title, aside, children }: { title: string; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-surface">
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <h2 className="mr-auto text-sm font-semibold tracking-tight">{title}</h2>
        {aside}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={cn("block space-y-1", wide && "sm:col-span-2")}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[var(--accent)]" />
      {label}
    </label>
  );
}

function leafIds(item: CatalogItem): string[] {
  return item.id.startsWith("group:") ? (item.children ?? []).map((c) => c.id) : [item.id, ...(item.children ?? []).map((c) => c.id)];
}

function CatalogCard({
  group,
  selected,
  onChange,
}: {
  group: CatalogGroup;
  selected: string[];
  onChange: (ids: string[], on: boolean) => void;
}) {
  const on = new Set(selected);
  const all = group.items.flatMap(leafIds);
  const count = all.filter((id) => on.has(id)).length;

  return (
    <Card
      title={group.title}
      aside={
        all.length > 0 && (
          <>
            <span className="font-mono text-xs text-muted-foreground">
              {count}/{all.length}
            </span>
            <Button size="sm" variant="ghost" onClick={() => onChange(all, true)}>
              All
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onChange(all, false)}>
              None
            </Button>
          </>
        )
      }
    >
      {group.items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing in the content yet.</p>
      ) : (
        <ul className="space-y-1">
          {group.items.map((item) => {
            const isGroup = item.id.startsWith("group:");
            const children = item.children ?? [];
            const childOn = children.filter((c) => on.has(c.id)).length;
            const checked = isGroup ? childOn === children.length && children.length > 0 : on.has(item.id);
            const mixed = isGroup && childOn > 0 && childOn < children.length;
            return (
              <li key={item.id}>
                <Row
                  checked={checked}
                  indeterminate={mixed}
                  label={item.label}
                  detail={item.detail}
                  onChange={(v) => onChange(isGroup ? children.map((c) => c.id) : v ? [item.id] : leafIds(item), v)}
                  strong
                />
                {children.length > 0 && (
                  <ul className={cn("ml-6 mt-0.5 space-y-0.5 border-l pl-3", isGroup && "flex flex-wrap gap-x-4 space-y-0")}>
                    {children.map((c) => (
                      <li key={c.id}>
                        <Row
                          checked={on.has(c.id)}
                          disabled={!isGroup && !on.has(item.id)}
                          label={c.label}
                          detail={isGroup ? undefined : c.detail}
                          onChange={(v) => onChange([c.id], v)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function Row({
  checked,
  indeterminate,
  disabled,
  label,
  detail,
  strong,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label: string;
  detail?: string;
  strong?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2.5 rounded-md px-1.5 py-1 text-sm hover:bg-muted/60",
        disabled && "cursor-not-allowed opacity-45 hover:bg-transparent",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        ref={(el) => {
          if (el) el.indeterminate = !!indeterminate;
        }}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-[3px] size-4 shrink-0 accent-[var(--accent)]"
      />
      <span className="min-w-0">
        <span className={cn(strong && "font-medium")}>{label}</span>
        {detail && <span className="block text-xs leading-5 text-muted-foreground">{detail}</span>}
      </span>
    </label>
  );
}
