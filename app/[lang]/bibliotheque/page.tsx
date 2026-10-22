import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { getResources } from "@/lib/content";
import { t } from "@/lib/localize";
import { getDictionary, getLocale } from "../dictionaries";
import { LibraryBrowser } from "./library-browser";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.sections.bibliotheque.title, description: dict.sections.bibliotheque.intro };
}

export default async function LibraryPage() {
  const [dict, locale, rows] = await Promise.all([getDictionary(), getLocale(), getResources()]);
  // Le texte est résolu côté serveur : le client ne reçoit que la langue affichée.
  const items = rows.map((r) => ({
    id: r.id,
    type: r.type,
    title: t(r.title, locale),
    description: t(r.description, locale),
    author: r.author,
    year: r.year,
    url: r.url,
    rights: r.rights,
  }));

  return (
    <>
      <PageHeader title={dict.sections.bibliotheque.title} intro={dict.sections.bibliotheque.intro} />
      <div className="shell">
        <LibraryBrowser items={items} labels={{ ...dict.library, all: dict.common.all, empty: dict.common.empty }} />
      </div>
    </>
  );
}
