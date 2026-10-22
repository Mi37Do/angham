"use server";

import { db } from "@/db";
import { contactMessages, contactSubject } from "@/db/schema";
import { hasDatabase } from "@/lib/data-source";
import { hasLocale } from "@/lib/i18n";

type Subject = (typeof contactSubject.enumValues)[number];
type FieldError = "required" | "email" | "tooLong";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      fields: Partial<Record<"name" | "email" | "subject" | "message", FieldError>>;
      generic?: boolean;
      // Valeurs saisies, renvoyées pour que le formulaire ne soit pas vidé en cas d’erreur.
      values: { name: string; email: string; subject: string; message: string };
    };

const isSubject = (v: string): v is Subject => (contactSubject.enumValues as readonly string[]).includes(v);

export async function submitContact(
  locale: string,
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (!hasDatabase) return { status: "error", fields: {}, generic: true, values: { name: "", email: "", subject: "", message: "" } };
  // Champ piège invisible : les robots le remplissent, les humains non.
  if (formData.get("website")) return { status: "success" };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  const values = { name, email, subject, message };
  const fields: Extract<ContactState, { status: "error" }>["fields"] = {};
  if (!name) fields.name = "required";
  else if (name.length > 120) fields.name = "tooLong";
  if (!email) fields.email = "required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) fields.email = "email";
  if (!isSubject(subject)) fields.subject = "required";
  if (!message) fields.message = "required";
  else if (message.length > 5000) fields.message = "tooLong";
  if (Object.keys(fields).length > 0 || !isSubject(subject)) return { status: "error", fields, values };

  try {
    await db.insert(contactMessages).values({
      name,
      email,
      subject,
      message,
      locale: hasLocale(locale) ? locale : "fr",
    });
  } catch (error) {
    console.error("contact form insert failed", error);
    return { status: "error", fields: {}, generic: true, values };
  }
  return { status: "success" };
}
