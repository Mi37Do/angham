'use client'

import { Field, Label, Switch } from '@headlessui/react'
import { useState } from 'react'

/**
 * taouzie-ui commonSwitcher. translateX is physical, so in RTL the knob walks
 * the other way (`rtl:-translate-x-3.5`), toward the inline end.
 */
export function Switcher({
  name,
  defaultChecked = false,
  label,
}: {
  name?: string
  defaultChecked?: boolean
  label?: (enabled: boolean) => React.ReactNode
}) {
  const [enabled, setEnabled] = useState(defaultChecked)
  return (
    <Field className="flex items-center gap-x-3">
      <Switch
        name={name}
        checked={enabled}
        onChange={setEnabled}
        className="focus-visible:outline-brand flex w-8 flex-none cursor-pointer rounded-full bg-[var(--border)] p-px ring-1 ring-gray-900/5 transition-colors duration-200 ease-in-out ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 data-checked:bg-[var(--primary-2)]"
      >
        <span
          aria-hidden
          className={`size-4 transform rounded-full bg-[var(--secondary-background)] shadow-xs ring-1 ring-gray-900/5 transition duration-200 ease-in-out ${enabled ? 'translate-x-3.5 rtl:-translate-x-3.5' : 'translate-x-0'}`}
        />
      </Switch>
      {label && <Label className="cursor-pointer">{label(enabled)}</Label>}
    </Field>
  )
}
