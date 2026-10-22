import { Plus } from "lucide-react";
import Link from "next/link";
import { Empty } from "./ui/empty";

/* Page title row: taouzie-ui pixa-title, with the page's one primary action. */
export function AdminHeader({ title, action }: { title: string; action?: { href: string; label: string } }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <h1 className="pixa-title-xl">{title}</h1>
      {action && (
        <Link href={action.href} className="btn btn-primary">
          <Plus className="size-4" aria-hidden />
          {action.label}
        </Link>
      )}
    </div>
  );
}

/*
 * A lean take on taouzie-ui dataTable: a card, an uppercase header, rows
 * divided by one hairline each and tinted under the pointer.
 */
export function Table({ head, children, empty }: { head: string[]; children: React.ReactNode; empty: boolean }) {
  if (empty)
    return (
      <div className="card">
        <Empty />
      </div>
    );
  return (
    <div className="card styled-scrollbar overflow-x-auto">
      <table className="w-full text-start">
        <thead className="border-edge border-b">
          <tr>
            {head.map((h) => (
              <th key={h} className="label px-4 py-3 text-start font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-edge divide-y">{children}</tbody>
      </table>
    </div>
  );
}

export const rowClass = "hover:bg-row-hover transition-colors";
export const cellClass = "px-4 py-3";

export const isUuid = (v: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export const formatAdminDate = (d: Date | null) =>
  d
    ? new Intl.DateTimeFormat("fr-DZ", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Algiers" }).format(d)
    : "—";
