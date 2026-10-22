export const locales = ["fr", "ar", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const isRtl = (locale: Locale) => locale === "ar";

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
  es: "Español",
};

/** flag-icons country code for each language (Arabic: Algeria). */
export const localeFlags: Record<Locale, string> = {
  fr: "fr",
  ar: "dz",
  en: "gb",
  es: "es",
};
