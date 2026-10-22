'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  Library,
  LogOut,
  Mail,
  Newspaper,
  PanelLeft,
  UserRound,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, useState } from 'react'
import { cn } from '@/lib/cn'
import { logout } from '../actions'

const items = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/admin/evenements', label: 'Événements', icon: CalendarDays },
  { href: '/admin/publications', label: 'Publications', icon: Newspaper },
  { href: '/admin/ressources', label: 'Bibliothèque', icon: Library },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
]

/*
 * foundoq.dev's ModuleLayout: a side navigation that collapses to an icon
 * rail (never hidden entirely), a top bar, and the page in a scrolling column.
 */
export function AdminShell({
  email,
  unread,
  children,
}: {
  email: string
  unread: number
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <aside
        className={cn(
          'border-edge bg-surface flex h-full shrink-0 flex-col gap-3 overflow-hidden border-e px-2 pt-3.5 pb-3 transition-[width] duration-200 ease-in-out',
          collapsed ? 'w-14' : 'w-14 md:w-56',
        )}
      >
        <Link href="/admin" className="flex h-10 w-full items-center gap-2 px-1.5">
          <Image src="/brand/small_logo.svg" alt="" width={28} height={32} className="shrink-0" />
          <span className={cn('pixa-title-sm truncate', collapsed ? 'hidden' : 'hidden md:block')}>
            Angham Al Andalous
          </span>
        </Link>
        <span className={cn('section-head px-2 pt-2', collapsed ? 'hidden' : 'hidden md:flex')}>Contenus</span>
        <nav className="flex flex-col gap-1">
          <Suspense fallback={items.map((item) => <SideNavLink key={item.href} item={item} collapsed={collapsed} unread={0} />)}>
            <ActiveSideNav collapsed={collapsed} unread={unread} />
          </Suspense>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="relative flex h-16 w-full shrink-0 items-center justify-between gap-3 px-3">
          <button
            type="button"
            className="btn-sm btn-square hidden justify-center md:flex"
            aria-label="Réduire ou déplier le menu"
            onClick={() => setCollapsed(!collapsed)}
          >
            <PanelLeft className="size-5" />
          </button>
          <span className="md:hidden" />
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/fr" className="btn btn-nofloat" target="_blank">
              <ExternalLink className="size-4" aria-hidden />
              <span className="hidden sm:inline">Voir le site</span>
            </Link>
            <AccountMenu email={email} />
          </div>
        </header>
        <main className="styled-scrollbar flex flex-1 flex-col overflow-auto px-3 pb-6 md:px-6">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">{children}</div>
        </main>
      </div>
    </div>
  )
}

type Item = (typeof items)[number]

function ActiveSideNav({ collapsed, unread }: { collapsed: boolean; unread: number }) {
  const pathname = usePathname()
  return items.map((item) => {
    const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
    return (
      <SideNavLink
        key={item.href}
        item={item}
        collapsed={collapsed}
        active={active}
        unread={item.href === '/admin/messages' ? unread : 0}
      />
    )
  })
}

/** foundoq.dev sideNavLink: a `.btn` row, tinted when its route is active. */
function SideNavLink({
  item,
  collapsed,
  active = false,
  unread,
}: {
  item: Item
  collapsed: boolean
  active?: boolean
  unread: number
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'btn w-full items-center normal-case',
        active ? 'fill-brand-2 text-brand-2 bg-[var(--primary-90)]' : 'hover:bg-btn-ghost',
      )}
    >
      <span className="relative shrink-0">
        <Icon className="size-5 shrink-0" aria-hidden />
        {unread > 0 && (
          <span
            className={cn('bg-danger absolute -end-1 -top-1 size-2 rounded-full', collapsed ? 'block' : 'block md:hidden')}
            aria-hidden
          />
        )}
      </span>
      <span className={cn('flex-1 truncate text-start text-[0.8rem]', collapsed ? 'hidden' : 'hidden md:block')}>
        {item.label}
      </span>
      {unread > 0 && (
        <span
          className={cn(
            'bg-danger tabular rounded-full px-1.5 text-[0.65rem] leading-4 text-white',
            collapsed ? 'hidden' : 'hidden md:block',
          )}
        >
          {unread}
        </span>
      )}
    </Link>
  )
}

const panel =
  'card z-50 flex min-w-48 flex-col p-1 text-sm shadow-xl shadow-slate-500/10 [--anchor-gap:6px] transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0'
const option =
  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-start data-focus:bg-[var(--primary-90)] data-focus:text-brand-2'

function AccountMenu({ email }: { email: string }) {
  return (
    <Menu>
      <MenuButton className="btn btn-nofloat btn-square justify-center" aria-label="Compte">
        <UserRound className="size-4" aria-hidden />
      </MenuButton>
      <MenuItems anchor="bottom end" transition className={panel}>
        <p className="text-muted truncate px-2.5 py-2 text-[0.7rem]">{email}</p>
        <form action={logout}>
          <MenuItem>
            <button type="submit" className={cn(option, 'text-danger-strong')}>
              <LogOut className="size-4" aria-hidden />
              Se déconnecter
            </button>
          </MenuItem>
        </form>
      </MenuItems>
    </Menu>
  )
}
