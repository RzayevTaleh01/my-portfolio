/**
 * Europass CV generated from the site content.
 *
 * Every entry comes from src/content. The saved config (see /admin) says which
 * entries are approved for each region and holds any text edited for the CV
 * only - the site keeps its own wording. Pure module: runs on the server (the
 * PDF route) and in the browser (the admin preview).
 */
import type { Locale } from "@/i18n/config";
import type { Region } from "@/i18n/region";
import type {
  Certificate,
  Education,
  Experience,
  Language,
  Profile,
  Project,
  Publication,
  SkillGroup,
  SocialPlatform,
  Volunteering,
} from "@/content/types";

// ─── Source: the site content, as the CV needs it ─────────

export type CvProject = Pick<Project, "slug" | "title" | "tagline" | "kind" | "organization" | "year" | "links" | "stack">;

export interface CvLocaleSource {
  profile: Profile;
  /** Where the site says you live, per region (see src/content/locations.ts). */
  regionLocation: Record<Region, string>;
  experience: Experience[];
  volunteering: Volunteering[];
  /** `education` and `educationIntl` together, without duplicates. */
  education: Education[];
  certificates: Certificate[];
  languages: Language[];
  skills: SkillGroup[];
  projects: CvProject[];
  publications: Publication[];
}

/** English content and its translations. IDs are always taken from English, so they survive translation. */
export type CvSource = Record<Locale, CvLocaleSource>;

// ─── Config: what is approved for each region ─────────────

/** CV-only text, by entry id and field. A field that is present wins over the site text, even when empty. */
export type CvOverrides = Record<string, Record<string, string>>;

export interface CvRegionConfig {
  /** Language the CV is written in. */
  language: Locale;
  // Header. Empty → the site value; "-" → left out.
  name: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  website: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  motherTongue: string;
  photo: boolean;
  /** Technologies line under each position and project. */
  showStack: boolean;
  /** Approved entries, by id (see `ids`). Anything not listed stays out of the CV. */
  items: string[];
  overrides: CvOverrides;
}

export interface CvConfig {
  updatedAt: string | null;
  regions: Record<Region, CvRegionConfig>;
}

export const regionLabels: Record<Region, string> = {
  sk: "Slovakia",
  intl: "Other countries",
};

/** Where each region's generated PDF is served (src/app/cv/[file]/route.ts). */
export const cvFiles: Record<Region, string> = {
  sk: "taleh-rzayev-cv-sk.pdf",
  intl: "taleh-rzayev-cv.pdf",
};

export function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Stable ids, built from the English text. */
export const ids = {
  role: (e: Experience, r: { title: string }) => `exp:${slug(e.organization)}/${slug(r.title)}`,
  roleProject: (e: Experience, r: { title: string }, p: { name: string }) => `${ids.role(e, r)}/${slug(p.name)}`,
  project: (p: { slug: string }) => `project:${p.slug}`,
  volunteering: (v: Volunteering) => `vol:${slug(v.organization)}`,
  education: (e: Education) => `edu:${slug(e.institution)}/${slug(e.field)}`,
  certificate: (c: Certificate) => `cert:${slug(c.title)}`,
  language: (l: Language) => `lang:${slug(l.name)}`,
  skillGroup: (g: SkillGroup) => `group:${slug(g.title)}`,
  skill: (g: SkillGroup, s: string) => `skill:${slug(g.title)}/${slug(s)}`,
  publication: (p: Publication) => `pub:${p.id}`,
  social: (s: { platform: string }) => `social:${s.platform}`,
};

const emptyRegion: CvRegionConfig = {
  language: "en",
  name: "",
  headline: "",
  summary: "",
  location: "",
  email: "",
  website: "",
  phone: "",
  nationality: "",
  dateOfBirth: "",
  motherTongue: "",
  photo: true,
  showStack: true,
  items: [],
  overrides: {},
};

function cleanOverrides(raw: unknown): CvOverrides {
  const out: CvOverrides = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [id, fields] of Object.entries(raw as Record<string, unknown>)) {
    if (!fields || typeof fields !== "object") continue;
    const kept = Object.entries(fields as Record<string, unknown>).filter((e): e is [string, string] => typeof e[1] === "string");
    if (kept.length) out[id] = Object.fromEntries(kept);
  }
  return out;
}

/** Fills anything missing, so an old or hand-edited config still loads. */
export function normalizeConfig(raw: unknown): CvConfig {
  const input = (raw && typeof raw === "object" ? raw : {}) as Partial<CvConfig>;
  const region = (r: Region): CvRegionConfig => {
    const given = (input.regions?.[r] ?? {}) as Partial<CvRegionConfig>;
    const out = { ...emptyRegion, ...given };
    out.language = given.language === "sk" ? "sk" : "en";
    out.items = Array.isArray(given.items) ? given.items.filter((i): i is string => typeof i === "string") : [];
    out.overrides = cleanOverrides(given.overrides);
    return out;
  };
  return {
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : null,
    regions: { sk: region("sk"), intl: region("intl") },
  };
}

// ─── Catalog: everything in the system, with its editable fields ─

export interface CvField {
  key: string;
  label: string;
  /** The site's text - what the CV shows unless it is edited. */
  value: string;
  multiline?: boolean;
}

export interface CatalogItem {
  id: string;
  label: string;
  detail?: string;
  fields: CvField[];
  /** Nested entries (projects under a role, skills under a group). */
  children?: CatalogItem[];
  platform?: SocialPlatform;
}

export interface CatalogGroup {
  key: "experience" | "education" | "projects" | "volunteering" | "skills" | "languages" | "certificates" | "publications" | "links";
  title: string;
  items: CatalogItem[];
}

const field = (key: string, label: string, value: string | undefined, multiline = false): CvField => ({
  key,
  label,
  value: value ?? "",
  multiline,
});

const bulletsHint = "Bullet points (one per line)";
const stackHint = "Technologies (comma separated)";

/** Every entry the CV could contain. Text in `locale`, ids from English. */
export function buildCatalog(source: CvSource, locale: Locale): CatalogGroup[] {
  const en = source.en;
  const t = source[locale];

  return [
    {
      key: "experience",
      title: "Work experience",
      items: en.experience.flatMap((e, ei) =>
        e.roles.map((r, ri) => {
          const le = t.experience[ei];
          const lr = le.roles[ri];
          return {
            id: ids.role(e, r),
            label: `${lr.title} · ${le.organization}`,
            detail: lr.period,
            fields: [
              field("title", "Position", lr.title),
              field("organization", "Organisation", le.organization),
              field("period", "Period", lr.period),
              field("location", "Location", le.location),
              field("summary", "Summary", lr.summary, true),
              field("highlights", bulletsHint, (lr.highlights ?? []).join("\n"), true),
              field("stack", stackHint, (r.stack ?? []).join(", ")),
            ],
            children: (r.projects ?? []).map((p, pi) => {
              const lp = lr.projects?.[pi] ?? p;
              const text = `${lp.name} - ${lp.detail}${lp.points?.length ? ` ${lp.points.join(" ")}` : ""}`;
              return { id: ids.roleProject(e, r, p), label: lp.name, detail: lp.detail, fields: [field("text", "Bullet", text, true)] };
            }),
          };
        }),
      ),
    },
    {
      key: "education",
      title: "Education",
      items: en.education.map((e, i) => {
        const l = t.education[i];
        return {
          id: ids.education(e),
          label: `${l.degree} - ${l.field}`,
          detail: `${l.institution} · ${l.period}`,
          fields: [
            field("title", "Degree", `${l.degree} - ${l.field}`),
            field("organization", "Institution", l.institution),
            field("period", "Period", l.period),
            field("location", "Location", l.location),
            field("summary", "Description", "", true),
          ],
        };
      }),
    },
    {
      key: "projects",
      title: "Projects",
      items: en.projects.map((p, i) => {
        const l = t.projects[i];
        return {
          id: ids.project(p),
          label: l.title,
          detail: `${p.kind}${p.organization ? ` · ${p.organization}` : ""} · ${p.year}`,
          fields: [
            field("title", "Title", l.title),
            field("organization", "Organisation", p.organization),
            field("period", "Period", String(p.year)),
            field("summary", "Description", l.tagline, true),
            field("highlights", bulletsHint, "", true),
            field("stack", stackHint, p.stack.flatMap((g) => g.items).slice(0, 12).join(", ")),
            field("link", "Link", p.links.demo ?? p.links.repo),
          ],
        };
      }),
    },
    {
      key: "volunteering",
      title: "Volunteering & training",
      items: en.volunteering.map((v, i) => {
        const l = t.volunteering[i];
        return {
          id: ids.volunteering(v),
          label: `${l.role} · ${l.organization}`,
          detail: l.period,
          fields: [
            field("title", "Role", l.role),
            field("organization", "Organisation", l.organization),
            field("period", "Period", l.period),
            field("location", "Location", l.location),
            field("summary", "Summary", l.summary, true),
            field("highlights", bulletsHint, (l.highlights ?? []).join("\n"), true),
            field("stack", stackHint, (v.stack ?? []).join(", ")),
            field("link", "Link", v.credential?.href),
          ],
        };
      }),
    },
    {
      key: "skills",
      title: "Digital skills",
      items: en.skills.map((g, gi) => ({
        id: ids.skillGroup(g),
        label: t.skills[gi].title,
        fields: [field("title", "Group title", t.skills[gi].title)],
        children: g.skills.map((s, si) => {
          const label = t.skills[gi].skills[si] ?? s;
          return { id: ids.skill(g, s), label, fields: [field("label", "Skill", label)] };
        }),
      })),
    },
    {
      key: "languages",
      title: "Languages",
      items: en.languages.map((l, i) => ({
        id: ids.language(l),
        label: t.languages[i].name,
        detail: t.languages[i].level,
        fields: [field("name", "Language", t.languages[i].name), field("level", "Level", t.languages[i].level)],
      })),
    },
    {
      key: "certificates",
      title: "Certificates",
      items: en.certificates.map((c, i) => ({
        id: ids.certificate(c),
        label: t.certificates[i].title,
        detail: t.certificates[i].issuer,
        fields: [
          field("title", "Title", t.certificates[i].title),
          field("issuer", "Issuer", t.certificates[i].issuer),
          field("link", "Link", c.link),
        ],
      })),
    },
    {
      key: "publications",
      title: "Publications",
      items: en.publications.map((p) => ({
        id: ids.publication(p),
        label: p.title,
        detail: `${p.venueShort ?? p.venue} ${p.year}`,
        fields: [field("text", "Citation", `${p.authors.join(", ")}. ${p.title}. ${p.venue}, ${p.year}.`, true)],
      })),
    },
    {
      key: "links",
      title: "Links",
      items: en.profile.socials.map((s) => ({
        id: ids.social(s),
        label: s.label,
        detail: s.href.replace(/^mailto:/, ""),
        platform: s.platform,
        // The e-mail address is edited in the header fields.
        fields: s.platform === "email" ? [] : [field("url", "URL", s.href)],
      })),
    },
  ];
}

/** Ids that can be approved (group rows are only a UI shortcut for their children). */
export function catalogIds(catalog: CatalogGroup[]) {
  const out = new Set<string>();
  const walk = (items: CatalogItem[]) =>
    items.forEach((i) => {
      if (!i.id.startsWith("group:")) out.add(i.id);
      if (i.children) walk(i.children);
    });
  catalog.forEach((g) => walk(g.items));
  return out;
}

/** Ids that can carry edits: every entry, including group rows. */
export function editableIds(catalog: CatalogGroup[]) {
  const out = new Set<string>();
  const walk = (items: CatalogItem[]) =>
    items.forEach((i) => {
      out.add(i.id);
      if (i.children) walk(i.children);
    });
  catalog.forEach((g) => walk(g.items));
  return out;
}

// ─── The resolved document ────────────────────────────────

export interface CvLabels {
  aboutMe: string;
  workExperience: string;
  education: string;
  languageSkills: string;
  motherTongue: string;
  otherLanguages: string;
  digitalSkills: string;
  projects: string;
  volunteering: string;
  certificates: string;
  publications: string;
  technologies: string;
}

const labels: Record<Locale, CvLabels> = {
  en: {
    aboutMe: "About me",
    workExperience: "Work experience",
    education: "Education and training",
    languageSkills: "Language skills",
    motherTongue: "Mother tongue(s)",
    otherLanguages: "Other language(s)",
    digitalSkills: "Digital skills",
    projects: "Projects",
    volunteering: "Volunteering and training",
    certificates: "Certificates",
    publications: "Publications",
    technologies: "Technologies",
  },
  sk: {
    aboutMe: "O mne",
    workExperience: "Pracovné skúsenosti",
    education: "Vzdelávanie a odborná príprava",
    languageSkills: "Jazykové zručnosti",
    motherTongue: "Materinský jazyk",
    otherLanguages: "Ďalšie jazyky",
    digitalSkills: "Digitálne zručnosti",
    projects: "Projekty",
    volunteering: "Dobrovoľníctvo a odborná príprava",
    certificates: "Certifikáty",
    publications: "Publikácie",
    technologies: "Technológie",
  },
};

export type CvIcon = "email" | "phone" | "website" | "location" | "nationality" | "birthday" | SocialPlatform;

export interface CvContact {
  icon: CvIcon;
  value: string;
  href?: string;
}

export interface CvEntry {
  period: string;
  title: string;
  organization: string;
  location?: string;
  summary?: string;
  bullets: string[];
  stack?: string[];
  link?: string;
}

/** A URL in the browser, the file bytes on the server. */
export type CvImage = string | { data: Buffer; format: "jpg" | "png" };

export interface CvDocumentData {
  language: Locale;
  labels: CvLabels;
  name: string;
  headline: string;
  summary: string;
  photo: CvImage | null;
  contact: CvContact[];
  experience: CvEntry[];
  education: CvEntry[];
  motherTongue: string;
  languages: { name: string; level: string }[];
  skills: { title: string; items: string[] }[];
  projects: CvEntry[];
  volunteering: CvEntry[];
  certificates: { title: string; issuer: string; link?: string }[];
  publications: string[];
}

export const pretty = (href: string) => href.replace(/^(https?:\/\/(www\.)?|mailto:|tel:)/, "").replace(/\/$/, "");
const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

function byPeriodDesc<T extends { period: string }>(items: T[]) {
  const start = (p: string) => {
    const m = p.match(/(\d{2})\/(\d{4})/) ?? p.match(/()(\d{4})/);
    return m ? Number(m[2]) * 100 + Number(m[1] || 0) : 0;
  };
  return [...items].sort((a, b) => start(b.period) - start(a.period));
}

/** A header field: empty → the site value, "-" → left out. */
function header(value: string, fallback: string) {
  const v = value.trim();
  if (v === "-") return "";
  return v || fallback;
}

/** An entry's fields with the CV edits applied. */
export function resolveFields(item: CatalogItem, overrides: CvOverrides): Record<string, string> {
  const edits = overrides[item.id] ?? {};
  return Object.fromEntries(item.fields.map((f) => [f.key, edits[f.key] ?? f.value]));
}

/**
 * The CV for one region: approved entries only, in the region's language, with
 * the CV edits applied. `photo` is the picture as the renderer can load it.
 */
export function buildCvData(source: CvSource, config: CvRegionConfig, region: Region, photo: CvImage): CvDocumentData {
  const t = source[config.language];
  const on = new Set(config.items);
  const catalog = buildCatalog(source, config.language);
  const group = (key: CatalogGroup["key"]) => catalog.find((g) => g.key === key)!.items;
  const val = (item: CatalogItem) => resolveFields(item, config.overrides);
  const approved = (key: CatalogGroup["key"]) => group(key).filter((i) => on.has(i.id));
  const stack = (s: string | undefined) => (config.showStack && s ? list(s) : undefined);

  const entry = (item: CatalogItem, extraBullets: string[] = []): CvEntry => {
    const v = val(item);
    return {
      period: v.period ?? "",
      title: v.title ?? "",
      organization: v.organization ?? "",
      location: v.location || undefined,
      summary: v.summary || undefined,
      bullets: [...lines(v.highlights ?? ""), ...extraBullets],
      stack: stack(v.stack),
      link: v.link || undefined,
    };
  };

  const experience = approved("experience").map((item) =>
    entry(
      item,
      (item.children ?? []).filter((c) => on.has(c.id)).map((c) => val(c).text).filter(Boolean),
    ),
  );

  const skills = group("skills")
    .map((g) => ({
      title: val(g).title,
      items: (g.children ?? []).filter((c) => on.has(c.id)).map((c) => val(c).label).filter(Boolean),
    }))
    .filter((g) => g.items.length > 0);

  // Header: e-mail, phone, website, address, then the approved links.
  const contact: CvContact[] = [];
  const email = header(config.email, t.profile.email ?? "");
  if (email && on.has("social:email")) contact.push({ icon: "email", value: email, href: `mailto:${email}` });
  const phone = header(config.phone, "");
  if (phone) contact.push({ icon: "phone", value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` });
  // The site URL only once it is a real domain (NEXT_PUBLIC_SITE_URL).
  const siteUrl = /localhost|127\.0\.0\.1/.test(t.profile.siteUrl) ? "" : t.profile.siteUrl;
  const website = header(config.website, siteUrl);
  if (website) contact.push({ icon: "website", value: pretty(website), href: /^https?:/.test(website) ? website : `https://${website}` });
  const location = header(config.location, t.regionLocation[region]);
  if (location) contact.push({ icon: "location", value: location });
  const nationality = header(config.nationality, "");
  if (nationality) contact.push({ icon: "nationality", value: nationality });
  const birthday = header(config.dateOfBirth, "");
  if (birthday) contact.push({ icon: "birthday", value: birthday });
  approved("links")
    .filter((s) => s.platform !== "email")
    .forEach((s) => {
      const url = val(s).url;
      if (url) contact.push({ icon: s.platform!, value: pretty(url), href: url });
    });

  return {
    language: config.language,
    labels: labels[config.language],
    name: header(config.name, t.profile.name),
    headline: header(config.headline, t.profile.headline),
    summary: header(config.summary, t.profile.intro),
    photo: config.photo ? photo : null,
    contact,
    experience,
    education: byPeriodDesc(approved("education").map((i) => entry(i))),
    motherTongue: header(config.motherTongue, ""),
    languages: approved("languages").map((i) => {
      const v = val(i);
      return { name: v.name, level: v.level };
    }),
    skills,
    projects: approved("projects").map((i) => entry(i)),
    volunteering: approved("volunteering").map((i) => entry(i)),
    certificates: approved("certificates").map((i) => {
      const v = val(i);
      return { title: v.title, issuer: v.issuer, link: v.link || undefined };
    }),
    publications: approved("publications").map((i) => val(i).text).filter(Boolean),
  };
}
