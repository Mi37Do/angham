import { hasDatabase } from "@/lib/data-source";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { resources } from "@/db/schema";
import { deleteResource } from "../../../actions";
import { ResourceForm } from "../../../_components/forms";
import { isUuid } from "../../../_components/ui";
import { ConfirmModal } from "../../../_components/ui/confirm-modal";
import { DetailsHeader } from "../../../_components/ui/details-header";
import { PublishedBadge } from "../../../_components/ui/status-badge";

export default async function Edit({ params }: PageProps<"/admin/ressources/[id]">) {
  // Snapshot preview: the layout shows a notice; nothing here may touch the database.
  if (!hasDatabase) return null;
  const { id } = await params;
  if (id === "new") {
    return (
      <>
        <DetailsHeader title="Nouvelle ressource" backHref="/admin/ressources" />
        <ResourceForm resource={null} />
      </>
    );
  }
  if (!isUuid(id)) notFound();
  const [row] = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
  if (!row) notFound();

  return (
    <>
      <DetailsHeader
        title={row.title.fr}
        subtitle="Bibliothèque et archives"
        backHref="/admin/ressources"
        actions={
          <>
            <PublishedBadge published={row.published} />
            <ConfirmModal action={deleteResource.bind(null, row.id)} subject={row.title.fr} />
          </>
        }
      />
      <ResourceForm resource={row} />
    </>
  );
}
