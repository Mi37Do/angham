import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/** Texte traduit : le français est obligatoire, l’arabe et l’anglais facultatifs. */
export type Localized = { fr: string; ar?: string; en?: string; es?: string };

const id = () => uuid("id").primaryKey().defaultRandom();
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  ...timestamps,
});

export const sessions = pgTable("sessions", {
  // SHA-256 du jeton stocké dans le cookie : une fuite de la table ne donne pas accès.
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const eventCategory = pgEnum("event_category", [
  "conference",
  "soiree",
  "celebration",
  "echange",
  "autre",
]);

export const events = pgTable(
  "events",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    title: jsonb("title").$type<Localized>().notNull(),
    summary: jsonb("summary").$type<Localized>().notNull(),
    body: jsonb("body").$type<Localized>(),
    category: eventCategory("category").notNull().default("autre"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    location: text("location"),
    /** Image d’illustration (/media/… ou /uploads/…) et sa légende de crédit. */
    coverImage: text("cover_image"),
    coverCredit: text("cover_credit"),
    published: boolean("published").notNull().default(false),
    ...timestamps,
  },
  (t) => [index("events_starts_at_idx").on(t.startsAt)],
);

export const publicationCategory = pgEnum("publication_category", [
  "article",
  "actualite",
  "entretien",
  "compte-rendu",
  "communique",
  "contribution",
]);

export const publications = pgTable(
  "publications",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    title: jsonb("title").$type<Localized>().notNull(),
    summary: jsonb("summary").$type<Localized>().notNull(),
    body: jsonb("body").$type<Localized>(),
    category: publicationCategory("category").notNull().default("actualite"),
    author: text("author"),
    /** Image d’illustration (/media/… ou /uploads/…) et sa légende de crédit. */
    coverImage: text("cover_image"),
    coverCredit: text("cover_credit"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    published: boolean("published").notNull().default(false),
    ...timestamps,
  },
  (t) => [index("publications_published_at_idx").on(t.publishedAt)],
);

export const resourceType = pgEnum("resource_type", [
  "livre",
  "article",
  "manuscrit",
  "audio",
  "video",
  "photo",
  "partition",
]);

export const resources = pgTable(
  "resources",
  {
    id: id(),
    title: jsonb("title").$type<Localized>().notNull(),
    description: jsonb("description").$type<Localized>(),
    type: resourceType("type").notNull(),
    author: text("author"),
    year: integer("year"),
    url: text("url"),
    // Droits de diffusion : seules les ressources autorisées sont affichées publiquement.
    rights: text("rights"),
    published: boolean("published").notNull().default(false),
    ...timestamps,
  },
  (t) => [index("resources_type_idx").on(t.type)],
);

export const contactSubject = pgEnum("contact_subject", [
  "general",
  "contribution",
  "partenariat",
  "adhesion",
]);

export const contactMessages = pgTable("contact_messages", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: contactSubject("subject").notNull(),
  message: text("message").notNull(),
  locale: text("locale").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
