import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BackLink, RichText } from "@/components/content-cards";
import { Figure } from "@/components/ornament";
import { PageHeader } from "@/components/page-header";
import { DetailsSkeleton } from "@/components/skeletons";
import { getEvent } from "@/lib/content";
import { formatDate, t } from "@/lib/localize";
import { getDictionary, getLocale } from "../../dictionaries";

// Les paramètres sont lus dans <Suspense> : les nouveaux événements s’affichent sans reconstruire.
export default function EventPage({ params }: PageProps<"/[lang]/evenements/[slug]">) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <EventDetails params={params} />
    </Suspense>
  );
}

async function EventDetails({ params }: Pick<PageProps<"/[lang]/evenements/[slug]">, "params">) {
  const { slug } = await params;
  const [dict, locale, event] = await Promise.all([getDictionary(), getLocale(), getEvent(slug)]);
  if (!event) notFound();

  return (
    <>
      <PageHeader
        eyebrow={dict.events.categories[event.category]}
        title={t(event.title, locale)}
        intro={t(event.summary, locale)}
      />
      <article className="shell">
        {event.coverImage && (
          <Figure
            src={event.coverImage}
            alt=""
            credit={event.coverCredit}
            priority
            className="mx-auto mb-12 max-w-4xl"
            sizes="(min-width: 1024px) 896px, 100vw"
          />
        )}
        <dl className="mx-auto mb-10 flex max-w-[68ch] flex-wrap gap-4">
          <div className="card px-5 py-4">
            <dt className="label">{dict.events.categories[event.category]}</dt>
            <dd className="title-sm mt-1">{formatDate(event.startsAt, locale, true)}</dd>
          </div>
          {event.location && (
            <div className="card px-5 py-4">
              <dt className="label">{dict.events.location}</dt>
              <dd className="title-sm mt-1">{event.location}</dd>
            </div>
          )}
        </dl>
        <RichText text={t(event.body, locale)} />
        <BackLink href={`/${locale}/evenements`} label={dict.common.back} />
      </article>
    </>
  );
}
