import { Eyebrow, StarRule } from './ornament'

/* The opening of every inner page: a gold eyebrow, the title, the intro, a star rule. */
export function PageHeader({ title, intro, eyebrow }: { title: string; intro?: string; eyebrow?: string }) {
  return (
    <header className="shell pt-[clamp(40px,6vw,80px)] pb-10 md:pb-14">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 data-rise className="display auto-dir">
          {title}
        </h1>
        {intro && (
          <p
            data-rise
            style={{ '--i': 1 } as React.CSSProperties}
            className="text-content-muted max-w-[56ch] text-[1.125rem] leading-relaxed"
          >
            {intro}
          </p>
        )}
      </div>
      <StarRule className="mx-auto mt-10 max-w-md" />
    </header>
  )
}
