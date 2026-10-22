import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { getDictionary, getLocale } from '@/app/[lang]/dictionaries'
import { allCredits } from '@/lib/media'
import { sections } from '@/lib/sections'
import { LocaleSwitcher } from './locale-switcher'

const heading = 'text-sm font-semibold tracking-wide text-gold-soft'
const link =
  'text-base text-white/85 underline decoration-transparent underline-offset-4 transition-colors hover:text-white hover:decoration-current'

/*
 * The close: a band of zellige, then one field of the logo green holding an
 * invitation with the one action (gold), the links, the language, and the
 * white emblem with the motto. Every photograph is credited, folded away.
 */
export async function Footer() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()])

  return (
    <footer className="mt-[clamp(80px,10vw,144px)]">
      <div className="zellige-band" aria-hidden />
      <div className="bg-field-inverse relative isolate overflow-hidden text-white">
        <div className="bg-mosaic absolute inset-0 -z-10 opacity-[0.07] invert" aria-hidden />

        <div className="shell grid gap-12 pt-[clamp(56px,7vw,96px)] md:grid-cols-12 md:gap-x-10">
          <div className="flex flex-col items-start gap-8 md:col-span-6">
            <p className="max-w-[18ch] text-[clamp(1.875rem,3.4vw,2.625rem)] leading-[1.1] font-bold tracking-[-0.02em] text-balance">
              {dict.sections.contact.intro}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="btn btn-xl bg-gold hover:bg-gold-strong text-[1.1875rem] font-bold text-white"
            >
              {dict.nav.contact}
              <ArrowRight size={18} className="rtl:rotate-180" aria-hidden />
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:col-span-5 md:col-start-8">
            <nav className="flex flex-col gap-3" aria-label={dict.common.sections}>
              <h2 className={heading}>{dict.common.sections}</h2>
              <ul className="flex flex-col gap-2">
                {sections.map((slug) => (
                  <li key={slug}>
                    <Link href={`/${locale}/${slug}`} className={link}>
                      {dict.nav[slug]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-3">
              <h2 className={heading}>{dict.common.language}</h2>
              <div className="flex flex-col items-start gap-2">
                <Suspense fallback={<span className="h-10 w-32" aria-hidden />}>
                  <LocaleSwitcher locale={locale} label={dict.common.language} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        <div className="shell mt-16 flex flex-col items-start gap-8 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-6" dir="ltr">
            <Image src="/brand/aaa_logo_white.svg" alt="" width={96} height={126} className="w-20 md:w-24" />
            <Image
              src="/brand/big_title.svg"
              alt={dict.site.motto}
              width={785}
              height={221}
              className="w-[min(52vw,360px)] brightness-0 invert"
            />
          </div>
          <div className="flex max-w-[52ch] flex-col gap-3 text-sm text-white/80 md:text-end">
            <p>{dict.site.description}</p>
            <details className="group">
              <summary className="w-fit cursor-pointer font-semibold text-white underline decoration-transparent underline-offset-4 hover:decoration-current md:ms-auto">
                {dict.common.photoCredits}
              </summary>
              <ul className="mt-3 flex flex-col gap-1 text-start" dir="ltr">
                {allCredits.map((c) => (
                  <li key={c.key}>
                    <a href={c.page} className="underline underline-offset-2 hover:text-white">
                      {c.title}
                    </a>
                    {c.author && ` · ${c.author}`} · {c.license}
                  </li>
                ))}
              </ul>
            </details>
            <p>
              © {dict.site.name}. {dict.common.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
