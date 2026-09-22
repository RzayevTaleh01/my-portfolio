"use client";

import { ArrowDown, ArrowUp, ChevronRight, Copy, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { isLocalized } from "@/lib/site/localized";
import { emptyItem, emptyValue, regionKeys, type Field } from "@/lib/site/schema";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-subtle-foreground focus:border-ring";

type Obj = Record<string, unknown>;
type ListField = Extract<Field, { kind: "list" }>;

const regionNames: Record<string, string> = { sk: "Slovakia", intl: "Other countries" };

function asPair<T>(value: unknown, empty: T): { en: T; sk: T } {
  if (isLocalized(value)) return { en: (value.en ?? empty) as T, sk: (value.sk ?? empty) as T };
  return { en: (value ?? empty) as T, sk: empty };
}

function firstText(value: unknown): string {
  if (isLocalized(value)) return firstText(value.en);
  if (Array.isArray(value)) return value.map(firstText).filter(Boolean).join(", ");
  if (typeof value === "number") return String(value);
  return typeof value === "string" ? value : "";
}

export function itemTitle(item: unknown, keys: string[], singular: string) {
  const parts = keys.map((k) => firstText((item as Obj)?.[k]).trim()).filter(Boolean);
  return parts.join(" · ") || `New ${singular}`;
}

let nextId = 0;
const newId = () => `i${++nextId}`;

function Lang({ code }: { code: string }) {
  return <span className="w-6 shrink-0 pt-2 font-mono text-[10px] font-medium uppercase text-subtle-foreground">{code}</span>;
}

function TextBox({
  value,
  onChange,
  rows,
  mono,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  mono?: boolean;
  placeholder?: string;
}) {
  if (!rows) {
    return <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "h-9 py-0", mono && "font-mono")} />;
  }
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputClass, "leading-6", mono && "font-mono text-[13px] leading-5")}
      spellCheck={!mono}
    />
  );
}

function rowsFor(field: Field) {
  switch (field.kind) {
    case "textarea":
      return field.rows ?? 3;
    case "markdown":
      return 18;
    case "code":
      return 10;
    case "lines":
      return 4;
    case "tags":
      return 3;
    default:
      return 0;
  }
}

function linesOf(value: unknown): string {
  return Array.isArray(value) ? value.join("\n") : typeof value === "string" ? value : "";
}

function toLines(text: string): string[] {
  return text.split("\n");
}

function Scalar({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const rows = rowsFor(field);
  const mono = field.kind === "code" || field.kind === "markdown";
  const isList = field.kind === "lines" || field.kind === "tags";
  const localized = "localized" in field && field.localized;
  const placeholder = "placeholder" in field ? field.placeholder : undefined;

  if (!localized) {
    return isList ? (
      <TextBox value={linesOf(value)} rows={rows} onChange={(t) => onChange(toLines(t))} />
    ) : (
      <TextBox value={typeof value === "string" ? value : ""} rows={rows} mono={mono} placeholder={placeholder} onChange={onChange} />
    );
  }

  const pair = asPair<unknown>(value, isList ? [] : "");
  const set = (lang: "en" | "sk", v: unknown) => onChange({ ...pair, [lang]: v });
  const stack = field.kind === "markdown";
  return (
    <div className={cn("grid gap-2", !stack && "md:grid-cols-2")}>
      {(["en", "sk"] as const).map((lang) => (
        <div key={lang} className="flex gap-1.5">
          <Lang code={lang} />
          {isList ? (
            <TextBox
              value={linesOf(pair[lang])}
              rows={rows}
              placeholder={lang === "sk" ? "Empty - English is used" : undefined}
              onChange={(t) => set(lang, toLines(t))}
            />
          ) : (
            <TextBox
              value={String(pair[lang] ?? "")}
              rows={rows}
              mono={mono}
              placeholder={lang === "sk" ? firstText(pair.en) || "Empty - English is used" : placeholder}
              onChange={(t) => set(lang, t)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.kind) {
    case "number":
      return (
        <input
          type="number"
          value={typeof value === "number" ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className={cn(inputClass, "h-9 py-0")}
        />
      );
    case "checkbox":
      return (
        <label className="flex h-9 cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[var(--accent)]" />
          {field.label}
        </label>
      );
    case "select":
      return (
        <select value={String(value ?? field.options[0])} onChange={(e) => onChange(e.target.value)} className={cn(inputClass, "h-9 py-0")}>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "regions": {
      const set = new Set(Array.isArray(value) ? (value as string[]) : []);
      return (
        <div className="flex h-9 flex-wrap items-center gap-x-5 gap-y-1">
          {regionKeys.map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={set.has(r)}
                onChange={(e) => onChange(regionKeys.filter((k) => (k === r ? e.target.checked : set.has(k))))}
                className="size-4 accent-[var(--accent)]"
              />
              {regionNames[r]}
            </label>
          ))}
        </div>
      );
    }
    case "object":
      return <ObjectInput field={field} value={value} onChange={onChange} />;
    case "list":
      return <ListEditor field={field} value={Array.isArray(value) ? value : []} onChange={onChange} />;
    default:
      return <Scalar field={field} value={value} onChange={onChange} />;
  }
}

function wide(field: Field) {
  if (field.kind === "object" || field.kind === "list" || field.kind === "markdown" || field.kind === "code") return true;
  if ("localized" in field && field.localized) return true;
  return !field.half;
}

export function Fields({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  return (
    <div className="grid gap-x-4 gap-y-3.5 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.key} className={cn("min-w-0 space-y-1.5", wide(field) && "sm:col-span-2")}>
          {field.kind !== "checkbox" && (
            <p className="flex flex-wrap items-baseline gap-x-2 text-xs font-medium text-muted-foreground">
              {field.label}
              {field.optional && <span className="font-normal text-subtle-foreground">optional</span>}
              {field.hint && <span className="font-normal text-subtle-foreground">· {field.hint}</span>}
            </p>
          )}
          <FieldInput field={field} value={value?.[field.key]} onChange={(v) => onChange({ ...value, [field.key]: v })} />
        </div>
      ))}
    </div>
  );
}

function ObjectInput({ field, value, onChange }: { field: Extract<Field, { kind: "object" }>; value: unknown; onChange: (v: unknown) => void }) {
  if (value === undefined || value === null) {
    return (
      <Button type="button" size="sm" variant="outline" onClick={() => onChange(emptyValue(field))}>
        <Plus className="size-3.5" /> Add {field.label.toLowerCase()}
      </Button>
    );
  }
  return (
    <div className="relative rounded-xl border bg-muted/25 p-3.5">
      {field.optional && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="absolute right-2 top-2 rounded-md p-1 text-subtle-foreground hover:bg-muted hover:text-foreground"
          aria-label={`Remove ${field.label}`}
          title={`Remove ${field.label.toLowerCase()}`}
        >
          <X className="size-3.5" />
        </button>
      )}
      <Fields fields={field.fields} value={value as Obj} onChange={onChange} />
    </div>
  );
}

function IconButton({ label, onClick, disabled, children, danger }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "rounded-md p-1.5 text-subtle-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30",
        danger && "hover:text-red-600",
      )}
    >
      {children}
    </button>
  );
}

export function ListEditor({
  field,
  value,
  onChange,
  filter = "",
  top = false,
}: {
  field: Pick<ListField, "fields" | "itemLabel" | "singular">;
  value: unknown[];
  onChange: (v: unknown[]) => void;
  filter?: string;
  top?: boolean;
}) {
  const [ids, setIds] = useState<string[]>(() => value.map(newId));
  const [open, setOpen] = useState<Set<string>>(new Set());
  const keys = ids.length === value.length ? ids : value.map((_, i) => ids[i] ?? newId());
  if (keys !== ids) setIds(keys);

  const toggle = (id: string) =>
    setOpen((o) => {
      const next = new Set(o);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const add = (atTop: boolean) => {
    const id = newId();
    const item = emptyItem(field.fields);
    onChange(atTop ? [item, ...value] : [...value, item]);
    setIds(atTop ? [id, ...keys] : [...keys, id]);
    setOpen((o) => new Set(o).add(id));
  };

  const move = (i: number, to: number) => {
    const v = [...value];
    const k = [...keys];
    [v[i], v[to]] = [v[to], v[i]];
    [k[i], k[to]] = [k[to], k[i]];
    onChange(v);
    setIds(k);
  };

  const duplicate = (i: number) => {
    const id = newId();
    onChange([...value.slice(0, i + 1), structuredClone(value[i]), ...value.slice(i + 1)]);
    setIds([...keys.slice(0, i + 1), id, ...keys.slice(i + 1)]);
    setOpen((o) => new Set(o).add(id));
  };

  const remove = (i: number) => {
    if (!confirm(`Delete "${itemTitle(value[i], field.itemLabel, field.singular)}"?`)) return;
    onChange(value.filter((_, j) => j !== i));
    setIds(keys.filter((_, j) => j !== i));
  };

  const needle = filter.trim().toLowerCase();

  return (
    <div className="space-y-2">
      {top && (
        <Button type="button" size="sm" variant="outline" onClick={() => add(true)}>
          <Plus className="size-3.5" /> Add {field.singular} at the top
        </Button>
      )}
      {value.length === 0 && <p className="text-sm text-muted-foreground">Nothing here yet.</p>}
      <ul className="space-y-2">
        {value.map((item, i) => {
          const id = keys[i];
          const title = itemTitle(item, field.itemLabel, field.singular);
          if (needle && !JSON.stringify(item).toLowerCase().includes(needle)) return null;
          const isOpen = open.has(id);
          return (
            <li key={id} className={cn("rounded-xl border bg-surface", isOpen && "shadow-sm")}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggle(id)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && e.target === e.currentTarget && (e.preventDefault(), toggle(id))}
                className="flex cursor-pointer items-center gap-2 px-3 py-2"
              >
                <ChevronRight className={cn("size-4 shrink-0 text-subtle-foreground transition-transform", isOpen && "rotate-90")} />
                <span className="font-mono text-[11px] text-subtle-foreground">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{title}</span>
                <span className="flex shrink-0 items-center">
                  <IconButton label="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}>
                    <ArrowUp className="size-3.5" />
                  </IconButton>
                  <IconButton label="Move down" disabled={i === value.length - 1} onClick={() => move(i, i + 1)}>
                    <ArrowDown className="size-3.5" />
                  </IconButton>
                  <IconButton label="Duplicate" onClick={() => duplicate(i)}>
                    <Copy className="size-3.5" />
                  </IconButton>
                  <IconButton label="Delete" danger onClick={() => remove(i)}>
                    <Trash2 className="size-3.5" />
                  </IconButton>
                </span>
              </div>
              {isOpen && (
                <div className="border-t px-3.5 py-3.5">
                  <Fields fields={field.fields} value={item as Obj} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <Button type="button" size="sm" variant="ghost" onClick={() => add(false)}>
        <Plus className="size-3.5" /> Add {field.singular}
      </Button>
    </div>
  );
}
