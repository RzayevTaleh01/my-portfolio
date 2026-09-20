import "server-only";
import type { AssistantTopic } from "@/components/assistant";
import type { SiteContent } from "@/content";
import { fmt, localize, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getAllPosts } from "@/lib/posts";

/**
 * Scripted answers for the quick-guide chat, built from the same content the
 * pages render - so they stay correct (and translated) without a second copy.
 */
export function buildAssistantTopics(lang: Locale, content: SiteContent, dict: Dictionary): AssistantTopic[] {
  const t = dict.assistant;
  const { profile, experience, skills, projects, researchStatement } = content;
  const [latestJob] = experience;
  const posts = getAllPosts(lang);
  const [latestPost] = posts;
  const years = profile.highlights[0];

  const topics: AssistantTopic[] = [
    { id: "who", label: t.topics.who, answer: profile.intro },
    {
      id: "experience",
      label: t.topics.experience,
      answer: fmt(t.answers.experience, { years, role: latestJob.role, org: latestJob.organization }),
      link: { label: t.links.home, href: `${localize(lang, "/")}#experience` },
    },
    {
      id: "skills",
      label: t.topics.skills,
      answer: fmt(t.answers.skills, { skills: skills.map((g) => g.title).join(", ") }),
      link: { label: t.links.skills, href: `${localize(lang, "/")}#skills` },
    },
    {
      id: "projects",
      label: t.topics.projects,
      answer: fmt(t.answers.projects, { count: projects.length, first: projects[0].title }),
      link: { label: t.links.projects, href: localize(lang, "/projects") },
    },
    {
      id: "research",
      label: t.topics.research,
      answer: fmt(t.answers.research, { statement: researchStatement }),
      link: { label: t.links.research, href: localize(lang, "/research") },
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
