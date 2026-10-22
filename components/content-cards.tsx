import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import type { events, publications } from '@/db/schema'
import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/cn'
import { formatDate, t } from '@/lib/localize'
import { Star8 } from './ornament'

type Event = typeof events.$inferSelect
type Publication = typeof publications.$inferSelect

const arrow =
  'flex-none transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1'

/** The picture behind a card, or the zellige when there is none yet. */
function Cover({ src, className, sizes }: { src: string | null; className?: string; sizes: string }) {
  return (
    <div className={cn('bg-surface-sunken relative overflow-hidden', className)}>
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
        />
      ) : (
        <div className="bg-mosaic bg-gold-soft absolute inset-0 opacity-60" aria-hidden />
      )}
    </div>
  )
}

/* One event per line: the date in a gold block, then the picture when there is one. */
export function EventRow({ event, locale, dict }: { event: Event; locale: Locale; dict: Dictionary }) {
  const day = (opts: Intl.DateTimeFormatOptions) =>
    event.startsAt.toLocaleDateString(locale === 'ar' ? 'ar-DZ' : locale, {
      ...opts,
      timeZone: 'Africa/Algiers',
    })
  return (
    <Link
      href={`/${locale}/evenements/${event.slug}`}
      className="group hover:bg-surface-1 -mx-4 flex items-center gap-5 px-4 py-5 transition-colors duration-200"
    >
      <time
        dateTime={event.startsAt.toISOString()}
        className="bg-gold-soft text-gold-strong flex h-[4.5rem] w-16 flex-none flex-col items-center justify-center"
      >
        <span className="text-2xl leading-none font-bold tabular-nums">{day({ day: '2-digit' })}</span>
        <span className="type-caption mt-1 uppercase">{day({ month: 'short' })}</span>
      </time>
      {event.coverImage && (
        <Cover src={event.coverImage} sizes="96px" className="hidden h-20 w-16 flex-none sm:block" />
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="type-meta text-gold-strong font-semibold">
          {dict.events.categories[event.category]}
          {event.location && ` · ${event.location}`}
        </span>
        <span className="title auto-dir text-content-strong truncate">{t(event.title, locale)}</span>
        <span className="auto-dir text-content-muted line-clamp-1">{t(event.summary, locale)}</span>
      </span>
      <ArrowRight size={20} className={cn(arrow, 'text-content-muted group-hover:text-primary')} aria-hidden />
    </Link>
  )
}

/* An article: its picture, then the gold meta, the title and the lead. */
export function PublicationCard({
  publication,
  locale,
  dict,
  size = 'md',
}: {
  publication: Publication
  locale: Locale
  dict: Dictionary
  size?: 'md' | 'lg'
}) {
  return (
    <Link href={`/${locale}/publications/${publication.slug}`} className="group flex flex-col gap-4">
      <Cover
        src={publication.coverImage}
        sizes={size === 'lg' ? '(min-width: 1024px) 640px, 100vw' : '(min-width: 1024px) 400px, 100vw'}
        className={size === 'lg' ? 'aspect-[4/3]' : 'aspect-[4/5]'}
      />
      <span className="type-meta text-gold-strong font-semibold">
        {dict.publications.categories[publication.category]}
        {publication.publishedAt && ` · ${formatDate(publication.publishedAt, locale)}`}
      </span>
      <span className={cn('auto-dir group-hover:text-primary transition-colors', size === 'lg' ? 'title-2xl' : 'title-xl')}>
        {t(publication.title, locale)}
      </span>
      <span className={cn('auto-dir text-content-muted', size === 'lg' ? 'text-[1.125rem] leading-relaxed' : 'line-clamp-3')}>
        {t(publication.summary, locale)}
      </span>
      <span className="text-primary flex items-center gap-2 font-semibold">
        {dict.common.readMore}
        <ArrowRight size={16} className={arrow} aria-hidden />
      </span>
    </Link>
  )
}

/** A text written in the administration: paragraphs separated by a blank line. */
export function RichText({ text }: { text: string }) {
  return (
    <div className="prose-block auto-dir mx-auto" dir="auto">
      {text
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        ))}
    </div>
  )
}

/** Back to the list, with an arrow that follows the reading direction. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="mx-auto mt-14 flex max-w-[68ch] items-center gap-4">
      <Star8 className="text-gold size-4" />
      <Link href={href} className="btn btn-outline">
        <ArrowRight size={18} className="rotate-180 rtl:rotate-0" aria-hidden />
        {label}
      </Link>
    </div>
  )
}
