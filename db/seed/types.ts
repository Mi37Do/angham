import type { MediaKey } from "../../lib/media";
import type { Localized } from "../schema";

/** Un article de fond, rédigé dans les quatre langues du site. */
export type SeedArticle = {
  slug: string;
  /** Date de publication affichée (ISO, heure d’Algérie). */
  publishedAt: string;
  title: Required<Localized>;
  summary: Required<Localized>;
  /** Paragraphes séparés par une ligne vide. */
  body: Required<Localized>;
  /** Photographie d’illustration (public/media, créditée dans lib/media-credits.json). */
  image: MediaKey;
  /** Sources consultées, pour la relecture (non publiées). */
  sources: string[];
};
