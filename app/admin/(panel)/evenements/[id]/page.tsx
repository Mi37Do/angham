import { hasDatabase } from "@/lib/data-source";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { events } from "@/db/schema";
import { deleteEvent } from "../../../actions";
import { EventForm } from "../../../_components/forms";
import { isUuid } from "../../../_components/ui";
import { ConfirmModal } from "../../../_components/ui/confirm-modal";
import { DetailsHeader } from "../../../_components/ui/details-header";
import { PublishedBadge } from "../../../_components/ui/status-badge";

export default async function Edit({ params }: PageProps<"/admin/evenements/[id]">) {
  // Snapshot preview: the layout shows a notice; nothing here may touch the database.
  if (!hasDatabase) return null;
  const { id } = await params;
  if (id === "new") {
    return (
      <>
        <DetailsHeader title="Nouvel événement" backHref="/admin/evenements" />
        <EventForm event={null} />
      </>
    );
  }
  if (!isUuid(id)) notFound();
  const [row] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  if (!row) notFound();

  return (
    <>
      <DetailsHeader
        title={row.title.fr}
        subtitle="Événements"
        backHref="/admin/evenements"
        actions={
          <>
            <PublishedBadge published={row.published} />
            <ConfirmModal action={deleteEvent.bind(null, row.id)} subject={row.title.fr} />
          </>
        }
      />
      <EventForm event={row} />
    </>
  );
}
