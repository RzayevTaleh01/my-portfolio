import type { Locale } from "../config";
import { az } from "./az";
import { en, type Dictionary } from "./en";
import { sk } from "./sk";

const dictionaries: Record<Locale, Dictionary> = { en, az, sk };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
