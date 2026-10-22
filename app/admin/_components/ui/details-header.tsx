import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

/**
 * taouzie-ui commonDetailsHeader: where you came from, what you are looking
 * at, and what you can do to it. Back is a square button with no label (the
 * arrow says it), mirrored in Arabic.
 */
export function DetailsHeader({
  title,
  subtitle,
  backHref,
  backLabel = 'Retour',
  actions,
}: {
  title: string
  subtitle?: string
  backHref?: string
  backLabel?: string
  actions?: React.ReactNode
}) {
  return (
    <header className="flex shrink-0 flex-wrap items-center gap-2">
      {backHref && (
        <Link href={backHref} className="btn btn-nofloat btn-square justify-center" aria-label={backLabel}>
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="pixa-title truncate">{title || '—'}</h1>
        {subtitle && <p className="text-tag text-muted truncate">{subtitle}</p>}
      </div>
      {actions}
    </header>
  )
}
