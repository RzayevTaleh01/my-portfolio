/**
 * Europass CV generated from the site content.
 *
 * The CV is not written anywhere by hand: every entry comes from src/content,
 * and src/content/cv/cv-config.json only says which entries are approved for
 * each region (see /admin). Pure module - runs on the server (the PDF route)
 * and in the browser (the admin preview).
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

export interface CvRegionConfig {
  /** Language the CV is written in. */
  language: Locale;
  /** Empty → the site headline. */
  headline: string;
  /** Empty → the site intro. */
  summary: string;
  /** Empty → the location the site shows for this region. */
  location: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  motherTongue: string;
  photo: boolean;
  /** Technologies line under each position and project. */
  showStack: boolean;
  /** Approved entries, by id (see `ids`). Anything not listed stays out of the CV. */
  items: string[];
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
  roleProject: (e: Experience, r: { title: string }, p: { name: string }) =>
    `${ids.role(e, r)}/${slug(p.name)}`,
  project: (p: { slug: string }) => `project:${p.slug}`,
  volunteering: (v: Volunteering) => `vol:${slug(v.organization)}`,
  education: (e: Education) => `edu:${slug(e.institution)}/${slug(e.field)}`,
  certificate: (c: Certificate) => `cert:${slug(c.title)}`,
  language: (l: Language) => `lang:${slug(l.name)}`,
  skill: (g: SkillGroup, s: string) => `skill:${slug(g.title)}/${slug(s)}`,
  publication: (p: Publication) => `pub:${p.id}`,
  social: (s: { platform: string }) => `social:${s.platform}`,
};

const emptyRegion: CvRegionConfig = {
  language: "en",
  headline: "",
  summary: "",
  location: "",
  phone: "",
  nationality: "",
  dateOfBirth: "",
  motherTongue: "",
  photo: true,
  showStack: true,
  items: [],
};

/** Fills anything missing, so an old or hand-edited config file still loads. */
export function normalizeConfig(raw: unknown): CvConfig {
  const input = (raw && typeof raw === "object" ? raw : {}) as Partial<CvConfig>;
  const region = (r: Region): CvRegionConfig => {
    const given = (input.regions?.[r] ?? {}) as Partial<CvRegionConfig>;
    const out = { ...emptyRegion, ...given };
    out.language = given.language === "sk" ? "sk" : "en";
    out.items = Array.isArray(given.items) ? given.items.filter((i): i is string => typeof i === "string") : [];
    return out;
  };
  return {
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : null,
    regions: { sk: region("sk"), intl: region("intl") },
  };
}

// ─── Catalog: everything in the system, for the admin panel ─

export interface CatalogItem {
  id: string;
  label: string;
  detail?: string;
  /** Nested entries (projects under a role, skills under a group). */
  children?: CatalogItem[];
}

export interface CatalogGroup {
  key: string;
  title: string;
  items: CatalogItem[];
}

function byPeriodDesc<T extends { period: string }>(list: T[]) {
  const start = (p: string) => {
    const m = p.match(/(\d{2})\/(\d{4})/) ?? p.match(/()(\d{4})/);
    return m ? Number(m[2]) * 100 + Number(m[1] || 0) : 0;
  };
  return [...list].sort((a, b) => start(b.period) - start(a.period));
}

/** Every entry the CV could contain. Labels in `locale`, ids from English. */
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
            children: (r.projects ?? []).map((p, pi) => ({
              id: ids.roleProject(e, r, p),
              label: lr.projects?.[pi]?.name ?? p.name,
              detail: lr.projects?.[pi]?.detail ?? p.detail,
            })),
          };
        }),
      ),
    },
    {
      key: "education",
      title: "Education",
      items: en.education.map((e, i) => {
        const l = t.education[i];
        return { id: ids.education(e), label: `${l.degree} - ${l.field}`, detail: `${l.institution} · ${l.period}` };
      }),
    },
    {
      key: "projects",
      title: "Projects",
      items: en.projects.map((p, i) => {
        const l = t.projects[i];
        return { id: ids.project(p), label: l.title, detail: `${p.kind}${p.organization ? ` · ${p.organization}` : ""} · ${p.year}` };
      }),
    },
    {
      key: "volunteering",
      title: "Volunteering & training",
      items: en.volunteering.map((v, i) => {
        const l = t.volunteering[i];
        return { id: ids.volunteering(v), label: `${l.role} · ${l.organization}`, detail: l.period };
      }),
    },
    {
      key: "skills",
      title: "Digital skills",
      items: en.skills.map((g, gi) => ({
        id: `group:${slug(g.title)}`,
        label: t.skills[gi].title,
        children: g.skills.map((s, si) => ({ id: ids.skill(g, s), label: t.skills[gi].skills[si] ?? s })),
      })),
    },
    {
      key: "languages",
      title: "Languages",
      items: en.languages.map((l, i) => ({ id: ids.language(l), label: t.languages[i].name, detail: t.languages[i].level })),
    },
    {
      key: "certificates",
      title: "Certificates",
      items: en.certificates.map((c, i) => ({ id: ids.certificate(c), label: t.certificates[i].title, detail: t.certificates[i].issuer })),
    },
    {
      key: "publications",
      title: "Publications",
      items: en.publications.map((p) => ({ id: ids.publication(p), label: p.title, detail: `${p.venueShort ?? p.venue} ${p.year}` })),
    },
    {
      key: "links",
      title: "Links",
      items: en.profile.socials.map((s) => ({ id: ids.social(s), label: s.label, detail: s.href.replace(/^mailto:/, "") })),
    },
  ];
}

/** All ids a catalog knows, flattened. Group ids ("group:…") are only for the UI. */
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
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  address: string;
  website: string;
  technologies: string;
  present: string;
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
    email: "Email address",
    phone: "Phone number",
    nationality: "Nationality",
    dateOfBirth: "Date of birth",
    address: "Address",
    website: "Website",
    technologies: "Technologies",
    present: "Present",
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
    email: "E-mailová adresa",
    phone: "Telefónne číslo",
    nationality: "Štátna príslušnosť",
    dateOfBirth: "Dátum narodenia",
    address: "Adresa",
    website: "Webová stránka",
    technologies: "Technológie",
    present: "súčasnosť",
  },
};

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
  contact: { label: string; value: string; href?: string }[];
  links: { label: string; href: string }[];
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

const pretty = (href: string) => href.replace(/^(https?:\/\/(www\.)?|mailto:)/, "").replace(/\/$/, "");

/**
 * The CV for one region: only approved entries, in the region's language.
 * `photo` is the picture as the PDF renderer can load it (see CvImage).
 */
export function buildCvData(source: CvSource, config: CvRegionConfig, region: Region, photo: CvImage): CvDocumentData {
  const lang = config.language;
  const en = source.en;
  const t = source[lang];
  const on = new Set(config.items);
  const L = labels[lang];

  const experience: CvEntry[] = [];
  en.experience.forEach((e, ei) =>
    e.roles.forEach((r, ri) => {
      if (!on.has(ids.role(e, r))) return;
      const le = t.experience[ei];
      const lr = le.roles[ri];
      const projects = (r.projects ?? [])
        .map((p, pi) => ({ id: ids.roleProject(e, r, p), p: lr.projects?.[pi] ?? p }))
        .filter((x) => on.has(x.id))
        .map(({ p }) => `${p.name} - ${p.detail}${p.points?.length ? ` ${p.points.join(" ")}` : ""}`);
      experience.push({
        period: lr.period,
        title: lr.title,
        organization: le.organization,
        location: le.location,
        summary: lr.summary,
        bullets: [...(lr.highlights ?? []), ...projects],
        stack: config.showStack ? r.stack : undefined,
      });
    }),
  );

  const education = byPeriodDesc(
    en.education
      .map((e, i) => ({ e, l: t.education[i] }))
      .filter(({ e }) => on.has(ids.education(e)))
      .map(({ l }) => ({ period: l.period, title: `${l.degree} - ${l.field}`, organization: l.institution, location: l.location, bullets: [] })),
  );

  const projects: CvEntry[] = en.projects
    .map((p, i) => ({ p, l: t.projects[i] }))
    .filter(({ p }) => on.has(ids.project(p)))
    .map(({ p, l }) => ({
      period: String(p.year),
      title: l.title,
      organization: p.organization ?? "",
      summary: l.tagline,
      bullets: [],
      stack: config.showStack ? p.stack.flatMap((g) => g.items).slice(0, 12) : undefined,
      link: p.links.demo ?? p.links.repo,
    }));

  const volunteering: CvEntry[] = en.volunteering
    .map((v, i) => ({ v, l: t.volunteering[i] }))
    .filter(({ v }) => on.has(ids.volunteering(v)))
    .map(({ v, l }) => ({
      period: l.period,
      title: l.role,
      organization: l.organization,
      location: l.location,
      summary: l.summary,
      bullets: l.highlights ?? [],
      stack: config.showStack ? v.stack : undefined,
      link: v.credential?.href,
    }));

  const skills = en.skills
    .map((g, gi) => ({
      title: t.skills[gi].title,
      items: g.skills.filter((s) => on.has(ids.skill(g, s))).map((s) => t.skills[gi].skills[g.skills.indexOf(s)] ?? s),
    }))
    .filter((g) => g.items.length > 0);

  const socials = en.profile.socials.map((s, i) => ({ s, l: t.profile.socials[i] }));
  const email = socials.find(({ s }) => s.platform === "email" && on.has(ids.social(s)));
  const links = socials
    .filter(({ s }) => s.platform !== "email" && on.has(ids.social(s)))
    .map(({ s, l }) => ({ label: l.label, href: s.href }));

  const contact: CvDocumentData["contact"] = [];
  if (config.nationality) contact.push({ label: L.nationality, value: config.nationality });
  if (config.dateOfBirth) contact.push({ label: L.dateOfBirth, value: config.dateOfBirth });
  if (config.phone) contact.push({ label: L.phone, value: config.phone, href: `tel:${config.phone.replace(/\s/g, "")}` });
  if (email && t.profile.email) contact.push({ label: L.email, value: t.profile.email, href: `mailto:${t.profile.email}` });
  // Left out until NEXT_PUBLIC_SITE_URL points at the real domain.
  if (!/localhost|127\.0\.0\.1/.test(t.profile.siteUrl)) {
    contact.push({ label: L.website, value: pretty(t.profile.siteUrl), href: t.profile.siteUrl });
  }
  contact.push({ label: L.address, value: config.location || t.regionLocation[region] });

  return {
    language: lang,
    labels: L,
    name: t.profile.name,
    headline: config.headline || t.profile.headline,
    summary: config.summary || t.profile.intro,
    photo: config.photo ? photo : null,
    contact,
    links,
    experience,
    education,
    motherTongue: config.motherTongue,
    languages: en.languages
      .map((l, i) => ({ l, tl: t.languages[i] }))
      .filter(({ l }) => on.has(ids.language(l)))
      .map(({ tl }) => ({ name: tl.name, level: tl.level })),
    skills,
    projects,
    volunteering,
    certificates: en.certificates
      .map((c, i) => ({ c, l: t.certificates[i] }))
      .filter(({ c }) => on.has(ids.certificate(c)))
      .map(({ c, l }) => ({ title: l.title, issuer: l.issuer, link: c.link })),
    publications: en.publications
      .filter((p) => on.has(ids.publication(p)))
      .map((p) => `${p.authors.join(", ")}. ${p.title}. ${p.venue}, ${p.year}.`),
  };
}
