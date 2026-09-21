import type { Project } from "../types";

// Built at Edumedia-Azerbaijan, mostly for the Ministry of Science and Education.
// Short pages: what the system is and what I did on it - these are production
// systems I worked on in a team, not case studies with my own architecture.

const base = { kind: "work", organization: "Edumedia", links: {} } as const;

export const edumediaProjects: Project[] = [
  {
    ...base,
    slug: "digital-school",
    title: "Digital School",
    tagline: "The Ministry of Science and Education's national school platform - one portal for teachers, directors, students and parents.",
    year: 2026,
    featured: true,
    links: { demo: "https://digital.edu.az" },
    facts: [
      { label: "Role", value: "Frontend" },
      { label: "Users", value: "Teacher · Director · Student · Parent" },
      { label: "Services", value: "10+ built" },
      { label: "AI assistant", value: "Launched 06/2026" },
    ],
    overview: [
      "Digital School (Rəqəmsal məktəb) is the ministry's platform for learning, teaching, communication and collaboration in a digital environment. It is the biggest and heaviest system we built at Edumedia, and one of the deepest changes brought into Azerbaijani schools: the whole teaching process runs from one portal.",
      "Parents, teachers and directors sign in through the national Digital Login, including the SİMA digital signature; students sign in with their UTİS code and a password their parent sets.",
      "I built more than ten of its services from scratch. The work I remember most is the AI learning assistant.",
    ],
    components: [
      {
        name: "Student cabinet",
        role: "Learning outside the lesson",
        points: ["Video lessons, e-textbooks, tasks and tests for every topic.", "Questions to teachers and self-assessment."],
      },
      {
        name: "Parent cabinet",
        role: "Following a child's progress",
        points: ["Daily grades and the weekly timetable.", "A direct chat with the school director."],
      },
      {
        name: "Teacher cabinet",
        role: "The daily teaching record",
        points: ["Classes, weekly load and timetable.", "Electronic journals for formative and summative assessment."],
      },
      {
        name: "Director cabinet",
        role: "The whole school from one place",
        points: ["School statistics and instant reports.", "Timetables for every class and teacher, and answers to parents."],
      },
      {
        name: "AI learning assistant",
        role: "The part I remember most",
        points: [
          "A frontend developer by role, I was brought into the team that built it.",
          "A chatbot on a local generative model trained on the ministry's materials and hosted inside the country, so students can work through the official textbooks with it.",
          "Opened to students in June 2026, under Apps → Digital assistant in the student cabinet.",
        ],
      },
    ],
    stack: [
      { group: "Frontend", items: ["React", "TypeScript", "Redux Toolkit"] },
      { group: "AI", items: ["Local generative model", "Chat interface"] },
    ],
  },
  {
    ...base,
    slug: "video-edu",
    title: "Video.edu.az",
    tagline: "The ministry's video lesson platform, moved off its old system and rebuilt from scratch in Next.js.",
    year: 2025,
    links: { demo: "https://video.edu.az" },
    facts: [
      { label: "Role", value: "Frontend" },
      { label: "Framework", value: "Next.js" },
      { label: "Scope", value: "Full rebuild" },
    ],
    overview: [
      "Video.edu.az carries the ministry's video lessons. The old system was replaced rather than patched: the new version was assembled from scratch on Next.js, and I helped carry the platform across to it.",
    ],
    stack: [{ group: "Frontend", items: ["Next.js", "React", "TypeScript"] }],
  },
  {
    ...base,
    slug: "pts-edu",
    title: "Pts.edu.az",
    tagline: "A large internal system for vocational schools - more than ten services built or reworked.",
    year: 2025,
    links: { demo: "https://pts.edu.az" },
    facts: [
      { label: "Role", value: "Frontend" },
      { label: "Services", value: "10+" },
      { label: "Users", value: "Vocational schools" },
    ],
    overview: [
      "Pts.edu.az is the internal system vocational schools run on. It is large, and I built more than ten of its services from scratch or helped rework them.",
    ],
    components: [
      {
        name: "Modules",
        role: "Some of the services I worked on",
        points: ["Online issuing of diplomas.", "Individual study plans.", "Student transfers."],
      },
    ],
    stack: [{ group: "Frontend", items: ["React", "Redux Toolkit", "JavaScript"] }],
  },
  {
    ...base,
    slug: "portal-edu",
    title: "Portal.edu.az",
    tagline: "The ministry's services portal - improving the study-abroad application flows.",
    year: 2025,
    links: { demo: "https://portal.edu.az" },
    facts: [
      { label: "Role", value: "Frontend" },
      { label: "Programmes", value: "HTP · DP" },
    ],
    overview: [
      "Portal.edu.az is where the ministry's services are applied for. My main work there was improving the applications for study abroad under two programmes: the Intergovernmental Education Programme (HTP) and the State Programme for the education of Azerbaijani youth abroad (DP).",
    ],
    stack: [{ group: "Frontend", items: ["React", "JavaScript"] }],
  },
  {
    ...base,
    slug: "karabakh-edu",
    title: "Karabakh.edu.az",
    tagline: "The official website of Karabakh University.",
    year: 2025,
    links: { demo: "https://karabakh.edu.az" },
    facts: [{ label: "Role", value: "Frontend" }],
    overview: ["The official website of Karabakh University. I worked on it in the project team - one of the projects I count as a clear success."],
    stack: [{ group: "Frontend", items: ["HTML5", "CSS3", "JavaScript"] }],
  },
  {
    ...base,
    slug: "ict-edu",
    title: "Ict.edu.az",
    tagline: "The site of the ministry's Education System Informatisation Department - frontend written from scratch.",
    year: 2024,
    links: { demo: "https://ict.edu.az" },
    facts: [
      { label: "Role", value: "Frontend" },
      { label: "Scope", value: "From scratch" },
    ],
    overview: [
      "The website of the Education System Informatisation Department, an institution under the Ministry of Science and Education: e-services, the Azerbaijan Education Network, e-resources and news. I wrote its frontend from scratch.",
    ],
    stack: [{ group: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "jQuery"] }],
  },
  {
    ...base,
    slug: "ite",
    title: "Ite.az",
    tagline: "Innovative Technologies in Education - a training centre for teachers, with courses, a basket and certificate checks.",
    year: 2024,
    links: { demo: "https://ite.az" },
    facts: [{ label: "Role", value: "Frontend" }],
    overview: [
      "Ite.az is the Innovative Technologies in Education continuing-education centre: digital-literacy and ICT courses for teachers, international certification, a course basket and certificate verification. I built the project's frontend as part of its team.",
    ],
    stack: [{ group: "Frontend", items: ["HTML5", "CSS3", "JavaScript"] }],
  },
  {
    ...base,
    slug: "mars-academy",
    title: "MarsAcademy.az",
    tagline: "A children's STEM academy - robotics, engineering, programming and digital art, by age group.",
    year: 2024,
    links: { demo: "https://marsacademy.az" },
    facts: [
      { label: "Role", value: "Frontend" },
      { label: "Age groups", value: "5-7 · 8-11 · 12-15" },
    ],
    overview: [
      "Mars Academy teaches children robotics, engineering, programming and digital art, in three programmes by age - Prima (5-7), Alta (8-11) and Ultima (12-15). The site carries the programmes, trainers, blog and online payment. I built it.",
    ],
    stack: [{ group: "Frontend", items: ["HTML5", "CSS3", "JavaScript"] }],
  },
  {
    ...base,
    slug: "edu-gov",
    title: "Edu.gov.az",
    tagline: "The official website of the Ministry of Science and Education - support.",
    year: 2024,
    links: { demo: "https://edu.gov.az" },
    facts: [{ label: "Role", value: "Support" }],
    overview: ["The ministry's official website. I provided support on it."],
    stack: [{ group: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "jQuery"] }],
  },
  {
    ...base,
    slug: "anket-edu",
    title: "Anket.edu.az",
    tagline: "The ministry's survey platform - a Google Forms-style tool for official surveys.",
    year: 2024,
    links: { demo: "https://anket.edu.az" },
    facts: [{ label: "Role", value: "Support" }],
    overview: [
      "Anket.edu.az is the Ministry of Science and Education's survey management platform - a Google Forms-style tool. Surveys are opened to citizens through direct links during a set activity period. I took part in its team on support.",
    ],
    stack: [{ group: "Frontend", items: ["React", "JavaScript"] }],
  },
  {
    ...base,
    slug: "azsmart",
    title: "Azsmart.az",
    tagline: "Product site for online cash registers - support.",
    year: 2024,
    links: { demo: "https://azsmart.az" },
    facts: [{ label: "Role", value: "Support" }],
    overview: ["The product site for Az Smart's online cash registers, taking both cash and card payments. I provided support on it."],
    stack: [{ group: "Frontend", items: ["HTML5", "CSS3", "JavaScript"] }],
  },
];
