import type { Localized } from "@/db/schema";
import type { Locale } from "./i18n";

/** Texte dans la langue demandée, sinon en français (langue de référence). */
export const t = (value: Localized | null | undefined, locale: Locale) =>
  value ? value[locale] || value.fr : "";

const intlLocale: Record<Locale, string> = { fr: "fr-DZ", ar: "ar-DZ", en: "en-GB", es: "es-ES" };

export const formatDate = (date: Date, locale: Locale, withTime = false) =>
  new Intl.DateTimeFormat(intlLocale[locale], {
    dateStyle: "long",
    ...(withTime ? { timeStyle: "short" } : {}),
    timeZone: "Africa/Algiers",
  }).format(date);
