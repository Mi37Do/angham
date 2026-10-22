import { hasDatabase } from "@/lib/data-source";
import { Mail, MailOpen, Reply } from "lucide-react";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import fr from "@/app/[lang]/dictionaries/fr.json";
import { deleteMessage, setMessageRead } from "../../actions";
import { AdminHeader, formatAdminDate } from "../../_components/ui";
import { ConfirmModal } from "../../_components/ui/confirm-modal";
import { DetailField } from "../../_components/ui/detail-field";
import { Empty } from "../../_components/ui/empty";
import { StatusBadge } from "../../_components/ui/status-badge";

export default async function Messages() {
  // Snapshot preview: the layout shows a notice; nothing here may touch the database.
  if (!hasDatabase) return null;
  const rows = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));

  return (
    <>
      <AdminHeader title="Messages de contact" />
      {rows.length === 0 && (
        <div className="card">
          <Empty label="Aucun message pour le moment" />
        </div>
      )}
      <ul className="flex flex-col gap-3">
        {rows.map((m) => (
          <li key={m.id} className={`card flex flex-col gap-3 p-4 ${m.read ? "opacity-80" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="pixa-title-sm truncate normal-case">{m.name}</p>
                <a href={`mailto:${m.email}`} className="text-muted text-[0.8rem] hover:underline">
                  {m.email}
                </a>
              </div>
              {m.read ? (
                <StatusBadge label="Lu" tone="var(--neutral-color)" />
              ) : (
                <StatusBadge label="Nouveau" tone="var(--info-color)" />
              )}
            </div>
            <dl className="flex flex-wrap gap-x-6 gap-y-2">
              <DetailField label="Objet">{fr.contact.subjects[m.subject]}</DetailField>
              <DetailField label="Reçu le">
                <span className="tabular">{formatAdminDate(m.createdAt)}</span>
              </DetailField>
              <DetailField label="Langue">{m.locale.toUpperCase()}</DetailField>
            </dl>
            <p className="whitespace-pre-line" dir="auto">
              {m.message}
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + fr.contact.subjects[m.subject])}`}
                className="btn btn-primary"
              >
                <Reply className="size-4" aria-hidden />
                Répondre
              </a>
              <form action={setMessageRead.bind(null, m.id, !m.read)}>
                <button className="btn btn-nofloat">
                  {m.read ? <Mail className="size-4" aria-hidden /> : <MailOpen className="size-4" aria-hidden />}
                  {m.read ? "Marquer non lu" : "Marquer comme lu"}
                </button>
              </form>
              <ConfirmModal action={deleteMessage.bind(null, m.id)} subject={`${m.name} — ${m.email}`} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
