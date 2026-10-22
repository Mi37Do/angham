import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EventRow, PublicationCard } from "@/components/content-cards";
import { EmptyState } from "@/components/empty-state";
import { Eyebrow, Figure, Star8, StarRule } from "@/components/ornament";
import { getPublications, getUpcomingEvents } from "@/lib/content";
import { creditLine, type MediaKey, media } from "@/lib/media";
import { getDictionary, getLocale } from "./dictionaries";

const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

// The four doors of the heritage, each with its picture.
const doors: { slug: "patrimoine" | "bibliotheque" | "recherche" | "evenements"; image: MediaKey }[] = [
  { slug: "patrimoine", image: "grande-mosquee-cour-1886" },
  { slug: "bibliotheque", image: "bensari-groupe" },
  { slug: "recherche", image: "alhambra-lions" },
  { slug: "evenements", image: "alhambra-plafond" },
];

export default async function Home() {
  const [dict, locale, upcoming, latest] = await Promise.all([
    getDictionary(),
    getLocale(),
    getUpcomingEvents(3),
    getPublications(3),
  ]);
  const { home } = dict;
  const [lead, ...others] = latest;

  return (
    <>
      {/* ── Hero: the calligraphic name beside an Algerian Andalusian orchestra ── */}
      <section aria-labelledby="hero-title" className="shell pt-[clamp(32px,5vw,72px)]">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col items-start gap-6 lg:col-span-7">
            <Image
              src="/brand/sba_title.svg"
              alt={dict.site.name}
              width={480}
              height={157}
              priority
              data-rise
              style={rise(0)}
              className="w-[min(100%,440px)]"
            />
            <Eyebrow>{dict.site.tagline}</Eyebrow>
            <h1 id="hero-title" data-rise style={rise(1)} className="display max-w-[18ch]">
              {home.heroTitle}
            </h1>
            <p data-rise style={rise(2)} className="text-content-muted max-w-[52ch] text-[1.125rem] leading-relaxed">
              {home.heroText}
            </p>
            <div data-rise style={rise(3)} className="flex flex-wrap gap-3 pt-2">
              <Link href={`/${locale}/patrimoine`} className="btn btn-primary btn-xl">
                {home.ctaPrimary}
                <ArrowRight size={18} className="rtl:rotate-180" aria-hidden />
              </Link>
              <Link href={`/${locale}/bibliotheque`} className="btn btn-outline btn-xl">
                {home.ctaSecondary}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="mx-auto w-full max-w-[560px]">
              <Figure
                src={media("ensemble-caire-1932").file}
                alt={dict.home.heroImageAlt}
                ratio="aspect-[4/3]"
                priority
                sizes="(min-width: 1024px) 560px, 90vw"
                credit={creditLine("ensemble-caire-1932")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── What guides us ── */}
      <section className="shell pt-[clamp(80px,10vw,136px)]">
        <StarRule className="mx-auto max-w-md" />
        <h2 data-reveal suppressHydrationWarning className="heading mt-8 text-center">
          {home.pillars}
        </h2>
        <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-10">
          {home.about.map((block, i) => (
            <div key={block.title} data-reveal suppressHydrationWarning style={rise(i)} className="flex flex-col items-center gap-4 text-center">
              <Star8 className="text-gold size-7" />
              <h3 className="title-xl text-primary">{block.title}</h3>
              <p className="text-content-muted max-w-[34ch] leading-relaxed">{block.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured reading ── */}
      <section className="shell pt-[clamp(80px,10vw,136px)]">
        <SectionHead eyebrow={home.featured} title={home.latest} href={`/${locale}/publications`} more={dict.common.readMore} />
        {latest.length === 0 ? (
          <EmptyState title={dict.common.empty} />
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <PublicationCard publication={lead} locale={locale} dict={dict} size="lg" />
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5">
              {others.map((p) => (
                <PublicationCard key={p.id} publication={p} locale={locale} dict={dict} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Events ── */}
      <section className="shell pt-[clamp(80px,10vw,136px)]">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="flex flex-col items-start gap-4 lg:col-span-4">
            <Eyebrow>{dict.nav.evenements}</Eyebrow>
            <h2 data-reveal suppressHydrationWarning className="heading">
              {home.upcoming}
            </h2>
            <p className="text-content-muted leading-relaxed">{dict.sections.evenements.intro}</p>
            <Link href={`/${locale}/evenements`} className="text-primary flex items-center gap-2 font-semibold">
              {dict.common.readMore}
              <ArrowRight size={16} className="rtl:rotate-180" aria-hidden />
            </Link>
          </div>
          <div className="lg:col-span-8">
            {upcoming.length === 0 ? (
              <div className="bg-surface-1 h-full">
                <EmptyState title={dict.common.empty} />
              </div>
            ) : (
              <div className="divide-hairline flex flex-col divide-y">
                {upcoming.map((event) => (
                  <EventRow key={event.id} event={event} locale={locale} dict={dict} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── The four doors of the heritage ── */}
      <section className="shell pt-[clamp(80px,10vw,136px)]">
        <SectionHead eyebrow={home.explore} title={home.quickAccess} />
        <ul className="mt-10 grid grid-cols-2 gap-5 md:gap-8 lg:grid-cols-4">
          {doors.map(({ slug, image }) => (
            <li key={slug}>
              <Link href={`/${locale}/${slug}`} className="group flex flex-col gap-4">
                <div className="bg-surface-sunken relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={media(image).file}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 300px, 50vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
                  />
                </div>
                <span className="title group-hover:text-primary text-center transition-colors">{dict.nav[slug]}</span>
                <span className="text-content-muted hidden text-center text-sm leading-relaxed sm:block">
                  {dict.sections[slug].intro}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── A word from the Secretary General ── */}
      <section aria-labelledby="secretary-title" className="shell pt-[clamp(80px,10vw,136px)]">
        <div className="bg-surface-1 relative isolate overflow-hidden px-6 py-12 md:px-14 md:py-16">
          <div className="bg-mosaic absolute inset-0 -z-10 opacity-[0.05]" aria-hidden />
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="bg-field-inverse relative isolate mx-auto flex aspect-[3/4] max-w-[300px] items-center justify-center overflow-hidden">
                <div className="bg-mosaic absolute inset-0 -z-10 opacity-15 invert" aria-hidden />
                <Image src="/brand/aaa_logo_white.svg" alt="" width={170} height={223} className="w-[56%]" />
              </div>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-8">
              <Eyebrow>{dict.site.name}</Eyebrow>
              <h2 id="secretary-title" className="heading">
                {home.secretary.title}
              </h2>
              <blockquote className="flex flex-col gap-5 text-[1.125rem] leading-[1.75]">
                {home.secretary.paragraphs.map((p, i) => (
                  <p key={i} className="max-w-[68ch]">
                    {i === 0 && <span className="text-gold me-1 text-3xl leading-none font-bold" aria-hidden>«</span>}
                    {p}
                    {i === home.secretary.paragraphs.length - 1 && (
                      <span className="text-gold ms-1 text-3xl leading-none font-bold" aria-hidden>»</span>
                    )}
                  </p>
                ))}
              </blockquote>
              <div className="flex items-center gap-4 pt-2">
                <span className="bg-gold h-px w-10" aria-hidden />
                <div>
                  <p className="title-2 text-primary">{home.secretary.name}</p>
                  <p className="text-gold-strong text-sm font-semibold">{home.secretary.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({ eyebrow, title, href, more }: { eyebrow: string; title: string; href?: string; more?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 data-reveal suppressHydrationWarning className="heading">
          {title}
        </h2>
      </div>
      {href && more && (
        <Link href={href} className="text-primary flex shrink-0 items-center gap-2 font-semibold">
          {more}
          <ArrowRight size={16} className="rtl:rotate-180" aria-hidden />
        </Link>
      )}
    </div>
  );
}
