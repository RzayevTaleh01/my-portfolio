"use client";

import { Download, ExternalLink, FileJson, Import, LoaderCircle, Pencil, RefreshCw, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Region } from "@/i18n/region";
import {
  buildCatalog,
  buildCvData,
  catalogIds,
  editableIds,
  flatItems,
  regionLabels,
  siteFields,
  siteHeader,
  withOwnCopy,
  type CatalogGroup,
  type CatalogItem,
  type CvConfig,
  type CvOverrides,
  type CvRegionConfig,
  type CvSource,
} from "@/lib/cv/model";
import { cvDownloadName } from "@/lib/site/content";
import { cn } from "@/lib/utils";

type Storage = "blob" | "file" | "none";

interface Props {
  source: CvSource;
  initialConfig: CvConfig;
  storage: Storage;
}

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
      const data = buildCvData(source, config, region, `${window.location.origin}${source.en.profile.avatar.replace(/avatar$/, "cv-photo")}`);
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

function ownCopies(source: CvSource, config: CvConfig): CvConfig {
  const regions = Object.fromEntries(
    (Object.keys(config.regions) as Region[]).map((r) => [r, withOwnCopy(source, r, config.regions[r])]),
  ) as CvConfig["regions"];
  return { ...config, regions };
}

export function CvBuilder({ source, initialConfig, storage }: Props) {
  const [saved, setSaved] = useState(initialConfig);
  const [config, setConfig] = useState(() => ownCopies(source, initialConfig));
  const [region, setRegion] = useState<Region>("sk");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  const current = config.regions[region];
  const other: Region = region === "sk" ? "intl" : "sk";
  const catalog = useMemo(() => buildCatalog(source, current.language), [source, current.language]);
  const known = useMemo(() => catalogIds(catalog), [catalog]);
  const editable = useMemo(() => editableIds(catalog), [catalog]);
  const stale = [
    ...current.items.filter((i) => !known.has(i)),
    ...Object.keys(current.overrides).filter((id) => !editable.has(id)),
  ];
  const dirty = JSON.stringify(config.regions) !== JSON.stringify(saved.regions);
  const preview = useCvPreview(source, current, region);

  const update = (patch: Partial<CvRegionConfig>) =>
    setConfig((c) => ({ ...c, regions: { ...c.regions, [region]: { ...c.regions[region], ...patch } } }));

  const setItems = (ids: string[], on: boolean) => {
    const set = new Set(current.items);
    ids.forEach((id) => (on ? set.add(id) : set.delete(id)));
    const ordered = [...known].filter((id) => set.has(id));
    update({ items: [...ordered, ...[...set].filter((id) => !known.has(id))] });
  };

  const editField = (id: string, key: string, value: string | null) => {
    const fields = { ...current.overrides[id] };
    if (value === null) delete fields[key];
    else fields[key] = value;
    const overrides = { ...current.overrides, [id]: fields };
    if (Object.keys(fields).length === 0) delete overrides[id];
    update({ overrides });
  };

  const importItems = (items: CatalogItem[]) => {
    const overrides = { ...current.overrides };
    items.filter((i) => i.fields.length).forEach((i) => (overrides[i.id] = siteFields(i)));
    update({ overrides });
  };

  const importHeader = () => update(siteHeader(source, current.language, region));

  const changeLanguage = (language: Locale) => {
    const imported = confirm(
      `Import every text in ${language === "sk" ? "Slovak" : "English"} from the site?\n\nOK - replaces the CV text (your edits are lost).\nCancel - keeps the current text; import cards one by one later.`,
    );
    if (!imported) return update({ language });
    const overrides = { ...current.overrides };
    flatItems(buildCatalog(source, language)).forEach((i) => {
      if (i.fields.length) overrides[i.id] = siteFields(i);
    });
    update({ language, ...siteHeader(source, language, region), overrides });
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
      setSaved(body.config);
      setConfig(ownCopies(source, body.config));
      setMessage({
        tone: "ok",
        text:
          body.storage === "blob"
            ? "Published - the download buttons on the site now give the new PDFs."
            : "Saved to src/content/cv/cv-config.json. No Blob store here, so the live site updates on the next deploy.",
      });
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

  return (
    <div>
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

          {storage !== "none" ? (
            <Button size="sm" onClick={save} disabled={!dirty || saving}>
              {saving ? <LoaderCircle className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}{" "}
              {storage === "blob" ? "Save & publish" : "Save"}
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={exportJson} title="Replace src/content/cv/cv-config.json with this file">
              <FileJson className="size-3.5" /> Export config
            </Button>
          )}
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
        {storage === "none" && (
          <p className="mx-auto max-w-[1500px] px-4 pb-2 text-[13px] text-amber-700">
            No Vercel Blob store is connected, so nothing can be saved here. Connect one in Vercel → Storage and redeploy.
          </p>
        )}
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Card
            title={`${regionLabels[region]} CV`}
            aside={
              <>
                <ImportButton what="the header" onImport={importHeader} />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => update({ ...config.regions[other] })}
                  title={`Replace everything here with the ${regionLabels[other]} CV`}
                >
                  Copy from {regionLabels[other]}
                </Button>
              </>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="CV language">
                <select
                  value={current.language}
                  onChange={(e) => changeLanguage(e.target.value as Locale)}
                  className={inputClass}
                >
                  <option value="en">English</option>
                  <option value="sk">Slovenčina</option>
                </select>
              </Field>
              <Field label="Name">
                <HeaderInput value={current.name} onChange={(name) => update({ name })} />
              </Field>
              <Field label="Headline" wide>
                <HeaderInput value={current.headline} onChange={(headline) => update({ headline })} />
              </Field>
              <Field label="About me" wide>
                <HeaderInput multiline value={current.summary} onChange={(summary) => update({ summary })} />
              </Field>
              <Field label="Email">
                <HeaderInput value={current.email} onChange={(email) => update({ email })} />
              </Field>
              <Field label="Phone number">
                <HeaderInput value={current.phone} onChange={(phone) => update({ phone })} placeholder="+421 …" />
              </Field>
              <Field label="Website">
                <HeaderInput value={current.website} onChange={(website) => update({ website })} placeholder="yourdomain.com" />
              </Field>
              <Field label="Address">
                <HeaderInput
                  value={current.location}
                 
                  onChange={(location) => update({ location })}
                />
              </Field>
              <Field label="Nationality">
                <HeaderInput value={current.nationality} onChange={(nationality) => update({ nationality })} />
              </Field>
              <Field label="Date of birth">
                <HeaderInput value={current.dateOfBirth} onChange={(dateOfBirth) => update({ dateOfBirth })} placeholder="DD/MM/YYYY" />
              </Field>
              <Field label="Mother tongue">
                <HeaderInput value={current.motherTongue} onChange={(motherTongue) => update({ motherTongue })} />
              </Field>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The CV keeps its own copy of every text - editing the site does not change it. &quot;Import from site&quot; on a card
              replaces that card&apos;s text with the site&apos;s current text. Clear a field to leave it out of the CV.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <Toggle checked={current.photo} onChange={(photo) => update({ photo })} label="Photo" />
              <Toggle checked={current.showStack} onChange={(showStack) => update({ showStack })} label="Technologies under entries" />
            </div>
          </Card>

          {stale.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
              <span className="mr-auto">
                {stale.length} saved {stale.length === 1 ? "entry no longer exists" : "entries no longer exist"} in the content (renamed or
                removed).
              </span>
              <Button size="sm" variant="outline" onClick={() =>
                  update({
                    items: current.items.filter((i) => known.has(i)),
                    overrides: Object.fromEntries(Object.entries(current.overrides).filter(([id]) => editable.has(id))),
                  })
                }>
                Clean up
              </Button>
            </div>
          )}

          {catalog.map((group) => (
            <CatalogCard
              key={group.key}
              group={group}
              selected={current.items}
              onChange={setItems}
              overrides={current.overrides}
              onEdit={editField}
              onImport={importItems}
            />
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
                  <a href={preview.url} download={cvDownloadName(source.en.profile.name)}>
                    <Download className="size-3.5" /> Draft PDF
                  </a>
                </Button>
              )}
              <Button size="sm" variant="outline" asChild>
                <a href={`${source.en.profile.cvPdf}?region=${region}`} target="_blank" rel="noreferrer" title="The PDF the site serves right now">
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

interface EditProps {
  overrides: CvOverrides;
  onEdit: (id: string, key: string, value: string | null) => void;
  onImport: (items: CatalogItem[]) => void;
}

function ImportButton({ what, onImport }: { what: string; onImport: () => void }) {
  return (
    <Button
      size="sm"
      variant="ghost"
      title={`Replace the CV text of ${what} with the site's current text`}
      onClick={() => confirm(`Import ${what} from the site? Your CV edits there are replaced.`) && onImport()}
    >
      <Import className="size-3.5" /> Import from site
    </Button>
  );
}

function CatalogCard({
  group,
  selected,
  onChange,
  ...edit
}: {
  group: CatalogGroup;
  selected: string[];
  onChange: (ids: string[], on: boolean) => void;
} & EditProps) {
  const on = new Set(selected);
  const all = group.items.flatMap(leafIds);
  const count = all.filter((id) => on.has(id)).length;

  return (
    <Card
      title={group.title}
      aside={
        all.length > 0 && (
          <>
            <ImportButton what={`all of "${group.title}"`} onImport={() => edit.onImport(flatItems([group]))} />
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
                  item={item}
                  checked={checked}
                  indeterminate={mixed}
                  onChange={(v) => onChange(isGroup ? children.map((c) => c.id) : v ? [item.id] : leafIds(item), v)}
                  strong
                  {...edit}
                />
                {children.length > 0 && (
                  <ul className={cn("ml-6 mt-0.5 space-y-0.5 border-l pl-3", isGroup && "grid gap-x-4 space-y-0 sm:grid-cols-2")}>
                    {children.map((c) => (
                      <li key={c.id}>
                        <Row
                          item={c}
                          checked={on.has(c.id)}
                          disabled={!isGroup && !on.has(item.id)}
                          hideDetail={isGroup}
                          onChange={(v) => onChange([c.id], v)}
                          {...edit}
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
  item,
  checked,
  indeterminate,
  disabled,
  strong,
  hideDetail,
  onChange,
  overrides,
  onEdit,
  onImport,
}: {
  item: CatalogItem;
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  strong?: boolean;
  hideDetail?: boolean;
  onChange: (v: boolean) => void;
} & EditProps) {
  const [open, setOpen] = useState(false);
  const edits = overrides[item.id];
  const differs = (key: string, site: string) => edits?.[key] !== undefined && edits[key] !== site;
  const edited = item.fields.some((f) => differs(f.key, f.value));
  const label = edits?.title ?? edits?.label ?? edits?.name ?? item.label;

  return (
    <div className={cn("rounded-md", open && "bg-muted/40 ring-1 ring-border")}>
      <div className={cn("flex items-start gap-1 rounded-md hover:bg-muted/60", disabled && "opacity-45 hover:bg-transparent")}>
        <label className={cn("flex min-w-0 flex-1 cursor-pointer items-start gap-2.5 px-1.5 py-1 text-sm", disabled && "cursor-not-allowed")}>
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
            {edited && (
              <span className="ml-2 rounded bg-accent-soft px-1.5 py-px align-middle text-[10px] font-medium uppercase tracking-wide text-accent">
                edited
              </span>
            )}
            {item.detail && !hideDetail && <span className="block text-xs leading-5 text-muted-foreground">{item.detail}</span>}
          </span>
        </label>
        {item.fields.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={`Edit ${item.label}`}
            title="Edit for the CV"
            className={cn(
              "mt-0.5 grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
              open && "bg-muted text-foreground",
            )}
          >
            <Pencil className="size-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div className="space-y-2.5 px-3 pb-3 pt-1.5">
          {item.fields.map((f) => {
            const value = edits?.[f.key] ?? f.value;
            const changed = differs(f.key, f.value);
            const set = (v: string) => onEdit(item.id, f.key, v);
            return (
              <label key={f.key} className="block space-y-1">
                <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  {f.label}
                  {changed && <span className="text-accent">· edited</span>}
                </span>
                {f.multiline ? (
                  <textarea
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    rows={Math.min(8, Math.max(2, value.split("\n").length + 1))}
                    className={cn(inputClass, "h-auto bg-surface py-2 leading-6")}
                  />
                ) : (
                  <input value={value} onChange={(e) => set(e.target.value)} className={cn(inputClass, "bg-surface")} />
                )}
              </label>
            );
          })}
          <div className="flex items-center gap-2 pt-0.5">
            <p className="mr-auto text-xs text-muted-foreground">Saved with this CV only; the site keeps its text.</p>
            {edited && <ImportButton what="this entry" onImport={() => onImport([item])} />}
          </div>
        </div>
      )}
    </div>
  );
}

function HeaderInput({
  value: shown,
  onChange: set,
  multiline,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return multiline ? (
    <textarea
      value={shown}
      onChange={(e) => set(e.target.value)}
      placeholder={placeholder ?? "Left out of the CV"}
      rows={5}
      className={cn(inputClass, "h-auto py-2 leading-6")}
    />
  ) : (
    <input value={shown} onChange={(e) => set(e.target.value)} placeholder={placeholder ?? "Left out of the CV"} className={inputClass} />
  );
}
