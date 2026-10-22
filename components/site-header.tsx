'use client'

import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, useState } from 'react'
import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/cn'
import { LocaleSwitcher } from './locale-switcher'

// foundoq.web's SiteHeader: a bar of pill links on wide screens, a drawer on
// small ones, the language on the end side.
// `short` labels the bar on wide screens; the drawer keeps the full name.
type NavLink = { href: string; label: string; short: string }
type Labels = { menu: string; language: string }

export function SiteHeader({
  locale,
  siteName,
  links,
  labels,
}: {
  locale: Locale
  siteName: string
  links: NavLink[]
  labels: Labels
}) {
  const [open, setOpen] = useState(false)

  // The URL is only known per request on some routes, so whatever reads it
  // (active link, language links) streams in behind a Suspense boundary, over
  // a same-sized static fallback.
  const switchers = (
    <Suspense fallback={<span className="h-10 w-16" aria-hidden />}>
      <LocaleSwitcher locale={locale} label={labels.language} compact />
    </Suspense>
  )

  return (
    <header className="bg-surface-app/92 border-hairline sticky top-0 z-40 border-b backdrop-blur">
      <div className="shell flex h-20 items-center gap-6">
        {/* Only the emblem here; the association's calligraphic name opens the home page. */}
        <Link href={`/${locale}`} className="flex shrink-0 items-center" aria-label={siteName}>
          <Image src="/brand/small_logo.svg" alt="" width={44} height={50} priority />
        </Link>

        <nav className="hidden min-w-0 flex-1 justify-center gap-0.5 lg:flex">
          <Suspense fallback={<NavLinks links={links} variant="bar" />}>
            <ActiveNavLinks links={links} variant="bar" />
          </Suspense>
        </nav>

        <div className="ms-auto flex items-center gap-2">
          {/* On a phone, the language lives in the menu. */}
          <div className="hidden items-center gap-2 sm:flex">{switchers}</div>
          <button
            className="rounded-pill text-content-strong hover:bg-surface-1 p-2 transition-colors lg:hidden"
            aria-label={labels.menu}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <nav className={cn('shell flex-col gap-1 pb-4 lg:hidden', open ? 'flex' : 'hidden')}>
        <Suspense fallback={<NavLinks links={links} variant="drawer" />}>
          <ActiveNavLinks links={links} variant="drawer" onNavigate={() => setOpen(false)} />
        </Suspense>
        <div className="flex items-center gap-2 pt-2 sm:hidden">{switchers}</div>
      </nav>
    </header>
  )
}

type Variant = 'bar' | 'drawer'

function ActiveNavLinks(props: { links: NavLink[]; variant: Variant; onNavigate?: () => void }) {
  return <NavLinks {...props} pathname={usePathname()} />
}

function NavLinks({
  links,
  variant,
  pathname,
  onNavigate,
}: {
  links: NavLink[]
  variant: Variant
  pathname?: string
  onNavigate?: () => void
}) {
  const isActive = (href: string) =>
    pathname !== undefined && (pathname === href || pathname.startsWith(`${href}/`))

  return links.map((link) => {
    const active = isActive(link.href)
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'font-semibold transition-colors duration-200',
          variant === 'bar' ? 'rounded-pill px-3.5 py-2 text-[0.9375rem] whitespace-nowrap' : 'px-3 py-3 text-lg',
          active
            ? 'text-primary bg-gold-soft'
            : 'text-content-muted hover:bg-surface-2 hover:text-content-strong',
        )}
      >
        {variant === 'bar' ? link.short : link.label}
      </Link>
    )
  })
}
