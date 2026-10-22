import { hasDatabase } from "@/lib/data-source";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { deletePublication } from "../../../actions";
import { PublicationForm } from "../../../_components/forms";
import { isUuid } from "../../../_components/ui";
import { ConfirmModal } from "../../../_components/ui/confirm-modal";
import { DetailsHeader } from "../../../_components/ui/details-header";
import { PublishedBadge } from "../../../_components/ui/status-badge";

export default async function Edit({ params }: PageProps<"/admin/publications/[id]">) {
  // Snapshot preview: the layout shows a notice; nothing here may touch the database.
  if (!hasDatabase) return null;
  const { id } = await params;
  if (id === "new") {
    return (
      <>
        <DetailsHeader title="Nouvelle publication" backHref="/admin/publications" />
        <PublicationForm publication={null} />
      </>
    );
  }
  if (!isUuid(id)) notFound();
  const [row] = await db.select().from(publications).where(eq(publications.id, id)).limit(1);
  if (!row) notFound();

  return (
    <>
      <DetailsHeader
        title={row.title.fr}
        subtitle="Publications"
        backHref="/admin/publications"
        actions={
          <>
            <PublishedBadge published={row.published} />
            <ConfirmModal action={deletePublication.bind(null, row.id)} subject={row.title.fr} />
          </>
        }
      />
      <PublicationForm publication={row} />
    </>
  );
}
