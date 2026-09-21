import type { ArchiveProject, Project } from "../types";
import { aments } from "./aments";
import { cryptoTrader } from "./crypto-trader";
import { devcodeLms } from "./devcode-lms";
import { diaspor } from "./diaspor";
import { edumediaProjects } from "./edumedia";
import { etacxi } from "./etacxi";
import { eduvision } from "./eduvision";
import { langvis } from "./langvis";
import { unecTtj } from "./unec-ttj";
import { vacancyBot } from "./vacancy-bot";

// Order here is the display order.
export const projects: Project[] = [
  diaspor,
  unecTtj,
  etacxi,
  ...edumediaProjects,
  eduvision,
  langvis,
  devcodeLms,
  cryptoTrader,
  vacancyBot,
  aments,
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null;
}

/** Earlier and smaller projects - shown as a compact list. */
export const archive: ArchiveProject[] = [
  {
    title: "Frontend Quiz App",
    description: "Quiz app with dynamic question architecture and localStorage persistence.",
    year: 2024,
    stack: ["JavaScript", "HTML", "CSS"],
    repo: "https://github.com/RzayevTaleh01/frontend-quiz-app",
  },
  {
    title: "Static Web Translate",
    description: "Client-side page translation with clean, dependency-free code.",
    year: 2024,
    stack: ["JavaScript"],
    repo: "https://github.com/RzayevTaleh01/static_web_translate",
    demo: "https://static-translate.netlify.app/",
  },
  {
    title: "LensLight",
    description: "Full-stack photo sharing platform with a Node.js and Express backend.",
    year: 2023,
    stack: ["Node.js", "Express", "MongoDB"],
    repo: "https://github.com/RzayevTaleh01/LensLight_Full_Project",
    demo: "https://lens-light-full-project.vercel.app",
  },
  {
    title: "Task Manager",
    description: "Task manager with Context API, dark mode and localStorage.",
    year: 2023,
    stack: ["React", "Vite", "Context API"],
    repo: "https://github.com/RzayevTaleh01/Context_Api_Task_Manager",
    demo: "https://task-manager-taleh.netlify.app",
  },
  {
    title: "DevJobs",
    description: "Job board UI with filtering and localStorage.",
    year: 2023,
    stack: ["JavaScript", "HTML", "CSS"],
    repo: "https://github.com/RzayevTaleh01/DevJobs_Project",
    demo: "https://devjobs-mcode.netlify.app/",
  },
  {
    title: "Next.js JWT Auth",
    description: "Authentication flow with JSON Web Tokens in Next.js.",
    year: 2023,
    stack: ["Next.js", "JWT"],
    repo: "https://github.com/RzayevTaleh01/nextjs_jwt_auth",
  },
  {
    title: "URL Shortener",
    description: "Spring Boot service with validation, exception handling and custom aliases.",
    year: 2022,
    stack: ["Java", "Spring Boot", "H2"],
    repo: "https://github.com/RzayevTaleh01/Java_UrlShortener_Project",
  },
  {
    title: "HRMS",
    description: "Human resources management system with email verification - Spring Boot backend and React frontend.",
    year: 2021,
    stack: ["Java", "Spring Boot", "React", "PostgreSQL"],
    repo: "https://github.com/RzayevTaleh01/Hrms_Java_Backend",
  },
];
