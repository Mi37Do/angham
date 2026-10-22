import type { Localized } from "@/db/schema";

export const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export const localized = (formData: FormData, key: string): Localized => ({
  fr: text(formData, `${key}.fr`),
  ar: text(formData, `${key}.ar`) || undefined,
  en: text(formData, `${key}.en`) || undefined,
  es: text(formData, `${key}.es`) || undefined,
});

export const optionalLocalized = (formData: FormData, key: string) => {
  const value = localized(formData, key);
  return value.fr || value.ar || value.en || value.es ? value : null;
};

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || crypto.randomUUID().slice(0, 8);

// L’Algérie est en UTC+1 toute l’année (pas d’heure d’été).
export const fromAlgiersInput = (value: string) => (value ? new Date(`${value}:00+01:00`) : null);

export const toAlgiersInput = (date: Date | null | undefined) =>
  date ? new Date(date.getTime() + 3600_000).toISOString().slice(0, 16) : "";
