export type SocialPlatform =
  | "github"
  | "linkedin"
  | "hackerrank"
  | "eolymp"
  | "telegram"
  | "youtube"
  | "scholar"
  | "orcid"
  | "x"
  | "email";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  authorName: string;
  headline: string;
  location: string;
  email?: string;
  intro: string;
  bio: string[];
  now: string;
  highlights: string[];
  avatar: string;
  cvPdf?: string;
  githubUsername: string;
  siteUrl: string;
  socials: SocialLink[];
}

export type ExperienceKind = "full-time" | "internship" | "freelance";

export interface Credential {
  label: string;
  href: string;
}

export interface RoleProject {
  name: string;
  detail: string;
  points?: string[];
  slug?: string;
}

export interface ExperienceRole {
  title: string;
  kind: ExperienceKind;
  period: string;
  summary: string;
  highlights?: string[];
  projects?: RoleProject[];
  stack?: string[];
  caseStudy?: string;
  credential?: Credential;
}

export interface Experience {
  organization: string;
  location: string;
  period: string;
  roles: ExperienceRole[];
}

export interface Volunteering {
  organization: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights?: string[];
  stack?: string[];
  credential?: Credential;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  link?: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

export interface ResearchDirection {
  title: string;
  description: string;
  methods: string[];
  projects: string[];
}

export type PublicationType = "journal" | "conference" | "workshop" | "preprint" | "thesis";
export type PublicationStatus = "published" | "accepted" | "under-review";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  venueShort?: string;
  year: number;
  type: PublicationType;
  status: PublicationStatus;
  abstract?: string;
  links?: { pdf?: string; arxiv?: string; doi?: string; code?: string; slides?: string };
  bibtex?: string;
  featured?: boolean;
  note?: string;
}

export type ProjectKind = "work" | "freelance" | "research" | "hobby";

export interface ArchNode {
  name: string;
  detail?: string;
}

export interface ArchLayer {
  name: string;
  nodes: ArchNode[];
}

export interface ProjectComponent {
  name: string;
  role: string;
  points: string[];
  tech?: string;
}

export interface DeepDive {
  title: string;
  body: string[];
  formula?: string;
  code?: { lang: string; title?: string; source: string };
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  kind: ProjectKind;
  organization?: string;
  year: number;
  featured?: boolean;
  links: { repo?: string; demo?: string; docs?: string };
  facts?: { label: string; value: string }[];
  overview: string[];
  problem?: string[];
  architecture?: { summary: string; layers: ArchLayer[] };
  components?: ProjectComponent[];
  flow?: { title: string; detail: string }[];
  deepDives?: DeepDive[];
  decisions?: { title: string; detail: string }[];
  stack: { group: string; items: string[] }[];
  next?: string[];
}

export interface NewsItem {
  date: string;
  text: string;
  href?: string;
}
