export const textKeys = [
  "home.role",
  "home.engineeringTitle",
  "home.engineeringText",
  "home.researchTitle",
  "projects.description",
  "projects.groups.work.intro",
  "projects.groups.freelance.intro",
  "projects.groups.research.intro",
  "projects.groups.hobby.intro",
  "writing.description",
  "assistant.subtitle",
  "assistant.greeting",
  "assistant.teaser",
  "assistant.topics.who",
  "assistant.links.who",
  "assistant.answers.who",
  "assistant.answers.experience",
  "assistant.answers.role",
  "assistant.answers.skills",
  "assistant.answers.projects",
  "assistant.answers.research",
  "assistant.answers.education",
  "assistant.answers.educationItem",
  "assistant.answers.articles",
  "assistant.answers.cv",
  "assistant.answers.contact",
] as const;

export type TextKey = (typeof textKeys)[number];

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}

export function withTexts<T>(dictionary: T, texts: Partial<Record<string, string>>): T {
  const out = structuredClone(dictionary) as Record<string, unknown>;
  for (const [path, value] of Object.entries(texts)) {
    if (!value) continue;
    const keys = path.split(".");
    const last = keys.pop()!;
    const parent = keys.reduce<Record<string, unknown> | undefined>((o, k) => o?.[k] as Record<string, unknown> | undefined, out);
    if (parent && typeof parent[last] === "string") parent[last] = value;
  }
  return out as T;
}
