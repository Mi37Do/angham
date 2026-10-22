import { Suspense } from "react";
import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { hasDatabase } from "@/lib/data-source";
import { PreviewNotice } from "../_components/preview-notice";
import { AdminShell } from "../_components/shell";

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  if (!hasDatabase) return <PreviewNotice />;
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><span className="loader" /></div>}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}

// Toutes les pages de l’administration passent par cette vérification de session.
async function Gate({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const [{ unread }] = await db
    .select({ unread: count() })
    .from(contactMessages)
    .where(eq(contactMessages.read, false));

  return (
    <AdminShell email={user.email} unread={unread}>
      {children}
    </AdminShell>
  );
}
