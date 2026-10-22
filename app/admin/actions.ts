"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  contactMessages,
  eventCategory,
  events,
  publicationCategory,
  publications,
  resources,
  resourceType,
  users,
} from "@/db/schema";
import { createSession, destroySession, requireUser } from "@/lib/auth";
import { tags } from "@/lib/content";
import { hasDatabase } from "@/lib/data-source";
import { verifyPassword } from "@/lib/password";
import { UploadError, saveCover } from "@/lib/uploads";
import { fromAlgiersInput, localized, optionalLocalized, slugify, text } from "./_lib/form";

export type FormState = { error?: string };

// --- Authentification -------------------------------------------------------

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!hasDatabase) return { error: "L’administration n’est pas disponible dans l’aperçu." };
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  // Toujours vérifier un hachage pour ne pas révéler l’existence du compte par le temps de réponse.
  const ok = await verifyPassword(password, user?.passwordHash ?? "scrypt$00$00");
  if (!user || !ok) return { error: "Identifiants incorrects." };
  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// --- Image d’illustration (événements et publications) ----------------------

/**
 * The cover fields of a form: a new file replaces the image, the "remove" box
 * clears it, and otherwise the current image is left as it is.
 */
async function coverFields(
  formData: FormData,
): Promise<{ coverImage?: string | null; coverCredit: string | null } | { error: string }> {
  const coverCredit = text(formData, "coverCredit") || null;
  const file = formData.get("cover");
  if (file instanceof File && file.size > 0) {
    try {
      return { coverImage: await saveCover(file), coverCredit };
    } catch (error) {
      if (error instanceof UploadError) return { error: error.message };
      throw error;
    }
  }
  if (formData.get("removeCover") === "on") return { coverImage: null, coverCredit: null };
  return { coverCredit };
}

// --- Événements -------------------------------------------------------------

const pick = <T extends string>(values: readonly T[], v: string, fallback: T) =>
  (values as readonly string[]).includes(v) ? (v as T) : fallback;

export async function saveEvent(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const title = localized(formData, "title");
  const startsAt = fromAlgiersInput(text(formData, "startsAt"));
  if (!title.fr) return { error: "Le titre en français est obligatoire." };
  if (!startsAt) return { error: "La date de début est obligatoire." };
  const cover = await coverFields(formData);
  if ("error" in cover) return cover;

  const values = {
    title,
    slug: slugify(text(formData, "slug") || title.fr),
    summary: localized(formData, "summary"),
    body: optionalLocalized(formData, "body"),
    category: pick(eventCategory.enumValues, text(formData, "category"), "autre"),
    startsAt,
    endsAt: fromAlgiersInput(text(formData, "endsAt")),
    location: text(formData, "location") || null,
    ...cover,
    published: formData.get("published") === "on",
  };
  const error = await save(() =>
    id ? db.update(events).set(values).where(eq(events.id, id)) : db.insert(events).values(values),
  );
  if (error) return { error };
  updateTag(tags.events);
  redirect("/admin/evenements");
}

export async function deleteEvent(id: string) {
  await requireUser();
  await db.delete(events).where(eq(events.id, id));
  updateTag(tags.events);
  redirect("/admin/evenements");
}

// --- Publications -----------------------------------------------------------

export async function savePublication(
  id: string | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();
  const title = localized(formData, "title");
  if (!title.fr) return { error: "Le titre en français est obligatoire." };
  const published = formData.get("published") === "on";
  const cover = await coverFields(formData);
  if ("error" in cover) return cover;

  const values = {
    title,
    slug: slugify(text(formData, "slug") || title.fr),
    summary: localized(formData, "summary"),
    body: optionalLocalized(formData, "body"),
    category: pick(publicationCategory.enumValues, text(formData, "category"), "actualite"),
    author: text(formData, "author") || null,
    ...cover,
    publishedAt: fromAlgiersInput(text(formData, "publishedAt")) ?? (published ? new Date() : null),
    published,
  };
  const error = await save(() =>
    id
      ? db.update(publications).set(values).where(eq(publications.id, id))
      : db.insert(publications).values(values),
  );
  if (error) return { error };
  updateTag(tags.publications);
  redirect("/admin/publications");
}

export async function deletePublication(id: string) {
  await requireUser();
  await db.delete(publications).where(eq(publications.id, id));
  updateTag(tags.publications);
  redirect("/admin/publications");
}

// --- Ressources (bibliothèque) ----------------------------------------------

export async function saveResource(id: string | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const title = localized(formData, "title");
  if (!title.fr) return { error: "Le titre en français est obligatoire." };
  const year = Number.parseInt(text(formData, "year"), 10);
  const url = text(formData, "url");
  if (url && !/^https?:\/\//i.test(url)) return { error: "Le lien doit commencer par http:// ou https://." };

  const values = {
    title,
    description: optionalLocalized(formData, "description"),
    type: pick(resourceType.enumValues, text(formData, "type"), "livre"),
    author: text(formData, "author") || null,
    year: Number.isFinite(year) ? year : null,
    url: url || null,
    rights: text(formData, "rights") || null,
    published: formData.get("published") === "on",
  };
  const error = await save(() =>
    id ? db.update(resources).set(values).where(eq(resources.id, id)) : db.insert(resources).values(values),
  );
  if (error) return { error };
  updateTag(tags.resources);
  redirect("/admin/ressources");
}

export async function deleteResource(id: string) {
  await requireUser();
  await db.delete(resources).where(eq(resources.id, id));
  updateTag(tags.resources);
  redirect("/admin/ressources");
}

// --- Messages de contact ----------------------------------------------------

export async function setMessageRead(id: string, read: boolean) {
  await requireUser();
  await db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id));
  redirect("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireUser();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  redirect("/admin/messages");
}

// ---------------------------------------------------------------------------

async function save(run: () => Promise<unknown>): Promise<string | undefined> {
  try {
    await run();
  } catch (error) {
    // 23505 : violation d’unicité (slug déjà utilisé).
    const code = (error as { cause?: { code?: string } }).cause?.code;
    if (code === "23505") return "Cet identifiant d’URL (slug) est déjà utilisé.";
    console.error(error);
    return "Enregistrement impossible. Veuillez réessayer.";
  }
}
