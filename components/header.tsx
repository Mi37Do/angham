import { getDictionary, getLocale } from '@/app/[lang]/dictionaries'
import { sections } from '@/lib/sections'
import { SiteHeader } from './site-header'

export async function Header() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()])
  return (
    <SiteHeader
      locale={locale}
      siteName={dict.site.name}
      links={sections.map((slug) => ({
        href: `/${locale}/${slug}`,
        label: dict.nav[slug],
        short: dict.navShort[slug],
      }))}
      labels={{ menu: dict.common.menu, language: dict.common.language }}
    />
  )
}
