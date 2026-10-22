import type { Metadata } from "next";
import { PublicationCard } from "@/components/content-cards";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getPublications } from "@/lib/content";
import { getDictionary, getLocale } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.sections.publications.title, description: dict.sections.publications.intro };
}

export default async function PublicationsPage() {
  const [dict, locale, list] = await Promise.all([getDictionary(), getLocale(), getPublications()]);

  return (
    <>
      <PageHeader title={dict.sections.publications.title} intro={dict.sections.publications.intro} />
      <div className="shell">
        {list.length === 0 ? (
          <EmptyState title={dict.common.empty} />
        ) : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <PublicationCard key={p.id} publication={p} locale={locale} dict={dict} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
