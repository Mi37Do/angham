import { hasDatabase } from "@/lib/data-source";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { publications } from "@/db/schema";
import { PublishedBadge } from "../../_components/ui/status-badge";
import { AdminHeader, Table, cellClass, formatAdminDate, rowClass } from "../../_components/ui";

export default async function List() {
  // Snapshot preview: the layout shows a notice; nothing here may touch the database.
  if (!hasDatabase) return null;
  const rows = await db.select().from(publications).orderBy(desc(publications.createdAt));
  return (
    <>
      <AdminHeader title="Publications" action={{ href: "/admin/publications/new", label: "Nouvelle publication" }} />
      <Table head={["Titre", "Créée le", "Statut"]} empty={rows.length === 0}>
        {rows.map((row) => (
          <tr key={row.id} className={rowClass}>
            <td className={cellClass}>
              <Link href={`/admin/publications/${row.id}`} className="focus-ring font-medium hover:text-brand-2">
                {row.title.fr}
              </Link>
            </td>
            <td className={`${cellClass} tabular text-muted whitespace-nowrap`}>{formatAdminDate(row.createdAt)}</td>
            <td className={cellClass}>
              <PublishedBadge published={row.published} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
