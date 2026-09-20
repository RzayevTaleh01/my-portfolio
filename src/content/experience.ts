import type { Certificate, Education, Experience, Language } from "./types";

// Source: Taleh_Rzayev_Resume_2026_09.pdf. Most recent first.

export const experience: Experience[] = [
  {
    organization: "Edumedia-Azerbaijan LLC",
    role: "Frontend Developer (Strong Junior)",
    kind: "full-time",
    period: "03/2023 - 08/2026",
    location: "Baku, Azerbaijan · On-site",
    summary: "Frontend development for Azerbaijan's national education web platforms.",
    highlights: [
      "Video.edu.az - new version built with Next.js.",
      "Portal.edu.az and Pts.edu.az - new services and ongoing support.",
      "Digital.edu.az, Karabakh.edu.az, Ict.edu.az, Ite.az, MarsAcademy.az; support for Edu.gov.az.",
    ],
    stack: ["HTML5", "CSS3", "JavaScript", "jQuery", "React", "Context API", "Redux Toolkit", "Next.js", "Figma", "GitLab"],
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
  { title: "Frontend Developer - Certificate of Distinction (Internship)", issuer: "AzInTelecom" },
  { title: "Frontend Developer (#CodeForFuture)", issuer: "Algorithmics Global" },
  { title: "Problem Solving (Basic), React (Basic), JavaScript (Basic & Intermediate)", issuer: "HackerRank" },
];

export const languages: Language[] = [
  { name: "English", level: "Upper Intermediate (B2)" },
  { name: "Slovak", level: "A2" },
];
