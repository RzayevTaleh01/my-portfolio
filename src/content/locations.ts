import type { Locale } from "@/i18n/config";
import type { Region } from "@/i18n/region";
import type { Profile } from "./types";

const locations: Record<Region, Record<Locale, { location: string; now: string }>> = {
  sk: {
    en: { location: "Prešov, Slovakia", now: "Based in Prešov, Slovakia" },
    sk: { location: "Prešov, Slovensko", now: "Prešov, Slovensko" },
  },
  intl: {
    en: { location: "Riga, Latvia", now: "Based in Riga, Latvia" },
    sk: { location: "Riga, Lotyšsko", now: "Riga, Lotyšsko" },
  },
};

const bioClosing: Record<Region, Record<Locale, string>> = {
  sk: {
    en: "In day-to-day engineering I use AI to speed up development, with a programmer's approach to prompt engineering. I now live in Slovakia and study Industrial Management at the Technical University of Košice.",
    sk: "Pri každodennej práci používam AI na zrýchlenie vývoja a k prompt engineeringu pristupujem ako programátor. Teraz žijem na Slovensku a študujem Priemyselný manažment na Technickej univerzite v Košiciach.",
  },
  intl: {
    en: "In day-to-day engineering I use AI to speed up development, with a programmer's approach to prompt engineering. I hold a Master's degree in System Programming from Azerbaijan Technical University.",
    sk: "Pri každodennej práci používam AI na zrýchlenie vývoja a k prompt engineeringu pristupujem ako programátor. Mám magisterský titul v odbore Systémové programovanie z Azerbajdžanskej technickej univerzity.",
  },
};

export function withRegion(profile: Profile, locale: Locale, region: Region): Profile {
  return {
    ...profile,
    ...locations[region][locale],
    bio: [...profile.bio.slice(0, -1), bioClosing[region][locale]],
  };
}
