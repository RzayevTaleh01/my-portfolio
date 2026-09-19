import type { Locale } from "@/i18n/config";
import type { Region } from "@/i18n/region";
import type { Profile } from "./types";

/**
 * The location shown on the site depends on where the visitor is:
 * visitors from Slovakia see Prešov, everyone else sees Riga.
 * `location` is used in the footer and CV header, `now` under the name in the sidebar.
 */
const locations: Record<Region, Record<Locale, { location: string; now: string }>> = {
  sk: {
    en: { location: "Prešov, Slovakia", now: "Based in Prešov, Slovakia" },
    az: { location: "Preşov, Slovakiya", now: "Preşov, Slovakiya" },
    sk: { location: "Prešov, Slovensko", now: "Prešov, Slovensko" },
  },
  intl: {
    en: { location: "Riga, Latvia", now: "Based in Riga, Latvia" },
    az: { location: "Riqa, Latviya", now: "Riqa, Latviya" },
    sk: { location: "Riga, Lotyšsko", now: "Riga, Lotyšsko" },
  },
};

export function withRegion(profile: Profile, locale: Locale, region: Region): Profile {
  return { ...profile, ...locations[region][locale] };
}
