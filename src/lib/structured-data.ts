import "server-only";
import type { Education, Experience, Profile, Project, SkillGroup } from "@/content";
import { localize, localeTags, type Locale } from "@/i18n/config";
import type { PostMeta } from "@/lib/posts";
import { absolute, clamp, siteUrl } from "@/lib/seo";

type Json = Record<string, unknown>;

const strip = <T extends Json>(value: T): T => Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))) as T;

export function personId(profile: Profile) {
  return `${siteUrl(profile)}/#person`;
}

export function personSchema(profile: Profile, lang: Locale, extras: { experience?: Experience[]; education?: Education[]; skills?: SkillGroup[] } = {}): Json {
  const [currentJob] = extras.experience ?? [];
  return strip({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(profile),
    name: profile.name,
    url: absolute(profile, localize(lang, "/")),
    image: absolute(profile, profile.avatar),
    jobTitle: profile.headline,
    description: clamp(profile.intro, 300),
    email: profile.email ? `mailto:${profile.email}` : undefined,
    address: profile.location ? { "@type": "PostalAddress", addressLocality: profile.location } : undefined,
    knowsLanguage: undefined,
    knowsAbout: (extras.skills ?? []).flatMap((group) => group.skills).slice(0, 25),
    worksFor: currentJob ? strip({ "@type": "Organization", name: currentJob.organization }) : undefined,
    alumniOf: (extras.education ?? []).map((e) => strip({ "@type": "EducationalOrganization", name: e.institution })),
    sameAs: profile.socials.filter((s) => s.platform !== "email").map((s) => s.href),
  });
}

export function websiteSchema(profile: Profile, lang: Locale): Json {
  return strip({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl(profile)}/#website`,
    url: absolute(profile, localize(lang, "/")),
    name: profile.name,
    inLanguage: localeTags[lang],
    publisher: { "@id": personId(profile) },
  });
}

export function breadcrumbSchema(profile: Profile, lang: Locale, trail: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(profile, localize(lang, item.path)),
    })),
  };
}

export function articleSchema(profile: Profile, lang: Locale, post: PostMeta): Json {
  const url = absolute(profile, localize(lang, `/writing/${post.slug}`));
  return strip({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: clamp(post.summary),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: localeTags[post.locale],
    keywords: post.tags,
    timeRequired: `PT${post.minutes}M`,
    articleSection: post.category,
    mainEntityOfPage: url,
    url,
    image: `${url}/opengraph-image`,
    author: { "@id": personId(profile) },
    publisher: { "@id": personId(profile) },
  });
}

export function projectSchema(profile: Profile, lang: Locale, project: Project): Json {
  const url = absolute(profile, localize(lang, `/projects/${project.slug}`));
  const code = project.links.repo;
  return strip({
    "@context": "https://schema.org",
    "@type": code ? "SoftwareSourceCode" : "CreativeWork",
    name: project.title,
    description: clamp(project.tagline),
    url,
    image: `${url}/opengraph-image`,
    inLanguage: localeTags[lang],
    dateCreated: String(project.year),
    codeRepository: code,
    programmingLanguage: project.stack.flatMap((g) => g.items).slice(0, 12),
    keywords: project.stack.flatMap((g) => g.items).slice(0, 15),
    author: { "@id": personId(profile) },
    creator: { "@id": personId(profile) },
    sourceOrganization: project.organization ? { "@type": "Organization", name: project.organization } : undefined,
  });
}

export function listSchema(profile: Profile, lang: Locale, name: string, items: { title: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.title,
      url: absolute(profile, localize(lang, item.path)),
    })),
  };
}
