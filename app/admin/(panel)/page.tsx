import { hasDatabase } from "@/lib/data-source";
import { ArrowRight, CalendarDays, Library, Mail, Newspaper } from "lucide-react";
import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages, events, publications, resources } from "@/db/schema";
import { AdminHeader } from "../_components/ui";

export default async function Dashboard() {
  // Snapshot preview: the layout shows a notice; nothing here may touch the database.
  if (!hasDatabase) return null;
  const [[e], [p], [r], [m]] = await Promise.all([
    db.select({ n: count() }).from(events),
    db.select({ n: count() }).from(publications),
    db.select({ n: count() }).from(resources),
    db.select({ n: count() }).from(contactMessages).where(eq(contactMessages.read, false)),
  ]);
  const tiles = [
    { href: "/admin/evenements", label: "Événements", n: e.n, icon: CalendarDays },
    { href: "/admin/publications", label: "Publications", n: p.n, icon: Newspaper },
    { href: "/admin/ressources", label: "Ressources de la bibliothèque", n: r.n, icon: Library },
    { href: "/admin/messages", label: "Messages non lus", n: m.n, icon: Mail },
  ];

  return (
    <>
      <AdminHeader title="Tableau de bord" />
      <h2 className="section-head">Contenus</h2>
      {/* taouzie-ui stat tiles: .metric figures, .interactive lift on hover */}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map(({ href, label, n, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="card interactive focus-ring group flex flex-col gap-4 p-4">
              <span className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--primary-90)]">
                  <Icon className="text-brand-2 size-5" aria-hidden />
                </span>
                <ArrowRight className="text-muted size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" aria-hidden />
              </span>
              <span className="metric">{n}</span>
              <span className="label">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
