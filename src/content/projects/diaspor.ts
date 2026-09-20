import type { Project } from "../types";

// Built at ITM - Information Technology Center (see resume). No public repository.

export const diaspor: Project = {
  slug: "diaspor",
  title: "Diaspor.org",
  tagline: "A multi-tenant publishing platform: a branded news site for every diaspora organisation, and one national feed.",
  kind: "work",
  organization: "ITM",
  year: 2026,
  featured: true,
  links: {},
  facts: [
    { label: "Role", value: "Full-stack" },
    { label: "Period", value: "05/2026 - Present" },
    { label: "Core", value: "Spring Boot · Next.js" },
  ],
  overview: [
    "Diaspor.org gives each diaspora organisation its own branded news site on a subdomain, while a main portal aggregates their approved news into a single national feed.",
    "I designed and built the whole system end to end: API, admin panel, public sites, database and media storage.",
  ],
  problem: [
    "Many small organisations need a professional news site, but running a separate site for each is expensive and fragments their content. The platform has to give every organisation its own identity while sharing one codebase, one database and one editorial pipeline.",
  ],
  architecture: {
    summary:
      "One Spring Boot API serves two frontends: a React admin panel where organisations manage content, and a server-rendered Next.js site that renders every organisation's subdomain and the national portal.",
    layers: [
      {
        name: "Audiences",
        nodes: [
          { name: "Organisation sites", detail: "Branded subdomain per org" },
          { name: "National portal", detail: "Aggregated feed" },
          { name: "Editors & admins", detail: "Content management" },
        ],
      },
      {
        name: "Frontend",
        nodes: [
          { name: "Next.js public site", detail: "SSR · SEO" },
          { name: "React admin panel", detail: "TypeScript" },
        ],
      },
      {
        name: "API",
        nodes: [
          { name: "Spring Boot REST API", detail: "Java" },
          { name: "Role-based access", detail: "Per-role permissions" },
          { name: "Approval", detail: "Gate into the national feed" },
        ],
      },
      {
        name: "Data & infra",
        nodes: [
          { name: "PostgreSQL", detail: "Versioned migrations" },
          { name: "AWS S3", detail: "Media storage" },
          { name: "Docker", detail: "Containerised backend" },
        ],
      },
    ],
  },
  components: [
    {
      name: "Public site",
      role: "Every organisation, one app",
      points: [
        "A single Next.js application renders each organisation's branded subdomain site.",
        "Server-side rendering makes news pages fast and indexable by search engines.",
      ],
      tech: "Next.js · SSR",
    },
    {
      name: "Admin panel",
      role: "Where content is managed",
      points: ["A React + TypeScript panel for creating and managing news, with access controlled by role."],
      tech: "React · TypeScript",
    },
    {
      name: "REST API",
      role: "Single source of truth",
      points: [
        "Spring Boot API shared by both frontends.",
        "Role-based access control and an approval step for publishing to the national feed.",
      ],
      tech: "Java · Spring Boot",
    },
    {
      name: "Storage",
      role: "Data and media",
      points: ["PostgreSQL schema evolves through versioned migrations.", "Images and media are stored in S3, not in the database."],
      tech: "PostgreSQL · AWS S3",
    },
  ],
  flow: [
    { title: "Write", detail: "An organisation's editor creates a news post in the admin panel." },
    { title: "Store", detail: "The API saves the post in PostgreSQL and uploads media to S3." },
    { title: "Publish", detail: "The post appears on the organisation's own subdomain site." },
    { title: "Approve", detail: "Approved posts are aggregated into the national feed on the main portal." },
  ],
  decisions: [
    {
      title: "Multi-tenant, not multi-deploy",
      detail: "One codebase and one database serve every organisation - new organisations are data, not new deployments.",
    },
    {
      title: "SSR for public pages",
      detail: "News is read by search engines and shared on social media, so pages are rendered on the server.",
    },
    {
      title: "Versioned migrations",
      detail: "Every schema change is a reviewed, repeatable migration, so environments never drift apart.",
    },
    {
      title: "Media outside the database",
      detail: "S3 keeps the database small and the backend containers stateless and easy to redeploy.",
    },
  ],
  stack: [
    { group: "Backend", items: ["Java", "Spring Boot", "REST"] },
    { group: "Frontend", items: ["Next.js", "React", "TypeScript"] },
    { group: "Data & infra", items: ["PostgreSQL", "AWS S3", "Docker"] },
  ],
};
