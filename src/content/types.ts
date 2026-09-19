/**
 * Content model for the whole site.
 * Pages only render these typed data files - edit content in `src/content/`,
 * never in page or component code.
 */

export type SocialPlatform = "github" | "linkedin" | "telegram" | "youtube" | "scholar" | "orcid" | "x" | "email";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  /** Exactly as your name appears in author lists - highlighted in publications. */
  authorName: string;
  headline: string;
  location: string;
  email?: string;
  /** One or two sentences for the home page. */
  intro: string;
  /** Paragraphs for /about. */
  bio: string[];
  /** Short "currently" line under the name. */
  now: string;
  /** Headline facts shown under the intro on the home page. */
  highlights: string[];
  avatar: string;
  cvPdf?: string;
  githubUsername: string;
  siteUrl: string;
  socials: SocialLink[];
}

// ─── Experience & education ────────────────────────────────

export interface Experience {
  organization: string;
  role: string;
  kind: "full-time" | "internship" | "freelance";
  /** Free text, e.g. "03/2023 - 08/2026". */
  period: string;
  location: string;
  summary: string;
  highlights?: string[];
  stack?: string[];
  /** Slug of a related case study in src/content/projects. */
  caseStudy?: string;
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
  /** Slugs of projects that implement this direction. */
  projects: string[];
}

// ─── Publications ──────────────────────────────────────────

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
  /** Short extra note, e.g. "Oral presentation". */
  note?: string;
}

// ─── Projects (case studies) ───────────────────────────────

export type ProjectCategory = "ai" | "engineering";
export type ProjectStatus = "active" | "delivered" | "stable" | "archived";

export interface ArchNode {
  name: string;
  detail?: string;
}

/** One horizontal layer of the architecture diagram, top to bottom. */
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
  /** LaTeX, rendered with KaTeX. */
  formula?: string;
  code?: { lang: string; title?: string; source: string };
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: number;
  featured?: boolean;
  links: { repo?: string; demo?: string; docs?: string };
  /** Key numbers shown at the top of the case study. */
  facts?: { label: string; value: string }[];
  overview: string[];
  problem?: string[];
  architecture: { summary: string; layers: ArchLayer[] };
  components: ProjectComponent[];
  flow: { title: string; detail: string }[];
  deepDives?: DeepDive[];
  decisions: { title: string; detail: string }[];
  stack: { group: string; items: string[] }[];
  next?: string[];
}

/** Smaller, earlier projects shown as a compact list. */
export interface ArchiveProject {
  title: string;
  description: string;
  year: number;
  stack: string[];
  repo: string;
  demo?: string;
}

export interface NewsItem {
  date: string;
  text: string;
  href?: string;
}
