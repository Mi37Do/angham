'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

/*
 * Dropdowns in the platform's language: a pill trigger on a white surface, a
 * square floating panel (the one thing here that casts a shadow, because it
 * floats), and rows that take a tone step under the pointer. Headless UI does
 * the keyboard, focus and ARIA work, and positions the panel; `end` follows
 * the text direction, so panels mirror in Arabic.
 */

/** The trigger: a pill on a white surface. */
export const dropdownTrigger =
  'inline-flex h-10 items-center gap-2 rounded-pill bg-surface-1 px-3.5 text-base font-semibold text-content-strong transition-colors outline-none data-hover:bg-surface-hover data-open:bg-surface-hover data-focus:ring-focus'

/** The floating panel. Pass `transition` on the Headless UI panel to animate it. */
export const dropdownPanel = // taste-skill-ignore: a menu floats over the page
  'z-50 min-w-52 bg-surface-1 p-1.5 shadow-float outline-none [--anchor-gap:8px] [--anchor-padding:12px] origin-top transition duration-150 ease-out data-closed:scale-95 data-closed:opacity-0'

/** A row in the panel. */
export const dropdownItem =
  'flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-start text-sm font-semibold text-content-body select-none data-disabled:cursor-default data-disabled:opacity-50 data-focus:bg-surface-hover data-focus:text-content-strong'

export type DropdownOption<T extends string> = {
  value: T
  label: string
  icon?: React.ReactNode
}

type SelectProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: DropdownOption<T>[]
  /** Accessible name of the control (the visible trigger may be an icon) */
  label: string
  /** What the trigger shows; defaults to the selected option's icon and label */
  trigger?: React.ReactNode
  disabled?: boolean
  className?: string
}

/** Pick one of a few options (the language). */
export function Select<T extends string>({
  value,
  onChange,
  options,
  label,
  trigger,
  disabled,
  className,
}: SelectProps<T>) {
  const selected = options.find((option) => option.value === value)

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <ListboxButton aria-label={label} className={cn(dropdownTrigger, className)}>
        {trigger ?? (
          <>
            {selected?.icon}
            <span>{selected?.label}</span>
            <ChevronDown size={14} className="text-content-muted" aria-hidden />
          </>
        )}
      </ListboxButton>
      <ListboxOptions anchor="bottom end" transition className={dropdownPanel}>
        {options.map((option) => (
          <ListboxOption
            key={option.value}
            value={option.value}
            className={cn(dropdownItem, 'group')}
          >
            {option.icon && (
              <span className="text-content-muted group-data-selected:text-content-strong flex w-5 justify-center">
                {option.icon}
              </span>
            )}
            <span className="group-data-selected:text-content-strong flex-1">{option.label}</span>
            <Check
              size={16}
              className="text-primary invisible group-data-selected:visible"
              aria-hidden
            />
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
