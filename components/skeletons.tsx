import { cn } from '@/lib/cn'

// Still blocks in the tone of the ground: a loading page should not pulse for attention.
const block = 'bg-surface-sunken'

export function CardsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="shell flex gap-8 overflow-hidden pt-24" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex w-full flex-col gap-3">
          <div className={cn(block, 'h-24 w-3/4')} />
          <div className={cn(block, 'h-6 w-1/2')} />
        </div>
      ))}
    </div>
  )
}

export function RowsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-[var(--gutter)]" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-surface-1 grid grid-cols-[7rem_1fr] gap-4 p-3 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-8 md:p-4"
        >
          <div className={cn(block, 'aspect-[4/3]')} />
          <div className="flex flex-col gap-3 py-1">
            <div className={cn(block, 'h-4 w-1/3')} />
            <div className={cn(block, 'h-7 w-3/4')} />
            <div className={cn(block, 'mt-auto h-5 w-1/4')} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-x-[var(--gutter)] gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="bg-surface-1 flex flex-col">
          <div className={cn(block, 'aspect-[3/2]')} />
          <div className="flex flex-col gap-3 p-4 md:p-5">
            <div className={cn(block, 'h-4 w-1/3')} />
            <div className={cn(block, 'h-7 w-3/4')} />
            <div className={cn(block, 'h-5 w-1/2')} />
            <div className={cn(block, 'mt-3 h-6 w-2/5')} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DetailsSkeleton() {
  return (
    <div aria-busy="true">
      <div className={cn(block, 'h-[48svh]')} />
      <div className="shell flex flex-col gap-4 py-8">
        <div className={cn(block, 'h-12 w-1/2')} />
        <div className={cn(block, 'h-5 w-1/4')} />
        <div className={cn(block, 'h-32 w-full')} />
      </div>
    </div>
  )
}
