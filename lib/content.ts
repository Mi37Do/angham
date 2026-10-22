import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, desc, eq, gte, inArray, lt } from "drizzle-orm";
import { db } from "@/db";
import { events, publications, resources } from "@/db/schema";
import { hasDatabase } from "./data-source";
import { snapshot } from "./snapshot";

// Lectures publiques mises en cache ; l’administration les invalide avec updateTag().
// Sans base de données (aperçu), elles lisent content/snapshot.json avec les mêmes filtres et le même ordre.
export const tags = {
  events: "events",
  publications: "publications",
  resources: "resources",
} as const;

export async function getUpcomingEvents(limit = 20) {
  "use cache";
  cacheLife("hours");
  cacheTag(tags.events);
  const now = new Date();
  if (!hasDatabase)
    return snapshot.events
      .filter((e) => e.startsAt >= now)
      .sort((a, b) => +a.startsAt - +b.startsAt)
      .slice(0, limit);
  return db
    .select()
    .from(events)
    .where(and(eq(events.published, true), gte(events.startsAt, now)))
    .orderBy(asc(events.startsAt))
    .limit(limit);
}

export async function getPastEvents(limit = 50) {
  "use cache";
  cacheLife("hours");
  cacheTag(tags.events);
  const now = new Date();
  if (!hasDatabase)
    return snapshot.events
      .filter((e) => e.startsAt < now)
      .sort((a, b) => +b.startsAt - +a.startsAt)
      .slice(0, limit);
  return db
    .select()
    .from(events)
    .where(and(eq(events.published, true), lt(events.startsAt, now)))
    .orderBy(desc(events.startsAt))
    .limit(limit);
}

export async function getEvent(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(tags.events);
  if (!hasDatabase) return snapshot.events.find((e) => e.slug === slug) ?? null;
  const [row] = await db
    .select()
    .from(events)
    .where(and(eq(events.slug, slug), eq(events.published, true)))
    .limit(1);
  return row ?? null;
}

export async function getPublications(limit = 50) {
  "use cache";
  cacheLife("hours");
  cacheTag(tags.publications);
  if (!hasDatabase)
    return [...snapshot.publications]
      .sort((a, b) => +(b.publishedAt ?? 0) - +(a.publishedAt ?? 0))
      .slice(0, limit);
  return db
    .select()
    .from(publications)
    .where(eq(publications.published, true))
    .orderBy(desc(publications.publishedAt))
    .limit(limit);
}

export async function getPublication(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(tags.publications);
  if (!hasDatabase) return snapshot.publications.find((p) => p.slug === slug) ?? null;
  const [row] = await db
    .select()
    .from(publications)
    .where(and(eq(publications.slug, slug), eq(publications.published, true)))
    .limit(1);
  return row ?? null;
}

export async function getResources() {
  "use cache";
  cacheLife("hours");
  cacheTag(tags.resources);
  if (!hasDatabase) return [...snapshot.resources].sort((a, b) => +b.createdAt - +a.createdAt);
  return db
    .select()
    .from(resources)
    .where(eq(resources.published, true))
    .orderBy(desc(resources.createdAt));
}

/** Published publications among these slugs (for the editorial section pages). */
export async function getPublicationsBySlugs(slugs: string[]) {
  "use cache";
  cacheLife("hours");
  cacheTag(tags.publications);
  if (slugs.length === 0) return [];
  if (!hasDatabase) return snapshot.publications.filter((p) => slugs.includes(p.slug));
  return db
    .select()
    .from(publications)
    .where(and(inArray(publications.slug, slugs), eq(publications.published, true)));
}
