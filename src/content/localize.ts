export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export function mergeOverride<T>(base: T, override: unknown, path = "content"): T {
  if (override === undefined || override === null) return base;

  if (Array.isArray(base)) {
    if (!Array.isArray(override)) throw new Error(`Translation at "${path}" must be an array.`);
    if (override.length !== base.length) {
      throw new Error(
        `Translation at "${path}" has ${override.length} items but the English content has ${base.length}.`,
      );
    }
    return base.map((item, i) => mergeOverride(item, override[i], `${path}[${i}]`)) as T;
  }

  if (base !== null && typeof base === "object") {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
      out[key] = mergeOverride((base as Record<string, unknown>)[key], value, `${path}.${key}`);
    }
    return out as T;
  }

  return override as T;
}
