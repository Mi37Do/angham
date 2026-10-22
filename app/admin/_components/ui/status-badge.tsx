/**
 * taouzie-ui statusBadge: a small pill for a status value, tinted from a
 * design token. The colour is passed as a CSS value (e.g. `var(--success-color)`)
 * so the badge stays domain-agnostic; the fill follows from the same tone.
 */
export function StatusBadge({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className="tag truncate text-[0.65rem] font-medium"
      style={{ color: tone, backgroundColor: `color-mix(in srgb, ${tone} 12%, var(--color-surface))` }}
    >
      {label}
    </span>
  )
}

/** Published / draft, the one status every content type here has. */
export function PublishedBadge({ published }: { published: boolean }) {
  return published ? (
    <StatusBadge label="Publié" tone="var(--success-color)" />
  ) : (
    <StatusBadge label="Brouillon" tone="var(--neutral-color)" />
  )
}
