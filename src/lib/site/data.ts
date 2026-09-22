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
import type { Region } from "@/i18n/region";
import type { Localized, MaybeLocalized } from "./localized";
import type { TextKey } from "./texts";

export type Loc<T> = T extends string
  ? MaybeLocalized<string>
  : T extends (infer U)[]
    ? U extends string
      ? MaybeLocalized<string[]>
      : Loc<U>[]
    : T extends object
      ? { [K in keyof T]: Loc<T[K]> }
      : T;

export type PostCategory = "engineering" | "research";

export interface SitePost {
  slug: string;
  date: string;
  category: PostCategory;
  tags: string[];
  draft: boolean;
  title: string;
  summary: string;
  body: string;
}

export interface RegionProfile {
  location: string;
  now: string;
  bioClosing: string;
}

export interface SiteProfile extends Omit<Profile, "location" | "now" | "avatar" | "cvPdf" | "siteUrl"> {
  website: string;
  websiteLabel: string;
  sourceRepo?: string;
  gaMeasurementId?: string;
  motherTongue: string;
}

export interface SiteEducation extends Education {
  regions: Region[];
}

export interface SiteResearch {
  statement: string;
  directions: ResearchDirection[];
}

export interface SiteData {
  version: 1;
  updatedAt: string | null;
  mediaVersion: number;
  profile: Loc<SiteProfile>;
  regions: Record<Region, Loc<RegionProfile>>;
  experience: Loc<Experience>[];
  volunteering: Loc<Volunteering>[];
  education: Loc<SiteEducation>[];
  certificates: Loc<Certificate>[];
  languages: Loc<Language>[];
  skills: Loc<SkillGroup>[];
  research: Loc<SiteResearch>;
  projects: Loc<Project>[];
  publications: Publication[];
  posts: Loc<SitePost>[];
  texts: Partial<Record<TextKey, Localized<string>>>;
}

const emptyRegion: RegionProfile = { location: "", now: "", bioClosing: "" };

export function emptySiteData(): SiteData {
  return {
    version: 1,
    updatedAt: null,
    mediaVersion: 0,
    profile: {
      name: "",
      authorName: "",
      headline: "",
      email: "",
      intro: "",
      bio: [],
      highlights: [],
      githubUsername: "",
      socials: [],
      website: "",
      websiteLabel: "",
      motherTongue: "",
    },
    regions: { sk: { ...emptyRegion }, intl: { ...emptyRegion } },
    experience: [],
    volunteering: [],
    education: [],
    certificates: [],
    languages: [],
    skills: [],
    research: { statement: "", directions: [] },
    projects: [],
    publications: [],
    posts: [],
    texts: {},
  };
}
