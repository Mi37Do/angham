import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BackLink, RichText } from "@/components/content-cards";
import { Figure } from "@/components/ornament";
import { PageHeader } from "@/components/page-header";
import { DetailsSkeleton } from "@/components/skeletons";
import { getPublication } from "@/lib/content";
import { formatDate, t } from "@/lib/localize";
import { getDictionary, getLocale } from "../../dictionaries";

export default function PublicationPage({ params }: PageProps<"/[lang]/publications/[slug]">) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <PublicationDetails params={params} />
    </Suspense>
  );
}

async function PublicationDetails({
  params,
}: Pick<PageProps<"/[lang]/publications/[slug]">, "params">) {
  const { slug } = await params;
  const [dict, locale, pub] = await Promise.all([getDictionary(), getLocale(), getPublication(slug)]);
  if (!pub) notFound();

  return (
    <>
      <PageHeader
        eyebrow={dict.publications.categories[pub.category]}
        title={t(pub.title, locale)}
        intro={t(pub.summary, locale)}
      />
      <article className="shell">
        {pub.coverImage && (
          <Figure
            src={pub.coverImage}
            alt=""
            credit={pub.coverCredit}
            priority
            className="mx-auto mb-12 max-w-4xl"
            sizes="(min-width: 1024px) 896px, 100vw"
          />
        )}
        {/* One 68ch column, measured at the body size, holds the byline and the text. */}
        <div className="mx-auto max-w-[68ch] text-[1.125rem]">
          <p className="type-meta text-gold-strong mb-8 font-semibold">
            {pub.author && `${dict.publications.by} ${pub.author}`}
            {pub.author && pub.publishedAt && " · "}
            {pub.publishedAt && formatDate(pub.publishedAt, locale)}
          </p>
          <RichText text={t(pub.body, locale)} />
        </div>
        <BackLink href={`/${locale}/publications`} label={dict.common.back} />
      </article>
    </>
  );
}
