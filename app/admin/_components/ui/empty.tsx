import { Inbox } from 'lucide-react'

/** taouzie-ui commonEmpty. */
export function Empty({ label = 'Aucune donnée' }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 py-16">
      <Inbox className="text-muted size-20" strokeWidth={1.25} aria-hidden />
      <span className="max-w-80 px-3 text-center uppercase">{label}</span>
    </div>
  )
}
