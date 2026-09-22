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

export type CvProject = Pick<Project, "slug" | "title" | "tagline" | "kind" | "organization" | "year" | "links" | "stack">;

export interface CvLocaleSource {
  profile: Profile;
  regionLocation: Record<Region, string>;
  experience: Experience[];
  volunteering: Volunteering[];
  education: Education[];
  certificates: Certificate[];
  languages: Language[];
  skills: SkillGroup[];
  projects: CvProject[];
  publications: Publication[];
}

export type CvSource = Record<Locale, CvLocaleSource>;

export type CvOverrides = Record<string, Record<string, string>>;

export interface CvRegionConfig {
  language: Locale;
  ownCopy: boolean;
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
  showStack: boolean;
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

export const regions: Region[] = ["sk", "intl"];

export function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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
  ownCopy: false,
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

export function normalizeConfig(raw: unknown): CvConfig {
  const input = (raw && typeof raw === "object" ? raw : {}) as Partial<CvConfig>;
  const region = (r: Region): CvRegionConfig => {
    const given = (input.regions?.[r] ?? {}) as Partial<CvRegionConfig>;
    const out = { ...emptyRegion, ...given };
    out.language = given.language === "sk" ? "sk" : "en";
    out.ownCopy = given.ownCopy === true;
    out.items = Array.isArray(given.items) ? given.items.filter((i): i is string => typeof i === "string") : [];
    out.overrides = cleanOverrides(given.overrides);
    return out;
  };
  return {
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : null,
    regions: { sk: region("sk"), intl: region("intl") },
  };
}

export interface CvField {
  key: string;
  label: string;
  value: string;
  multiline?: boolean;
}

export interface CatalogItem {
  id: string;
  label: string;
  detail?: string;
  fields: CvField[];
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
        fields: s.platform === "email" ? [] : [field("url", "URL", s.href)],
      })),
    },
  ];
}

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

export function flatItems(catalog: CatalogGroup[] | CatalogItem[]): CatalogItem[] {
  const items = (catalog as (CatalogGroup | CatalogItem)[]).flatMap((x) => ("items" in x ? x.items : [x]));
  return items.flatMap((i) => [i, ...flatItems(i.children ?? [])]);
}

export function siteFields(item: CatalogItem): Record<string, string> {
  return Object.fromEntries(item.fields.map((f) => [f.key, f.value]));
}

export const siteHeaderKeys = ["name", "headline", "summary", "email", "website", "location"] as const;

export function siteHeader(source: CvSource, language: Locale, region: Region): Record<(typeof siteHeaderKeys)[number], string> {
  const t = source[language];
  return {
    name: t.profile.name,
    headline: t.profile.headline,
    summary: t.profile.intro,
    email: t.profile.email ?? "",
    website: portfolioOf(t.profile).url,
    location: t.regionLocation[region],
  };
}

export function portfolioOf(profile: Profile) {
  const url = (profile.website || (/localhost|127\.0\.0\.1/.test(profile.siteUrl) ? "" : profile.siteUrl)).replace(/\/$/, "");
  return { url, label: profile.websiteLabel || pretty(url) };
}

function publicSite(url: string, portfolio: string) {
  return portfolio && /\.vercel\.app/i.test(url) ? portfolio : url;
}

export function withOwnCopy(source: CvSource, region: Region, config: CvRegionConfig): CvRegionConfig {
  const header = siteHeader(source, config.language, region);
  const out: CvRegionConfig = { ...config, overrides: { ...config.overrides }, ownCopy: true };
  if (!config.ownCopy) {
    for (const key of siteHeaderKeys) {
      const v = config[key].trim();
      out[key] = v === "-" ? "" : v || header[key];
    }
    for (const key of ["phone", "nationality", "dateOfBirth", "motherTongue"] as const) {
      out[key] = config[key].trim() === "-" ? "" : config[key];
    }
  }
  for (const item of flatItems(buildCatalog(source, config.language))) {
    if (item.fields.length) out.overrides[item.id] = { ...siteFields(item), ...config.overrides[item.id] };
  }
  return out;
}

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
  portfolio: string;
  portfolioText: string;
  download: string;
  page: string;
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
    portfolio: "Portfolio",
    portfolioText: "For more detailed information, have a look at my portfolio - all my experience and projects are there.",
    download: "Latest version",
    page: "Page",
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
    portfolio: "Portfólio",
    portfolioText: "Podrobnejšie informácie nájdete v mojom portfóliu - sú tam všetky moje skúsenosti a projekty.",
    download: "Aktuálna verzia",
    page: "Strana",
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
  portfolio: { href: string; label: string };
  download: { href: string; label: string };
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

function siteFallback(value: string, fallback: string) {
  const v = value.trim();
  if (v === "-") return "";
  return v || fallback;
}

export function resolveFields(item: CatalogItem, overrides: CvOverrides): Record<string, string> {
  const edits = overrides[item.id] ?? {};
  return Object.fromEntries(item.fields.map((f) => [f.key, edits[f.key] ?? f.value]));
}

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

  const header = (value: string, fallback: string) => (config.ownCopy ? (value.trim() === "-" ? "" : value.trim()) : siteFallback(value, fallback));

  const contact: CvContact[] = [];
  const email = header(config.email, t.profile.email ?? "");
  if (email && on.has("social:email")) contact.push({ icon: "email", value: email, href: `mailto:${email}` });
  const phone = header(config.phone, "");
  if (phone) contact.push({ icon: "phone", value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` });
  const site = portfolioOf(t.profile);
  const website = publicSite(header(config.website, site.url), site.url);
  if (website) {
    const href = /^https?:/.test(website) ? website : `https://${website}`;
    contact.push({ icon: "website", value: href.replace(/\/$/, "") === site.url ? site.label : pretty(website), href });
  }
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
    portfolio: { href: `${site.url}/${config.language}`, label: site.label },
    download: { href: `${site.url}${t.profile.cvPdf ?? ""}`, label: `${site.label}${t.profile.cvPdf ?? ""}` },
  };
}
