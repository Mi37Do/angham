import "server-only";
import type { events, publications, resources } from "@/db/schema";
import raw from "@/content/snapshot.json";

// content/snapshot.json, with its ISO dates turned back into Dates so the rows
// have exactly the shape the database returns.
type Event = typeof events.$inferSelect;
type Publication = typeof publications.$inferSelect;
type Resource = typeof resources.$inferSelect;

// As written by scripts/export-content.mts: the same rows, with Dates as strings.
type Serialized<T> = { [K in keyof T]: T[K] extends Date ? string : T[K] extends Date | null ? string | null : T[K] };
const data = raw as unknown as {
  events: Serialized<Event>[];
  publications: Serialized<Publication>[];
  resources: Serialized<Resource>[];
};

const date = (v: string | null) => (v ? new Date(v) : null);

export const snapshot = {
  events: data.events.map(
    (e) =>
      ({
        ...e,
        startsAt: new Date(e.startsAt),
        endsAt: date(e.endsAt),
        createdAt: new Date(e.createdAt),
        updatedAt: new Date(e.updatedAt),
      }) as Event,
  ),
  publications: data.publications.map(
    (p) =>
      ({
        ...p,
        publishedAt: date(p.publishedAt),
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }) as Publication,
  ),
  resources: data.resources.map(
    (r) => ({ ...r, createdAt: new Date(r.createdAt), updatedAt: new Date(r.updatedAt) }) as Resource,
  ),
};
