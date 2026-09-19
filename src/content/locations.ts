import type { Locale } from "@/i18n/config";
import type { Region } from "@/i18n/region";
import type { Profile } from "./types";

/**
 * What the visitor sees depends on where they are:
 *   sk   - visitors from Slovakia: Prešov, the Slovak CV, the TU Košice studies
 *   intl - everyone else: Riga, the international CV, the Baku studies
 * `location` appears in the footer and CV header, `now` under the name in the sidebar.
 * The education list itself lives in ./experience.ts (`education` / `educationIntl`).
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

/** Both save as the same file name; see PrintButton. */
const cvPdf: Record<Region, string> = {
  sk: "/taleh-rzayev-cv-sk.pdf",
  intl: "/taleh-rzayev-cv.pdf",
};

export function withRegion(profile: Profile, locale: Locale, region: Region): Profile {
  return { ...profile, ...locations[region][locale], cvPdf: cvPdf[region] };
}
