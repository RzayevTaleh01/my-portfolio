export type Region = "sk" | "intl";

export const REGION_HEADER = "x-visitor-region";

export function regionFromCountry(country: string | null | undefined): Region {
  return country?.toUpperCase() === "SK" ? "sk" : "intl";
}

export function isRegion(value: string | null | undefined): value is Region {
  return value === "sk" || value === "intl";
}
