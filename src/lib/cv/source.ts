import "server-only";
import { getContent } from "@/content";
import { withRegion } from "@/content/locations";
import { locales, type Locale } from "@/i18n/config";
import { ids, type CvLocaleSource, type CvSource } from "./model";

export function getCvSource(): CvSource {
  const en = getContent("en");
  const seen = new Set<string>();
  const picks: { list: "education" | "educationIntl"; index: number }[] = [];
  (["education", "educationIntl"] as const).forEach((list) =>
    en[list].forEach((e, index) => {
      if (seen.has(ids.education(e))) return;
      seen.add(ids.education(e));
      picks.push({ list, index });
    }),
  );

  const build = (locale: Locale): CvLocaleSource => {
    const c = getContent(locale);
    return {
      profile: c.profile,
      regionLocation: {
        sk: withRegion(c.profile, locale, "sk").location,
        intl: withRegion(c.profile, locale, "intl").location,
      },
      experience: c.experience,
      volunteering: c.volunteering,
      education: picks.map((p) => c[p.list][p.index]),
      certificates: c.certificates,
      languages: c.languages,
      skills: c.skills,
      projects: c.projects.map(({ slug, title, tagline, kind, organization, year, links, stack }) => ({
        slug,
        title,
        tagline,
        kind,
        organization,
        year,
        links,
        stack,
      })),
      publications: c.publications,
    };
  };

  return Object.fromEntries(locales.map((l) => [l, build(l)])) as CvSource;
}
