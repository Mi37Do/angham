import Image from 'next/image'
import { cn } from '@/lib/cn'

/** The eight-pointed star (khatam) of Andalusian zellige: two squares, one turned 45°. */
export function Star8({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('size-4 fill-current', className)}>
      <rect x="4.5" y="4.5" width="15" height="15" />
      <rect x="4.5" y="4.5" width="15" height="15" transform="rotate(45 12 12)" />
    </svg>
  )
}

/** A gold rule broken by a star: the divider between sections. */
export function StarRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('text-gold flex items-center gap-3', className)}>
      <span className="h-px flex-1 bg-current opacity-40" />
      <Star8 className="size-4" />
      <span className="h-px flex-1 bg-current opacity-40" />
    </div>
  )
}

/** A small gold label over a heading, led by a star. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-gold-strong flex items-center gap-2 text-sm font-semibold tracking-wide', className)}>
      <Star8 className="size-3.5 text-gold" />
      {children}
    </p>
  )
}

/** A picture with its credit underneath (every Commons photograph must carry one). */
export function Figure({
  src,
  alt,
  credit,
  className,
  ratio = 'aspect-[16/10]',
  priority = false,
  sizes = '(min-width: 1280px) 1280px, 100vw',
}: {
  src: string
  alt: string
  credit?: string | null
  className?: string
  ratio?: string
  priority?: boolean
  sizes?: string
}) {
  const picture = (
    <div className={cn('bg-surface-sunken relative overflow-hidden', ratio)}>
      {/* next/image: resized and served as WebP/AVIF from the originals in public/media */}
      <ImageFill src={src} alt={alt} priority={priority} sizes={sizes} />
    </div>
  )
  return (
    <figure className={className}>
      {picture}
      {credit && <figcaption className="type-caption text-content-subtle mt-2">{credit}</figcaption>}
    </figure>
  )
}

function ImageFill({ src, alt, priority, sizes }: { src: string; alt: string; priority: boolean; sizes: string }) {
  return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
}
