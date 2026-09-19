import type { Project } from "../types";

export const devcodeLms: Project = {
  slug: "devcode-lms",
  title: "DevCode Academy LMS",
  tagline: "A role-based learning management system for programming schools.",
  category: "engineering",
  status: "stable",
  year: 2025,
  featured: true,
  links: { repo: "https://github.com/RzayevTaleh01/devcode_lms" },
  facts: [
    { label: "Roles", value: "Admin · Teacher · Student" },
    { label: "Tables", value: "17" },
    { label: "Pages", value: "30+" },
    { label: "Migrations", value: "Drizzle Kit" },
  ],
  overview: [
    "DevCode Academy runs a programming school end to end: courses and lessons, live class sessions with attendance, assignments with grading, public certificate verification and a blog.",
    "Each role gets its own dashboard and navigation, backed by a single typed schema shared by the client and the server.",
  ],
  architecture: {
    summary:
      "A React single-page app talks to an Express REST API. The database schema is defined once in a shared module and reused for queries, migrations and request validation.",
    layers: [
      {
        name: "Client",
        nodes: [
          { name: "Admin", detail: "Courses, teachers, students" },
          { name: "Teacher", detail: "Lessons, grading, attendance" },
          { name: "Student", detail: "Courses, assignments, grades" },
          { name: "Public", detail: "Landing, blog, certificate check" },
        ],
      },
      {
        name: "Client runtime",
        nodes: [
          { name: "Wouter", detail: "Routing" },
          { name: "TanStack Query", detail: "Server-state cache" },
          { name: "React Hook Form + Zod", detail: "Validated forms" },
        ],
      },
      {
        name: "API",
        nodes: [
          { name: "REST routes", detail: "Express · TypeScript ESM" },
          { name: "Auth", detail: "Sessions + role guards" },
          { name: "Storage layer", detail: "Repository over Drizzle" },
        ],
      },
      {
        name: "Shared",
        nodes: [{ name: "shared/schema.ts", detail: "Drizzle tables + drizzle-zod schemas" }],
      },
      {
        name: "Data",
        nodes: [
          { name: "PostgreSQL", detail: "Neon serverless" },
          { name: "Session store", detail: "connect-pg-simple" },
        ],
      },
    ],
  },
  components: [
    {
      name: "Course domain",
      role: "Content and enrolment",
      points: [
        "Courses → lessons → materials and lesson assignments, plus separate offline courses with their own enrolments.",
        "Lesson progress is tracked per student and aggregated on dashboards.",
      ],
    },
    {
      name: "Live sessions & attendance",
      role: "Classroom operations",
      points: [
        "Teachers open a lesson session; a global active-session bar follows them across pages.",
        "Attendance is recorded per session and visible to students.",
      ],
    },
    {
      name: "Assignments & grading",
      role: "Learning loop",
      points: ["Students submit work, teachers grade with feedback, grades roll up into the student's record."],
    },
    {
      name: "Certificates",
      role: "Trust outside the platform",
      points: ["Certificates are issued on completion and can be verified publicly by anyone with the certificate code."],
    },
  ],
  flow: [
    { title: "Admin", detail: "Creates courses and assigns teachers." },
    { title: "Teacher", detail: "Builds lessons, runs live sessions, takes attendance." },
    { title: "Student", detail: "Enrols, follows lessons, submits assignments." },
    { title: "Teacher", detail: "Grades submissions; progress updates on both dashboards." },
    { title: "Platform", detail: "Issues a verifiable certificate on completion." },
  ],
  deepDives: [
    {
      title: "One schema, three uses",
      body: [
        "Tables are declared once with Drizzle. The same definitions produce SQL migrations, typed queries on the server, and Zod insert schemas that validate request bodies and client forms - so the API contract cannot drift from the database.",
      ],
      code: {
        lang: "ts",
        title: "shared/schema.ts (excerpt)",
        source: `export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  level: varchar("level", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  instructorId: varchar("instructor_id").notNull(),
  isActive: boolean("is_active").default(true),
  enrollmentCount: integer("enrollment_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reused by the API (request validation) and the client (forms)
export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCourse = z.infer<typeof insertCourseSchema>;`,
      },
    },
  ],
  decisions: [
    {
      title: "Storage interface between routes and database",
      detail: "Routes depend on a storage abstraction, not on Drizzle directly, which keeps handlers thin and the data layer testable.",
    },
    {
      title: "Server state in TanStack Query",
      detail: "No global client store: server data is cached and invalidated by query keys, UI state stays local.",
    },
    {
      title: "Sessions in PostgreSQL",
      detail: "Sessions live in the same database, so the app scales horizontally without a separate session service.",
    },
  ],
  stack: [
    { group: "Frontend", items: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "TanStack Query", "Wouter"] },
    { group: "Backend", items: ["Node.js", "Express", "Passport", "express-session"] },
    { group: "Data", items: ["PostgreSQL (Neon)", "Drizzle ORM", "drizzle-zod"] },
  ],
  next: ["Automated grading for code assignments.", "Real-time notifications for live sessions."],
};
