/** taouzie-ui detailField: a label over a value; an em dash stands in for nothing. */
export function DetailField({ label, children }: { label?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      {label && <dt className="text-muted text-[0.7rem]">{label}</dt>}
      <dd className="text-tag">{children ?? '—'}</dd>
    </div>
  )
}
