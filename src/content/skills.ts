import type { ResearchDirection, SkillGroup } from "./types";

export const researchStatement =
  "I research adaptive, AI-driven learning: how a system can model what a learner knows, decide what to teach next, and explain it in natural language that stays grounded in the course.";

export const researchDirections: ResearchDirection[] = [
  {
    title: "Learner modelling",
    description: "Estimating what a student knows from noisy answers, so the system can adapt without asking the learner to self-report.",
    methods: ["Bayesian Knowledge Tracing", "Spaced repetition", "Error taxonomies"],
    projects: ["eduvision", "langvis"],
  },
  {
    title: "Reinforcement learning for pedagogy",
    description: "Learning a policy that keeps each learner in the flow zone - hard enough to grow, easy enough not to quit.",
    methods: ["PPO", "Reward shaping", "A/B evaluation"],
    projects: ["eduvision"],
  },
  {
    title: "Grounded conversational tutors",
    description: "LLM tutors that follow a pedagogical strategy and stay factual by retrieving from course material.",
    methods: ["Retrieval-augmented generation", "Neuro-symbolic control", "Real-time speech"],
    projects: ["eduvision", "langvis"],
  },
];

// Source: resume, plus the AI group from the projects on GitHub.

export const skills: SkillGroup[] = [
  {
    title: "Frontend",
    skills: ["React", "Next.js 14+ (App Router, SSR, Middleware, SEO)", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3 / Sass", "Tailwind", "Bootstrap"],
  },
  {
    title: "State & data",
    skills: ["Redux Toolkit", "Context API", "React Query", "React Hook Form", "Formik", "Zod", "Axios / REST"],
  },
  {
    title: "UI & design",
    skills: ["shadcn/ui", "Ant Design", "Figma", "Adobe XD"],
  },
  {
    title: "Backend & databases",
    skills: ["Node.js", "Express", "NestJS", "Java · Spring Boot", "PostgreSQL", "MySQL", "MongoDB"],
  },
  {
    title: "DevOps & tools",
    skills: ["Git (GitHub, GitLab)", "Docker & Compose", "CI/CD", "Linux / Bash", "Nginx", "Postman", "Swagger", "Jira"],
  },
  {
    title: "AI",
    skills: ["Prompt engineering", "LLM APIs (Gemini, Llama)", "RAG & embeddings", "Python"],
  },
];
