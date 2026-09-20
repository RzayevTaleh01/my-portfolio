import type { Locale } from "@/i18n/config";
import { certificates, education, educationIntl, experience, languages, volunteering } from "./experience";
import { core as skCore } from "./i18n/sk/core";
import { projects as skProjects } from "./i18n/sk/projects";
import type { ContentOverrides } from "./i18n/types";
import { mergeOverride } from "./localize";
import { profile } from "./profile";
import { archive, projects } from "./projects";
import { publications } from "./publications";
import { researchDirections, researchStatement, skills } from "./skills";

export * from "./types";

/** English is the source; other locales are text-only overrides (see ./localize.ts). */
const english = {
  profile,
  experience,
  volunteering,
  education,
  educationIntl,
  certificates,
  languages,
  skills,
  researchStatement,
  researchDirections,
  projects,
  archive,
  publications,
};

export type SiteContent = typeof english & { getProject: (slug: string) => (typeof projects)[number] | null };

const overrides: Record<Locale, ContentOverrides> = {
  en: {},
  sk: { ...skCore, projects: skProjects },
};

function build(locale: Locale): SiteContent {
  const o = overrides[locale];
  const localizedProjects = english.projects.map((p) =>
    mergeOverride(p, o.projects?.[p.slug], `${locale}.projects.${p.slug}`),
  );
  const content = {
    profile: mergeOverride(english.profile, o.profile, `${locale}.profile`),
    experience: mergeOverride(english.experience, o.experience, `${locale}.experience`),
    volunteering: mergeOverride(english.volunteering, o.volunteering, `${locale}.volunteering`),
    education: mergeOverride(english.education, o.education, `${locale}.education`),
    educationIntl: mergeOverride(english.educationIntl, o.educationIntl, `${locale}.educationIntl`),
    certificates: mergeOverride(english.certificates, o.certificates, `${locale}.certificates`),
    languages: mergeOverride(english.languages, o.languages, `${locale}.languages`),
    skills: mergeOverride(english.skills, o.skills, `${locale}.skills`),
    researchStatement: o.researchStatement ?? english.researchStatement,
    researchDirections: mergeOverride(english.researchDirections, o.researchDirections, `${locale}.researchDirections`),
    projects: localizedProjects,
    archive: mergeOverride(english.archive, o.archive, `${locale}.archive`),
    publications: english.publications,
  };
  return { ...content, getProject: (slug) => localizedProjects.find((p) => p.slug === slug) ?? null };
}

const cache = new Map<Locale, SiteContent>();

/** All site content, translated into the given locale. */
export function getContent(locale: Locale): SiteContent {
  let content = cache.get(locale);
  if (!content) {
    content = build(locale);
    cache.set(locale, content);
  }
  return content;
}

/** Navigation order; labels come from the dictionary (`dict.nav[key]`). */
export const navigation = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/research", key: "research" },
  { href: "/writing", key: "articles" },
  { href: "/about", key: "about" },
  { href: "/cv", key: "cv" },
] as const;
