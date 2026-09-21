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
        summary: "Full-stack work on the centre's web platforms.",
        projects: [
          { name: "Diaspor.org", detail: "Multi-tenant publishing platform, built end to end.", slug: "diaspor" },
          {
            name: "UNEC Student Research Journal",
            detail: "OJS platform with a Laravel front, DOI and Google Scholar indexing.",
            slug: "unec-ttj",
          },
          { name: "Institute of Lung Diseases", detail: "Rebuilding the public portal in Laravel.", slug: "etacxi" },
        ],
        stack: ["Java", "Spring Boot", "PHP", "Laravel", "PostgreSQL", "MySQL", "React", "Next.js", "OJS", "AWS S3", "Docker"],
      },
    ],
  },
  {
    organization: "Edumedia-Azerbaijan LLC",
    location: "Baku, Azerbaijan · On-site",
    period: "03/2023 - 08/2026",
    roles: [
      {
        title: "Frontend Developer (Middle)",
        kind: "full-time",
        period: "03/2025 - 08/2026",
        summary: "National platforms for the Ministry of Science and Education and the Ministry of Foreign Affairs.",
        projects: [
          {
            name: "Digital School (Digital.edu.az)",
            detail:
              "The ministry's national school platform: one portal for teachers, directors, students and parents. Our biggest and heaviest system.",
            points: [
              "Built 10+ of its services from scratch.",
              "AI learning assistant - a frontend developer by role, I was brought into the team that built the students' chatbot on a local generative model trained on the ministry's materials. Launched in June 2026.",
            ],
            slug: "digital-school",
          },
          { name: "Video.edu.az", detail: "Moved off the old system and rebuilt from scratch in Next.js.", slug: "video-edu" },
          { name: "Mfa.gov.az", detail: "The Ministry of Foreign Affairs' official website - support." },
          { name: "aida.mfa.gov.az", detail: "The ministry's internal apostille and legalisation system, built from scratch." },
        ],
        stack: ["React", "Next.js", "TypeScript", "Redux Toolkit", "Figma", "GitLab"],
      },
      {
        title: "Frontend Developer (Junior)",
        kind: "full-time",
        period: "03/2023 - 03/2025",
        summary: "National education platforms for the Ministry of Science and Education.",
        projects: [
          {
            name: "Pts.edu.az",
            detail: "Internal system for vocational schools.",
            points: ["10+ services built or reworked - online diplomas, individual study plans, student transfers."],
            slug: "pts-edu",
          },
          {
            name: "Portal.edu.az",
            detail: "Study-abroad applications under the HTP and DP programmes.",
            slug: "portal-edu",
          },
          { name: "Ict.edu.az", detail: "Frontend written from scratch.", slug: "ict-edu" },
          { name: "Ite.az", detail: "Teacher training centre - built the frontend.", slug: "ite" },
          { name: "Karabakh.edu.az", detail: "Karabakh University's official site.", slug: "karabakh-edu" },
          { name: "MarsAcademy.az", detail: "Children's STEM academy - built the site.", slug: "mars-academy" },
          { name: "Edu.gov.az", detail: "The ministry's official website - support.", slug: "edu-gov" },
          { name: "Anket.edu.az", detail: "The ministry's survey platform - support.", slug: "anket-edu" },
          { name: "Azsmart.az", detail: "Online cash register product site - support.", slug: "azsmart" },
        ],
        stack: ["HTML5", "CSS3", "JavaScript", "jQuery", "React", "Context API", "Redux Toolkit", "GitLab"],
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
        highlights: ["Finished with a Certificate of Distinction."],
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
    summary: "Internal system for the Computer Science faculty - students, teachers and their records.",
    highlights: [
      "Joined in my third year; a year with the IT department as a full-stack developer.",
      "One of five students chosen from the faculty.",
      "My first working experience.",
    ],
    stack: ["Java", "Spring Boot", "React", "Bootstrap"],
  },
  {
    organization: "Algorithmics Global in Azerbaijan",
    role: "Frontend programming - one-semester course",
    period: "2022",
    location: "Baku, Azerbaijan",
    summary: "A semester-long frontend programme, entered by examination.",
    highlights: [
      "A coding school running in Azerbaijan with the Ministry of Education and ADNSU.",
      "Entrance exam - the programme went to the faculty's first 25 students.",
      "Exempted me from three of the five subjects that semester.",
      "Finished with 100/100; certificates presented by the Ministry of Education and Algorithmics.",
    ],
    stack: ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "Git", "GitHub"],
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
    issuer: "Algorithmics Global in Azerbaijan",
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
