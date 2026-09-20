import type { Certificate, Education, Experience, Language } from "./types";

// Source: Taleh_Rzayev_Resume_2026_09.pdf. Most recent first.

export const experience: Experience[] = [
  {
    organization: "ITM - Information Technology Center",
    role: "Full-Stack Developer",
    kind: "full-time",
    period: "05/2026 - Present",
    location: "Baku, Azerbaijan · Remote",
    summary:
      "Full-stack development on the centre's web platforms - a multi-tenant publishing platform, an academic journal system and a public health institute portal.",
    highlights: [
      "Diaspor.org - multi-tenant publishing platform designed end to end: Spring Boot REST API, React admin panel, Next.js SSR public site, PostgreSQL with versioned migrations, S3 for media and role-based access.",
      "UNEC Student Research Journal - academic journal platform on OJS with a Laravel front: submission, peer review and production workflow for around twenty faculties, DOI registration and Google Scholar indexing.",
      "Institute of Lung Diseases (etacxi.az) - rebuilding the public portal from scratch in Laravel, moving hard-coded pages into an editable, bilingual content model with an admin panel.",
    ],
    stack: ["Java", "Spring Boot", "PHP", "Laravel", "PostgreSQL", "MySQL", "React", "Next.js", "OJS", "AWS S3", "Docker"],
    caseStudy: "diaspor",
  },
  {
    organization: "Edumedia-Azerbaijan LLC",
    role: "Frontend Developer (Middle)",
    kind: "full-time",
    period: "03/2025 - 08/2026",
    location: "Baku, Azerbaijan · On-site",
    summary: "Frontend development for Azerbaijan's national education web platforms.",
    highlights: ["Video.edu.az - new version built with Next.js."],
    stack: ["React", "Next.js", "TypeScript", "Redux Toolkit", "Figma", "GitLab"],
  },
  {
    organization: "Edumedia-Azerbaijan LLC",
    role: "Frontend Developer (Junior)",
    kind: "full-time",
    period: "03/2023 - 03/2025",
    location: "Baku, Azerbaijan · On-site",
    summary: "Frontend development for Azerbaijan's national education web platforms.",
    highlights: ["Portal.edu.az and Pts.edu.az - new services and ongoing support."],
    stack: ["React", "Context API", "Redux Toolkit", "JavaScript", "CSS3", "GitLab"],
  },
  {
    organization: "Edumedia-Azerbaijan LLC",
    role: "Frontend Developer (Intern)",
    kind: "internship",
    period: "12/2022 - 03/2023",
    location: "Baku, Azerbaijan · On-site",
    summary: "Three-month internship on the national education web platforms.",
    highlights: ["Digital.edu.az, Karabakh.edu.az, Ict.edu.az, Ite.az, MarsAcademy.az; support for Edu.gov.az."],
    stack: ["HTML5", "CSS3", "JavaScript", "jQuery", "GitLab"],
  },
  {
    organization: "Azerbaijan International Telecom - AzInTelecom",
    role: "Frontend Developer (Intern)",
    kind: "internship",
    period: "07/2022 - 12/2022",
    location: "Baku, Azerbaijan · On-site",
    summary: "Sima Reporting System - client and admin dashboards.",
    highlights: ["Completed the internship with a Certificate of Distinction."],
    stack: ["HTML5", "Sass", "BEM", "JavaScript", "React", "Redux Toolkit", "GitLab", "Gitflow"],
  },
];

/**
 * Two versions, picked by visitor region (see src/content/locations.ts):
 * `education` for visitors from Slovakia, `educationIntl` for everyone else.
 * Source: Taleh_Rzayev_Resume_2026_09.pdf and Taleh_Rzayev_FlowCV_Resume_2026-03-10.pdf.
 */
export const education: Education[] = [
  {
    degree: "Bachelor",
    field: "Industrial Management",
    institution: "Technical University of Košice",
    location: "Košice, Slovakia",
    period: "09/2026 - Present",
  },
  {
    degree: "Bachelor",
    field: "Information Technologies",
    institution: "Azerbaijan Oil and Industry University",
    location: "Baku, Azerbaijan",
    period: "09/2019 - 07/2023",
  },
];

export const educationIntl: Education[] = [
  {
    degree: "Master",
    field: "System Programming",
    institution: "Azerbaijan Technical University",
    location: "Baku, Azerbaijan",
    period: "09/2023 - 07/2025",
  },
  {
    degree: "Bachelor",
    field: "Information Technologies",
    institution: "Azerbaijan Oil and Industry University",
    location: "Baku, Azerbaijan",
    period: "09/2019 - 07/2023",
  },
];

export const certificates: Certificate[] = [
  {
    title: "Agentic Automation Developer",
    issuer: "UiPath Academy",
    link: "https://credentials.uipath.com/05f6e12c-fa14-43ac-9d85-32345daaccc2",
  },
  {
    title: "Frontend Developer - Certificate of Distinction (Internship)",
    issuer: "AzInTelecom",
    link: "https://lnkd.in/p/dAPxzcjp",
  },
  {
    title: "Frontend Developer (#CodeForFuture)",
    issuer: "Algorithmics Global",
    link: "https://drive.google.com/file/d/1wU_RX5qmX0dzXBMgP72aRV-E6RxTdbL2/view",
  },
  {
    title: "Problem Solving (Basic), React (Basic), JavaScript (Basic & Intermediate)",
    issuer: "HackerRank",
    link: "https://www.hackerrank.com/profile/rzayevtaleh01",
  },
];

export const languages: Language[] = [
  { name: "English", level: "Upper Intermediate (B2)" },
  { name: "Slovak", level: "A2" },
];
