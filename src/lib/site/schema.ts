import type { Region } from "@/i18n/region";

interface Base {
  key: string;
  label: string;
  hint?: string;
  optional?: boolean;
  half?: boolean;
}

export type Field =
  | (Base & { kind: "text"; localized?: boolean; placeholder?: string })
  | (Base & { kind: "textarea"; localized?: boolean; rows?: number })
  | (Base & { kind: "markdown"; localized?: boolean })
  | (Base & { kind: "code" })
  | (Base & { kind: "number" })
  | (Base & { kind: "checkbox" })
  | (Base & { kind: "select"; options: readonly string[] })
  | (Base & { kind: "lines"; localized?: boolean })
  | (Base & { kind: "tags" })
  | (Base & { kind: "regions" })
  | (Base & { kind: "object"; fields: Field[] })
  | (Base & { kind: "list"; fields: Field[]; itemLabel: string[]; singular: string });

export type SectionKey =
  | "profile"
  | "regions"
  | "experience"
  | "volunteering"
  | "education"
  | "certificates"
  | "languages"
  | "skills"
  | "research"
  | "projects"
  | "publications"
  | "posts";

export interface Section {
  key: SectionKey;
  title: string;
  description: string;
  fields: Field[];
  list?: { itemLabel: string[]; singular: string };
}

export const regionKeys: Region[] = ["sk", "intl"];

export const socialPlatforms = ["github", "linkedin", "hackerrank", "eolymp", "telegram", "youtube", "scholar", "orcid", "x", "email"] as const;

const credential: Field = {
  kind: "object",
  key: "credential",
  label: "Credential",
  optional: true,
  fields: [
    { kind: "text", key: "label", label: "Label", localized: true, half: true },
    { kind: "text", key: "href", label: "URL", half: true },
  ],
};

const regionProfile: Field[] = [
  { kind: "text", key: "location", label: "Location (footer and CV header)", localized: true },
  { kind: "text", key: "now", label: "Status under the name", localized: true },
  { kind: "textarea", key: "bioClosing", label: "Closing paragraph of the About page", localized: true, rows: 3 },
];

export const sections: Section[] = [
  {
    key: "profile",
    title: "Profile",
    description: "Name, headline, introduction, biography and links.",
    fields: [
      { kind: "text", key: "name", label: "Name", half: true },
      { kind: "text", key: "authorName", label: "Author name (short)", half: true },
      { kind: "text", key: "headline", label: "Headline", localized: true },
      { kind: "text", key: "email", label: "E-mail", half: true, optional: true },
      { kind: "text", key: "githubUsername", label: "GitHub username", half: true },
      { kind: "text", key: "website", label: "Public website (used in the CV)", half: true, placeholder: "https://example.com" },
      { kind: "text", key: "websiteLabel", label: "Website label", half: true, placeholder: "Example.com" },
      { kind: "text", key: "sourceRepo", label: "Source code of this site (GitHub)", optional: true, placeholder: "https://github.com/user/repo" },
      { kind: "text", key: "motherTongue", label: "Mother tongue", localized: true },
      { kind: "textarea", key: "intro", label: "Introduction", localized: true, rows: 4 },
      { kind: "lines", key: "bio", label: "Biography", hint: "One paragraph per line. The last paragraph comes from Locations.", localized: true },
      { kind: "lines", key: "highlights", label: "Highlights", hint: "One per line. The first one is the years of experience.", localized: true },
      {
        kind: "list",
        key: "socials",
        label: "Links",
        singular: "link",
        itemLabel: ["label", "href"],
        fields: [
          { kind: "select", key: "platform", label: "Platform", options: socialPlatforms, half: true },
          { kind: "text", key: "label", label: "Label", localized: true, half: true },
          { kind: "text", key: "href", label: "URL" },
        ],
      },
    ],
  },
  {
    key: "regions",
    title: "Locations",
    description: "What visitors from Slovakia and from other countries see.",
    fields: [
      { kind: "object", key: "sk", label: "Visitors from Slovakia", fields: regionProfile },
      { kind: "object", key: "intl", label: "Visitors from other countries", fields: regionProfile },
    ],
  },
  {
    key: "experience",
    title: "Experience",
    description: "Companies, newest first. Several roles at one company form a promotion track.",
    list: { itemLabel: ["organization", "period"], singular: "company" },
    fields: [
      { kind: "text", key: "organization", label: "Organisation", localized: true },
      { kind: "text", key: "location", label: "Location", localized: true, half: true },
      { kind: "text", key: "period", label: "Whole period", localized: true, half: true },
      {
        kind: "list",
        key: "roles",
        label: "Roles (newest first)",
        singular: "role",
        itemLabel: ["title", "period"],
        fields: [
          { kind: "text", key: "title", label: "Title", localized: true, half: true },
          { kind: "select", key: "kind", label: "Kind", options: ["full-time", "internship", "freelance"], half: true },
          { kind: "text", key: "period", label: "Period", localized: true, half: true },
          { kind: "text", key: "caseStudy", label: "Case study slug", optional: true, half: true },
          { kind: "textarea", key: "summary", label: "Summary", localized: true, rows: 2 },
          { kind: "lines", key: "highlights", label: "Highlights", localized: true, optional: true },
          {
            kind: "list",
            key: "projects",
            label: "Projects",
            singular: "project",
            optional: true,
            itemLabel: ["name"],
            fields: [
              { kind: "text", key: "name", label: "Name", localized: true, half: true },
              { kind: "text", key: "slug", label: "Project page slug", optional: true, half: true },
              { kind: "textarea", key: "detail", label: "Detail", localized: true, rows: 2 },
              { kind: "lines", key: "points", label: "Points", localized: true, optional: true },
            ],
          },
          { kind: "tags", key: "stack", label: "Technologies", optional: true },
          credential,
        ],
      },
    ],
  },
  {
    key: "volunteering",
    title: "Volunteering",
    description: "Unpaid work and training programmes.",
    list: { itemLabel: ["role", "organization"], singular: "entry" },
    fields: [
      { kind: "text", key: "role", label: "Role", localized: true, half: true },
      { kind: "text", key: "organization", label: "Organisation", localized: true, half: true },
      { kind: "text", key: "period", label: "Period", localized: true, half: true },
      { kind: "text", key: "location", label: "Location", localized: true, half: true },
      { kind: "textarea", key: "summary", label: "Summary", localized: true, rows: 2 },
      { kind: "lines", key: "highlights", label: "Highlights", localized: true, optional: true },
      { kind: "tags", key: "stack", label: "Technologies", optional: true },
      credential,
    ],
  },
  {
    key: "education",
    title: "Education",
    description: "Degrees. Choose for which visitors each one is shown.",
    list: { itemLabel: ["degree", "field", "institution"], singular: "degree" },
    fields: [
      { kind: "text", key: "degree", label: "Degree", localized: true, half: true },
      { kind: "text", key: "field", label: "Field", localized: true, half: true },
      { kind: "text", key: "institution", label: "Institution", localized: true },
      { kind: "text", key: "location", label: "Location", localized: true, half: true },
      { kind: "text", key: "period", label: "Period", localized: true, half: true },
      { kind: "regions", key: "regions", label: "Shown to" },
    ],
  },
  {
    key: "certificates",
    title: "Certificates",
    description: "Certificates and credentials.",
    list: { itemLabel: ["title", "issuer"], singular: "certificate" },
    fields: [
      { kind: "text", key: "title", label: "Title", localized: true },
      { kind: "text", key: "issuer", label: "Issuer", localized: true, half: true },
      { kind: "text", key: "link", label: "Credential URL", optional: true, half: true },
    ],
  },
  {
    key: "languages",
    title: "Languages",
    description: "Spoken languages and levels.",
    list: { itemLabel: ["name", "level"], singular: "language" },
    fields: [
      { kind: "text", key: "name", label: "Language", localized: true, half: true },
      { kind: "text", key: "level", label: "Level", localized: true, half: true },
    ],
  },
  {
    key: "skills",
    title: "Skills",
    description: "Skill groups shown on the home page and in the CV.",
    list: { itemLabel: ["title"], singular: "group" },
    fields: [
      { kind: "text", key: "title", label: "Group", localized: true },
      { kind: "lines", key: "skills", label: "Skills", hint: "One per line.", localized: true },
    ],
  },
  {
    key: "research",
    title: "Research",
    description: "Research statement and directions.",
    fields: [
      { kind: "textarea", key: "statement", label: "Statement", localized: true, rows: 4 },
      {
        kind: "list",
        key: "directions",
        label: "Directions",
        singular: "direction",
        itemLabel: ["title"],
        fields: [
          { kind: "text", key: "title", label: "Title", localized: true },
          { kind: "textarea", key: "description", label: "Description", localized: true, rows: 3 },
          { kind: "lines", key: "methods", label: "Methods", localized: true },
          { kind: "tags", key: "projects", label: "Project slugs" },
        ],
      },
    ],
  },
  {
    key: "projects",
    title: "Projects",
    description: "Case studies, in the order they appear on the site.",
    list: { itemLabel: ["title", "kind", "year"], singular: "project" },
    fields: [
      { kind: "text", key: "title", label: "Title", localized: true, half: true },
      { kind: "text", key: "slug", label: "Slug (URL)", half: true },
      { kind: "textarea", key: "tagline", label: "Tagline", localized: true, rows: 2 },
      { kind: "select", key: "kind", label: "Kind", options: ["work", "freelance", "research", "hobby"], half: true },
      { kind: "number", key: "year", label: "Year", half: true },
      { kind: "text", key: "organization", label: "Organisation", localized: true, optional: true, half: true },
      { kind: "checkbox", key: "featured", label: "Featured", optional: true, half: true },
      {
        kind: "object",
        key: "links",
        label: "Links",
        fields: [
          { kind: "text", key: "repo", label: "Repository", optional: true, half: true },
          { kind: "text", key: "demo", label: "Live demo", optional: true, half: true },
          { kind: "text", key: "docs", label: "Documentation", optional: true, half: true },
        ],
      },
      {
        kind: "list",
        key: "facts",
        label: "Key facts",
        singular: "fact",
        optional: true,
        itemLabel: ["label", "value"],
        fields: [
          { kind: "text", key: "label", label: "Label", localized: true, half: true },
          { kind: "text", key: "value", label: "Value", localized: true, half: true },
        ],
      },
      { kind: "lines", key: "overview", label: "Overview", hint: "One paragraph per line.", localized: true },
      { kind: "lines", key: "problem", label: "The problem", hint: "One paragraph per line.", localized: true, optional: true },
      {
        kind: "object",
        key: "architecture",
        label: "Architecture",
        optional: true,
        fields: [
          { kind: "textarea", key: "summary", label: "Summary", localized: true, rows: 3 },
          {
            kind: "list",
            key: "layers",
            label: "Layers",
            singular: "layer",
            itemLabel: ["name"],
            fields: [
              { kind: "text", key: "name", label: "Layer", localized: true },
              {
                kind: "list",
                key: "nodes",
                label: "Nodes",
                singular: "node",
                itemLabel: ["name"],
                fields: [
                  { kind: "text", key: "name", label: "Name", localized: true, half: true },
                  { kind: "text", key: "detail", label: "Detail", localized: true, optional: true, half: true },
                ],
              },
            ],
          },
        ],
      },
      {
        kind: "list",
        key: "components",
        label: "Components",
        singular: "component",
        optional: true,
        itemLabel: ["name"],
        fields: [
          { kind: "text", key: "name", label: "Name", localized: true, half: true },
          { kind: "text", key: "tech", label: "Technology", optional: true, half: true },
          { kind: "textarea", key: "role", label: "Role", localized: true, rows: 2 },
          { kind: "lines", key: "points", label: "Points", localized: true },
        ],
      },
      {
        kind: "list",
        key: "flow",
        label: "How it works",
        singular: "step",
        optional: true,
        itemLabel: ["title"],
        fields: [
          { kind: "text", key: "title", label: "Step", localized: true },
          { kind: "textarea", key: "detail", label: "Detail", localized: true, rows: 2 },
        ],
      },
      {
        kind: "list",
        key: "deepDives",
        label: "Technical deep dives",
        singular: "deep dive",
        optional: true,
        itemLabel: ["title"],
        fields: [
          { kind: "text", key: "title", label: "Title", localized: true },
          { kind: "lines", key: "body", label: "Body", hint: "One paragraph per line.", localized: true },
          { kind: "text", key: "formula", label: "Formula (LaTeX)", optional: true },
          {
            kind: "object",
            key: "code",
            label: "Code",
            optional: true,
            fields: [
              { kind: "text", key: "lang", label: "Language", half: true },
              { kind: "text", key: "title", label: "File name", optional: true, half: true },
              { kind: "code", key: "source", label: "Source" },
            ],
          },
        ],
      },
      {
        kind: "list",
        key: "decisions",
        label: "Design decisions",
        singular: "decision",
        optional: true,
        itemLabel: ["title"],
        fields: [
          { kind: "text", key: "title", label: "Decision", localized: true },
          { kind: "textarea", key: "detail", label: "Detail", localized: true, rows: 3 },
        ],
      },
      {
        kind: "list",
        key: "stack",
        label: "Tech stack",
        singular: "group",
        itemLabel: ["group"],
        fields: [
          { kind: "text", key: "group", label: "Group", localized: true },
          { kind: "lines", key: "items", label: "Items", hint: "One per line.", localized: true },
        ],
      },
      { kind: "lines", key: "next", label: "What's next", localized: true, optional: true },
    ],
  },
  {
    key: "publications",
    title: "Publications",
    description: "Papers and theses.",
    list: { itemLabel: ["title", "year"], singular: "publication" },
    fields: [
      { kind: "text", key: "id", label: "Id", half: true },
      { kind: "number", key: "year", label: "Year", half: true },
      { kind: "text", key: "title", label: "Title" },
      { kind: "tags", key: "authors", label: "Authors" },
      { kind: "text", key: "venue", label: "Venue", half: true },
      { kind: "text", key: "venueShort", label: "Venue (short)", optional: true, half: true },
      { kind: "select", key: "type", label: "Type", options: ["journal", "conference", "workshop", "preprint", "thesis"], half: true },
      { kind: "select", key: "status", label: "Status", options: ["published", "accepted", "under-review"], half: true },
      { kind: "textarea", key: "abstract", label: "Abstract", optional: true, rows: 4 },
      {
        kind: "object",
        key: "links",
        label: "Links",
        optional: true,
        fields: [
          { kind: "text", key: "pdf", label: "PDF", optional: true, half: true },
          { kind: "text", key: "arxiv", label: "arXiv", optional: true, half: true },
          { kind: "text", key: "doi", label: "DOI", optional: true, half: true },
          { kind: "text", key: "code", label: "Code", optional: true, half: true },
          { kind: "text", key: "slides", label: "Slides", optional: true, half: true },
        ],
      },
      { kind: "code", key: "bibtex", label: "BibTeX", optional: true },
      { kind: "checkbox", key: "featured", label: "Featured", optional: true },
      { kind: "text", key: "note", label: "Note", optional: true },
    ],
  },
  {
    key: "posts",
    title: "Articles",
    description: "Articles in Markdown/MDX, with code blocks and formulas.",
    list: { itemLabel: ["title", "date"], singular: "article" },
    fields: [
      { kind: "text", key: "title", label: "Title", localized: true },
      { kind: "text", key: "slug", label: "Slug (URL)", half: true },
      { kind: "text", key: "date", label: "Date", half: true, placeholder: "2026-09-22" },
      { kind: "select", key: "category", label: "Category", options: ["engineering", "research"], half: true },
      { kind: "checkbox", key: "draft", label: "Draft (hidden on the live site)", half: true },
      { kind: "tags", key: "tags", label: "Tags" },
      { kind: "textarea", key: "summary", label: "Summary", localized: true, rows: 2 },
      { kind: "markdown", key: "body", label: "Text (MDX)", localized: true },
    ],
  },
];

export function getSection(key: string) {
  return sections.find((s) => s.key === key) ?? null;
}

export function emptyValue(field: Field): unknown {
  switch (field.kind) {
    case "number":
      return new Date().getFullYear();
    case "checkbox":
      return false;
    case "select":
      return field.options[0];
    case "lines":
    case "tags":
    case "list":
      return [];
    case "regions":
      return [...regionKeys];
    case "object":
      return emptyItem(field.fields);
    default:
      return "";
  }
}

export function emptyItem(fields: Field[]): Record<string, unknown> {
  return Object.fromEntries(fields.filter((f) => !f.optional || f.kind === "list").map((f) => [f.key, emptyValue(f)]));
}
