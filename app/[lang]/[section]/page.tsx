import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicationCard } from "@/components/content-cards";
import { PageHeader } from "@/components/page-header";
import { getPublicationsBySlugs } from "@/lib/content";
import { type EditorialSection, editorialSections } from "@/lib/sections";
import { getDictionary, getLocale } from "../dictionaries";

// Rubriques éditoriales ; les autres ont leur propre dossier (evenements, publications…).
const isEditorial = (value: string): value is EditorialSection => value in editorialSections;

export function generateStaticParams() {
  return Object.keys(editorialSections).map((section) => ({ section }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[section]">): Promise<Metadata> {
  const { section } = await params;
  if (!isEditorial(section)) return {};
  const dict = await getDictionary();
  return { title: dict.sections[section].title, description: dict.sections[section].intro };
}

export default async function SectionPage({ params }: PageProps<"/[lang]/[section]">) {
  const { section } = await params;
  if (!isEditorial(section)) notFound();

  const related = editorialSections[section];
  const [dict, locale, articles] = await Promise.all([
    getDictionary(),
    getLocale(),
    getPublicationsBySlugs([...new Set(related.flat())]),
  ]);
  const content = dict.sections[section];
  const bySlug = new Map(articles.map((a) => [a.slug, a]));

  return (
    <>
      <PageHeader title={content.title} intro={content.intro} />
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
        <nav className="lg:sticky lg:top-24 lg:col-span-3 lg:self-start">
          <ol className="flex flex-col gap-1">
            {content.items.map((item, i) => (
              <li key={item}>
                <a
                  href={`#s${i + 1}`}
                  className="text-content-muted hover:bg-surface-1 hover:text-content-strong block px-3 py-2 font-semibold transition-colors"
                >
                  {item}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex flex-col gap-[clamp(48px,6vw,80px)] lg:col-span-9">
          {content.items.map((item, i) => {
            const text = content.texts[i];
            const links = (related[i] ?? []).flatMap((slug) => bySlug.get(slug) ?? []);
            return (
              <section key={item} id={`s${i + 1}`} data-reveal suppressHydrationWarning className="scroll-mt-24">
                <h2 className="heading">{item}</h2>
                <p className={text ? "mt-4 max-w-[62ch] text-[1.125rem]" : "text-content-muted mt-4"}>
                  {text ?? dict.common.comingSoon}
                </p>
                {links.length > 0 && (
                  <div className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
                    {links.map((article) => (
                      <PublicationCard key={article.slug} publication={article} locale={locale} dict={dict} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
