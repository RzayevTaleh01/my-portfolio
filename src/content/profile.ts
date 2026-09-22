import type { Profile } from "./types";

// Source: Taleh_Rzayev_Resume_2026_09.pdf and Taleh_Rzayev_FlowCV_Resume_2026-03-10.pdf

export const profile: Profile = {
  name: "Taleh Rzayev",
  authorName: "T. Rzayev",
  headline: "Software Engineer · AI Researcher",
  // location and now are set per visitor (Prešov for Slovakia, Riga elsewhere): see ./locations.ts
  location: "Riga, Latvia",
  email: "TalehRzayev2002@gmail.com",
  intro:
    "I have 4 years of frontend experience building production web applications with React and Next.js, and hands-on backend experience - REST APIs, databases and deployment. Alongside software engineering I work on AI research. My main interest is NLP for low-resource languages: the Turkic family, such as Azerbaijani, and the West Slavic group, such as Slovak and Czech.",
  bio: [
    "I started as a frontend intern at AzInTelecom in 2022, building the client and admin dashboards of the Sima Reporting System. From 2023 to 2026 I was at Edumedia-Azerbaijan, moving from junior to middle developer on Azerbaijan's national education platforms - including the ministry's Digital School platform and a new version of Video.edu.az built with Next.js. Since 2026 I have been a full-stack developer at ITM - Information Technology Center.",
    "Beyond the frontend I design complete systems. For Diaspor.org I built a multi-tenant publishing platform end to end: a Spring Boot REST API, a React admin panel, a server-rendered Next.js public site, PostgreSQL with versioned migrations and S3 for media. At ITM I also work in PHP and Laravel - an academic journal platform built on OJS, and the rebuild of a public health institute's portal.",
    "Professionally I am a software engineer. The research is something I do on my own time: I read papers, reproduce what I can, and I am learning to write research of my own. My direction is NLP for low-resource languages - the Turkic family, such as Azerbaijani, and the West Slavic group, such as Slovak and Czech. Adaptive learning is where I started, and EduVision and LangVis came out of it, but the weight has moved to language itself.",
    "I am preparing to take this further: a PhD in this area, and an academic track built on published work alongside the engineering one.",
    "In day-to-day engineering I use AI to speed up development, with a programmer's approach to prompt engineering. I now live in Slovakia and study Industrial Management at the Technical University of Košice.",
  ],
  now: "Based in Riga, Latvia",
  highlights: ["4 years frontend experience", "Backend: Node.js · Spring Boot", "NLP · low-resource languages", "English B2 · Slovak A2"],
  avatar: "/avatar.webp",
  // Replaced per visitor region in ./locations.ts
  cvPdf: "/cv/taleh-rzayev-cv.pdf",
  githubUsername: "RzayevTaleh01",
  // Set NEXT_PUBLIC_SITE_URL to your domain when you deploy (used for SEO and the sitemap).
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  socials: [
    { platform: "github", label: "GitHub", href: "https://github.com/RzayevTaleh01" },
    { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/rzayevtaleh01/" },
    { platform: "hackerrank", label: "HackerRank", href: "https://www.hackerrank.com/profile/rzayevtaleh01" },
    { platform: "eolymp", label: "E-Olymp", href: "https://eolymp.com/users/Taleh.Rzayev683.19" },
    { platform: "email", label: "Email", href: "mailto:TalehRzayev2002@gmail.com" },
  ],
};
