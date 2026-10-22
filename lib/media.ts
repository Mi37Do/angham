import credits from "./media-credits.json";

// Photographs shipped in public/media, all from Wikimedia Commons, with the
// author and licence each one requires to be credited (lib/media-credits.json).
export type MediaKey = keyof typeof credits;

export const media = (key: MediaKey) => credits[key];

/** "Riad Salih · CC BY 4.0 · Wikimedia Commons" (author omitted when unknown). */
export const creditLine = (key: MediaKey) => {
  const c = credits[key];
  return [c.author, c.license, "Wikimedia Commons"].filter(Boolean).join(" · ");
};

export const allCredits = Object.entries(credits).map(([key, c]) => ({ key, ...c }));
