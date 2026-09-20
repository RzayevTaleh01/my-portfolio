import type { Locale } from "../config";
import { en, type Dictionary } from "./en";
import { sk } from "./sk";

const dictionaries: Record<Locale, Dictionary> = { en, sk };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
