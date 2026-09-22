import type { ResearchDirection, SkillGroup } from "./types";

export const researchStatement =
  "A software engineer by profession, reading and building my way into research. The direction is NLP for low-resource languages - the Turkic family, such as Azerbaijani, and the West Slavic group, such as Slovak and Czech - and this page is where that work is kept while I prepare for a PhD in it.";

export const researchDirections: ResearchDirection[] = [
  {
    title: "NLP for Azerbaijani",
    description:
      "An agglutinative language with little annotated data. What I want to understand: how far tokenisation and morphology-aware modelling can carry a language before corpus size becomes the wall.",
    methods: ["Morphological segmentation", "Corpus building", "Transfer from high-resource languages"],
    projects: [],
  },
  {
    title: "Transfer across the Turkic family",
    description:
      "Turkish has data; Azerbaijani, Turkmen and the rest have far less. The family shares structure, so the question is how much of a high-resource sibling transfers, and where it quietly stops.",
    methods: ["Multilingual pretraining", "Shared subword vocabularies", "Zero-shot evaluation"],
    projects: [],
  },
  {
    title: "Czech and Slovak",
    description:
      "Two close, morphologically rich languages I live between. They make a natural testbed for cross-lingual work: near-identical structure, separate data, separate communities.",
    methods: ["Cross-lingual alignment", "Rich morphology", "Low-resource fine-tuning"],
    projects: [],
  },
  {
    title: "Adaptive learning systems",
    description:
      "Where I started, and still one thread: modelling what a learner knows, deciding what to teach next, and explaining it in language grounded in the course material.",
    methods: ["Bayesian Knowledge Tracing", "PPO", "Retrieval-augmented generation"],
    projects: ["eduvision", "langvis"],
  },
];

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
