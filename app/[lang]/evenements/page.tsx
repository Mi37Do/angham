import type { Metadata } from "next";
import { EventRow } from "@/components/content-cards";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getPastEvents, getUpcomingEvents } from "@/lib/content";
import { getDictionary, getLocale } from "../dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.sections.evenements.title, description: dict.sections.evenements.intro };
}

export default async function EventsPage() {
  const [dict, locale, upcoming, past] = await Promise.all([
    getDictionary(),
    getLocale(),
    getUpcomingEvents(),
    getPastEvents(),
  ]);

  return (
    <>
      <PageHeader title={dict.sections.evenements.title} intro={dict.sections.evenements.intro} />
      <div className="shell flex flex-col gap-[clamp(64px,8vw,112px)]">
        {[
          { title: dict.events.upcoming, list: upcoming },
          { title: dict.events.past, list: past },
        ].map((group) => (
          <section key={group.title}>
            <h2 data-reveal suppressHydrationWarning className="heading">
              {group.title}
            </h2>
            {group.list.length === 0 ? (
              <EmptyState title={dict.common.empty} />
            ) : (
              <div className="divide-hairline mt-4 flex flex-col divide-y">
                {group.list.map((event) => (
                  <EventRow key={event.id} event={event} locale={locale} dict={dict} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
