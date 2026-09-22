import "server-only";
import type { AssistantTopic } from "@/components/assistant";
import type { SiteContent } from "@/content";
import { fmt, localize, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Region } from "@/i18n/region";
import { getAllPosts } from "@/lib/posts";

const SKILLS_PER_GROUP = 5;
const FEATURED_PROJECTS = 4;

/** "4 years" / "4 roky" / "5 rokov". */
function yearsText(forms: Dictionary["assistant"]["years"], n: number) {
  const form = n === 1 ? forms.one : n >= 2 && n <= 4 ? forms.few : forms.other;
  return fmt(form, { n });
}

/** Earliest start year in "03/2023 - 08/2026" or "2021 - 2022". */
function startYear(period: string) {
  return Number(period.match(/\d{4}/)?.[0] ?? new Date().getFullYear());
}

/**
 * Scripted answers for the quick-guide chat. They describe Taleh in the third
 * person and are assembled from the same content the pages render, so roles,
 * dates and counts stay correct (and translated) without a second copy.
 */
export function buildAssistantTopics(lang: Locale, region: Region, content: SiteContent, dict: Dictionary): AssistantTopic[] {
  const t = dict.assistant;
  const { profile, experience, skills, projects, researchDirections, languages } = content;
  const education = region === "sk" ? content.education : content.educationIntl;
  const [latestJob] = experience;
  const [latestRole] = latestJob.roles;
  const posts = getAllPosts(lang);
  const [latestPost] = posts;

  const roles = experience.flatMap((job) => job.roles.map((role) => ({ job, role })));
  const firstYear = Math.min(...roles.map(({ role }) => startYear(role.period)));
  const years = yearsText(t.years, Math.max(1, new Date().getFullYear() - firstYear));
  const roleText = ({ job, role }: (typeof roles)[number]) =>
    fmt(t.answers.role, { role: role.title, org: job.organization, period: role.period });
  const list = (items: string[]) => items.join(", ");

  const featured = projects.filter((p) => p.featured).slice(0, FEATURED_PROJECTS);
  const research = projects.filter((p) => p.kind === "research");

  const topics: AssistantTopic[] = [
    {
      id: "who",
      label: t.topics.who,
      answer: fmt(t.answers.who, { location: profile.location, years, role: latestRole.title, org: latestJob.organization }),
      link: { label: t.links.who, href: localize(lang, "/about") },
    },
    {
      id: "experience",
      label: t.topics.experience,
      answer: fmt(t.answers.experience, {
        years,
        current: roleText(roles[0]),
        previous: roles.slice(1).map(roleText).join("; "),
      }),
      link: { label: t.links.home, href: `${localize(lang, "/")}#experience` },
    },
    {
      id: "skills",
      label: t.topics.skills,
      answer: fmt(t.answers.skills, {
        groups: skills.map((g) => `• ${g.title}: ${list(g.skills.slice(0, SKILLS_PER_GROUP))}`).join("\n"),
      }),
      link: { label: t.links.skills, href: `${localize(lang, "/")}#skills` },
    },
    {
      id: "projects",
      label: t.topics.projects,
      answer: fmt(t.answers.projects, { count: projects.length, featured: list(featured.map((p) => p.title)) }),
      link: { label: t.links.projects, href: localize(lang, "/projects") },
    },
    {
      id: "research",
      label: t.topics.research,
      answer: fmt(t.answers.research, {
        directions: list(researchDirections.map((d) => d.title)),
        projects: list(research.map((p) => p.title)),
      }),
      link: { label: t.links.research, href: localize(lang, "/research") },
    },
    {
      id: "education",
      label: t.topics.education,
      answer: fmt(t.answers.education, {
        education: education
          .map((e) => `• ${fmt(t.answers.educationItem, { degree: e.degree, field: e.field, institution: e.institution, period: e.period })}`)
          .join("\n"),
        languages: list(languages.map((l) => `${l.name} - ${l.level}`)),
      }),
      link: { label: t.links.education, href: localize(lang, "/cv") },
    },
    {
      id: "cv",
      label: t.topics.cv,
      answer: t.answers.cv,
      link: { label: t.links.cv, href: localize(lang, "/cv") },
    },
  ];

  if (latestPost) {
    topics.push({
      id: "articles",
      label: t.topics.articles,
      answer: fmt(t.answers.articles, { count: posts.length, first: latestPost.title }),
      link: { label: t.links.articles, href: localize(lang, "/writing") },
    });
  }

  if (profile.email) {
    topics.push({
      id: "contact",
      label: t.topics.contact,
      answer: fmt(t.answers.contact, { email: profile.email }),
      link: { label: t.links.contact, href: `mailto:${profile.email}` },
    });
  }

  return topics;
}
