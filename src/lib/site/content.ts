import type {
  Certificate,
  Education,
  Experience,
  Language,
  Profile,
  Project,
  Publication,
  ResearchDirection,
  SkillGroup,
  Volunteering,
} from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Region } from "@/i18n/region";
import type { RegionProfile, SiteData, SiteEducation, SitePost, SiteProfile, SiteResearch } from "./data";
import { resolve } from "./localized";

export interface SiteContent {
  profile: Profile;
  bioBase: string[];
  regionProfiles: Record<Region, RegionProfile>;
  experience: Experience[];
  volunteering: Volunteering[];
  education: Education[];
  educationIntl: Education[];
  certificates: Certificate[];
  languages: Language[];
  skills: SkillGroup[];
  researchStatement: string;
  researchDirections: ResearchDirection[];
  projects: Project[];
  publications: Publication[];
  posts: (SitePost & { locale: Locale })[];
  getProject: (slug: string) => Project | null;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function cvFileName(name: string) {
  return `${slugify(name) || "resume"}-cv.pdf`;
}

export function cvDownloadName(name: string) {
  return `${name.trim().replace(/\s+/g, "_") || "Resume"}_Resume.pdf`;
}

export function mediaUrl(key: string, version: number) {
  return `/media/v${version}/${key}`;
}

const startOf = (period: string) => {
  const m = period.match(/(\d{2})\/(\d{4})/) ?? period.match(/()(\d{4})/);
  return m ? Number(m[2]) * 100 + Number(m[1] || 0) : 0;
};

const byStartDesc = (a: Education, b: Education) => startOf(b.period) - startOf(a.period);

function hasOwnSk(value: unknown): boolean {
  return Boolean(value && typeof value === "object" && "sk" in value && (value as { sk?: unknown }).sk);
}

export function buildContent(data: SiteData, locale: Locale): SiteContent {
  const siteProfile = resolve<SiteProfile>(data.profile, locale);
  const regionProfiles = {
    sk: resolve<RegionProfile>(data.regions.sk, locale),
    intl: resolve<RegionProfile>(data.regions.intl, locale),
  };
  const home = regionProfiles.intl;
  const profile: Profile = {
    ...siteProfile,
    email: siteProfile.email || undefined,
    location: home.location,
    now: home.now,
    bio: [...siteProfile.bio, home.bioClosing].filter(Boolean),
    avatar: mediaUrl("avatar", data.mediaVersion),
    cvPdf: `/cv/${cvFileName(siteProfile.name)}`,
    siteUrl: (siteProfile.website || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  };

  const education = resolve<SiteEducation[]>(data.education, locale);
  const forRegion = (r: Region) =>
    education
      .filter((e) => e.regions?.includes(r))
      .map(({ regions, ...e }) => (void regions, e))
      .sort(byStartDesc);

  const research = resolve<SiteResearch>(data.research, locale);
  const projects = resolve<Project[]>(data.projects, locale);

  const posts = data.posts.map((raw) => ({
    ...resolve<SitePost>(raw, locale),
    locale: locale !== "en" && hasOwnSk((raw as { body?: unknown }).body) ? locale : ("en" as Locale),
  }));

  return {
    profile,
    bioBase: siteProfile.bio,
    regionProfiles,
    experience: resolve<Experience[]>(data.experience, locale),
    volunteering: resolve<Volunteering[]>(data.volunteering, locale),
    education: forRegion("sk"),
    educationIntl: forRegion("intl"),
    certificates: resolve<Certificate[]>(data.certificates, locale),
    languages: resolve<Language[]>(data.languages, locale),
    skills: resolve<SkillGroup[]>(data.skills, locale),
    researchStatement: research.statement,
    researchDirections: research.directions,
    projects,
    publications: data.publications,
    posts,
    getProject: (slug) => projects.find((p) => p.slug === slug) ?? null,
  };
}

export function profileFor(content: SiteContent, region: Region): Profile {
  const r = content.regionProfiles[region];
  return { ...content.profile, location: r.location, now: r.now, bio: [...content.bioBase, r.bioClosing].filter(Boolean) };
}
