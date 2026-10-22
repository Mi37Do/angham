import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { hasDatabase } from "@/lib/data-source";
import { getDictionary, getLocale } from "../dictionaries";
import { ContactForm } from "./contact-form";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.sections.contact.title, description: dict.sections.contact.intro };
}

export default async function ContactPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const content = dict.sections.contact;

  return (
    <>
      <PageHeader title={content.title} intro={content.intro} />
      <div className="shell grid gap-[var(--gutter)] lg:grid-cols-12">
        <div className="lg:col-span-8">
          {hasDatabase ? (
            <ContactForm locale={locale} labels={dict.contact} />
          ) : (
            // Snapshot preview: nowhere to store a message, so say so instead of failing.
            <p className="card bg-gold-soft title-sm p-6 md:p-8">{dict.contact.preview}</p>
          )}
        </div>
        <aside className="flex flex-col gap-[var(--gutter)] lg:col-span-4">
          {content.items.map((item) => (
            <div key={item} className="card p-5">
              <h2 className="title-sm">{item}</h2>
              <p className="text-content-muted mt-1">{dict.common.comingSoon}</p>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
