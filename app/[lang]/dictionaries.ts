import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/i18n";

const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  es: () => import("./dictionaries/es.json").then((m) => m.default),
} satisfies Record<Locale, unknown>;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["fr"]>>;

export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!locale || !hasLocale(locale)) notFound();
  return locale;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}
