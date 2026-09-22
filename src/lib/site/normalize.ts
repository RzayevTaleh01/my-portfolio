import { isLocalized } from "./localized";
import type { Field } from "./schema";

const isLocalizable = (f: Field) => "localized" in f && f.localized === true;

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (isLocalized(value)) return isEmpty(value.en) && isEmpty(value.sk);
  if (typeof value === "object") return Object.values(value).every(isEmpty);
  return false;
}

function cleanLines(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.map((v) => (typeof v === "string" ? v.trim() : v)).filter((v) => !isEmpty(v));
}

function cleanValue(field: Field, value: unknown): unknown {
  if (isLocalized(value)) {
    const inner = (v: unknown) => cleanValue({ ...field, localized: false } as Field, v);
    const en = inner(value.en);
    const sk = inner(value.sk);
    return isEmpty(sk) ? en : { en, sk };
  }
  switch (field.kind) {
    case "lines":
    case "tags":
      return cleanLines(value);
    case "number":
      return typeof value === "number" ? value : Number(value) || 0;
    case "checkbox":
      return value === true;
    case "object":
      return value && typeof value === "object" ? cleanFields(field.fields, value as Record<string, unknown>) : value;
    case "list":
      return Array.isArray(value) ? value.map((item) => cleanFields(field.fields, item as Record<string, unknown>)) : [];
    default:
      return typeof value === "string" ? value : value ?? "";
  }
}

export function cleanFields(fields: Field[], value: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const cleaned = cleanValue(field, value?.[field.key]);
    if (field.optional && (isEmpty(cleaned) || (field.kind === "checkbox" && cleaned === false))) continue;
    out[field.key] = cleaned;
  }
  return out;
}

export function cleanSection(fields: Field[], list: boolean, value: unknown): unknown {
  if (list) return Array.isArray(value) ? value.map((item) => cleanFields(fields, item as Record<string, unknown>)) : [];
  return cleanFields(fields, (value ?? {}) as Record<string, unknown>);
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export function fromLocales(fields: Field[], en: Record<string, unknown>, sk: Record<string, unknown> | undefined, path: string, warn: (msg: string) => void) {
  const known = new Set(fields.map((f) => f.key));
  for (const key of Object.keys(en ?? {})) {
    if (!known.has(key)) warn(`${path}.${key}: not in the schema`);
  }
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const a = en?.[field.key];
    const b = sk?.[field.key];
    if (a === undefined) continue;
    out[field.key] = merge(field, a, b, `${path}.${field.key}`, warn);
  }
  return out;
}

function merge(field: Field, a: unknown, b: unknown, path: string, warn: (msg: string) => void): unknown {
  if (field.kind === "object") {
    return fromLocales(field.fields, a as Record<string, unknown>, b as Record<string, unknown> | undefined, path, warn);
  }
  if (field.kind === "list") {
    const bs = Array.isArray(b) ? b : [];
    if (Array.isArray(b) && b.length !== (a as unknown[]).length) warn(`${path}: ${(a as unknown[]).length} EN items, ${b.length} SK items`);
    return (a as Record<string, unknown>[]).map((item, i) => fromLocales(field.fields, item, bs[i], `${path}[${i}]`, warn));
  }
  if (b === undefined || same(a, b)) return a;
  if (isLocalizable(field)) return { en: a, sk: b };
  warn(`${path}: SK differs but the field is not localized (${JSON.stringify(a).slice(0, 60)} / ${JSON.stringify(b).slice(0, 60)})`);
  return a;
}
