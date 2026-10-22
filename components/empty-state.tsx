import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

type Props = { title: string; hint?: string; icon?: LucideIcon; children?: React.ReactNode }

export function EmptyState({ title, hint, icon: Icon = Inbox, children }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 px-6 py-16 text-center">
      <Icon size={32} className="text-gold" aria-hidden />
      <div className="flex max-w-md flex-col gap-2">
        <p className="title-xl">{title}</p>
        {hint && <p className="text-content-muted">{hint}</p>}
      </div>
      {children}
    </div>
  )
}
