import type { Certificate, Education, Experience, Language, Volunteering } from "./types";

// Source: Taleh_Rzayev_Resume_2026_09.pdf. Most recent first.

export const experience: Experience[] = [
  {
    organization: "ITM - Information Technology Center",
    location: "Baku, Azerbaijan · Remote",
    period: "05/2026 - Present",
    roles: [
      {
        title: "Full-Stack Developer",
        kind: "full-time",
        period: "05/2026 - Present",
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
    ],
  },
  {
    organization: "Edumedia-Azerbaijan LLC",
    location: "Baku, Azerbaijan · On-site",
    period: "12/2022 - 08/2026",
    roles: [
      {
        title: "Frontend Developer (Middle)",
        kind: "full-time",
        period: "03/2025 - 08/2026",
        summary: "Frontend development for Azerbaijan's national education web platforms.",
        highlights: ["Video.edu.az - new version built with Next.js."],
        stack: ["React", "Next.js", "TypeScript", "Redux Toolkit", "Figma", "GitLab"],
      },
      {
        title: "Frontend Developer (Junior)",
        kind: "full-time",
        period: "03/2023 - 03/2025",
        summary: "Frontend development for Azerbaijan's national education web platforms.",
        highlights: ["Portal.edu.az and Pts.edu.az - new services and ongoing support."],
        stack: ["React", "Context API", "Redux Toolkit", "JavaScript", "CSS3", "GitLab"],
      },
      {
        title: "Frontend Developer (Intern)",
        kind: "internship",
        period: "12/2022 - 03/2023",
        summary: "Three-month internship on the national education web platforms.",
        highlights: ["Digital.edu.az, Karabakh.edu.az, Ict.edu.az, Ite.az, MarsAcademy.az; support for Edu.gov.az."],
        stack: ["HTML5", "CSS3", "JavaScript", "jQuery", "GitLab"],
      },
    ],
  },
  {
    organization: "Azerbaijan International Telecom - AzInTelecom",
    location: "Baku, Azerbaijan · On-site",
    period: "07/2022 - 12/2022",
    roles: [
      {
        title: "Frontend Developer (Intern)",
        kind: "internship",
        period: "07/2022 - 12/2022",
        summary: "Sima Reporting System - client and admin dashboards.",
        highlights: ["Completed the internship with a Certificate of Distinction."],
        stack: ["HTML5", "Sass", "BEM", "JavaScript", "React", "Redux Toolkit", "GitLab", "Gitflow"],
        credential: { label: "Certificate of Distinction", href: "https://lnkd.in/p/dAPxzcjp" },
      },
    ],
  },
];

/** Unpaid work and the training programmes around it. Most recent first. */
export const volunteering: Volunteering[] = [
  {
    organization: "Azerbaijan State Oil and Industry University - IT Department",
    role: "Full-Stack Developer (volunteer)",
    period: "2021 - 2022",
    location: "Baku, Azerbaijan · On-site",
    summary:
      "An internal system for the Computer Science faculty: managing the department's students and teachers, and the records around them.",
    highlights: [
      "Joined the team in my third year of the degree and supported the IT department for a year as a full-stack developer.",
      "One of five students chosen from the faculty for the team.",
      "My first working experience - the one that led to everything after it.",
    ],
    stack: ["JavaScript", "HTML5", "CSS3", "PHP", "MySQL"],
  },
  {
    organization: "Algorithmics Global for Azerbaijan",
    role: "Frontend programming - one-semester course",
    period: "2022",
    location: "Baku, Azerbaijan",
    summary: "A semester-long frontend programming programme, entered by examination.",
    highlights: [
      "Selected by entrance exam: the programme went to the first 25 students of the faculty, and I passed into that group.",
      "Taking part exempted me from three of the five subjects I would otherwise have taken that semester at the university.",
      "Finished the programme with 100/100.",
    ],
    stack: ["HTML5", "CSS3", "JavaScript"],
    credential: {
      label: "Certificate",
      href: "https://drive.google.com/file/d/1wU_RX5qmX0dzXBMgP72aRV-E6RxTdbL2/view",
    },
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
