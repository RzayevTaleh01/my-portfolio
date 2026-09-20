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
    "I have 4 years of frontend experience building production web applications with React and Next.js, and hands-on backend experience - REST APIs, databases and deployment. As an AI researcher, I build adaptive learning systems: knowledge tracing, reinforcement learning and grounded LLM tutors.",
  bio: [
    "I started as a frontend intern at AzInTelecom in 2022, building the client and admin dashboards of the Sima Reporting System. From 2023 to 2026 I worked at Edumedia-Azerbaijan on national education platforms - including a new version of Video.edu.az built with Next.js, and new services for Portal.edu.az and Pts.edu.az.",
    "Beyond the frontend I design complete systems. For Diaspor.org I built a multi-tenant publishing platform end to end: a Spring Boot REST API, a React admin panel, a server-rendered Next.js public site, PostgreSQL with versioned migrations and S3 for media.",
    "My research is about AI in education: modelling what a learner knows, deciding what to teach next, and explaining it in grounded natural language. EduVision, my adaptive tutoring system, combines Bayesian Knowledge Tracing, a PPO reinforcement-learning agent and retrieval-augmented LLMs; LangVis is a real-time voice tutor for speaking practice.",
    "In day-to-day engineering I use AI to speed up development, with a programmer's approach to prompt engineering. I now live in Slovakia and study Industrial Management at the Technical University of Košice.",
  ],
  now: "Based in Riga, Latvia",
  highlights: ["4 years frontend experience", "Backend: Node.js · Spring Boot", "AI research · adaptive learning", "English B2 · Slovak A2"],
  avatar: "/avatar.webp",
  // Replaced per visitor region in ./locations.ts
  cvPdf: "/taleh-rzayev-cv.pdf",
  githubUsername: "RzayevTaleh01",
  // Set NEXT_PUBLIC_SITE_URL to your domain when you deploy (used for SEO and the sitemap).
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  socials: [
    { platform: "github", label: "GitHub", href: "https://github.com/RzayevTaleh01" },
    { platform: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/rzayevtaleh01/" },
    { platform: "hackerrank", label: "HackerRank", href: "https://www.hackerrank.com/profile/rzayevtaleh01" },
    { platform: "email", label: "Email", href: "mailto:TalehRzayev2002@gmail.com" },
  ],
};
