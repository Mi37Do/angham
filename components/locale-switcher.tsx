'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { type Locale, localeFlags, localeNames, locales } from '@/lib/i18n'
import { cn } from '@/lib/cn'
import { Select } from './ui/dropdown'

// From foundoq.web, without next-intl: the locale is the first path segment.
// Each language shows its flag (flag-icons, as foundoq.web's visas do).
const Flag = ({ locale, className }: { locale: Locale; className?: string }) => (
  <span className={cn(`fi fi-${localeFlags[locale]} rounded-[2px]`, className)} aria-hidden />
)

/** `compact`: the flag and the language code, for the header. */
export function LocaleSwitcher({
  locale,
  label,
  compact = false,
}: {
  locale: Locale
  label: string
  compact?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [pending, startTransition] = useTransition()

  // /fr/evenements/x -> /ar/evenements/x
  const switchTo = (next: Locale) => {
    const rest = pathname.split('/').slice(2).join('/')
    startTransition(() => router.replace(`/${next}${rest ? `/${rest}` : ''}`))
  }

  return (
    <Select
      label={label}
      value={locale}
      disabled={pending}
      onChange={switchTo}
      options={locales.map((code) => ({
        value: code,
        label: localeNames[code],
        icon: <Flag locale={code} />,
      }))}
      trigger={
        compact ? (
          <>
            <Flag locale={locale} className={cn(pending && 'animate-pulse')} />
            <span className="uppercase">{locale}</span>
          </>
        ) : undefined
      }
    />
  )
}
