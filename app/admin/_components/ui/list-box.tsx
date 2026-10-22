'use client'

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/cn'

/**
 * taouzie-ui commonListBox: a Headless UI listbox styled as an `.input`, so it
 * sits in a form beside the text fields. `name` submits the value with the form.
 */
export function ListBox<T extends string>({
  name,
  options,
  defaultValue,
  ariaLabel,
  placement = 'bottom',
  onChange,
}: {
  name?: string
  options: Record<T, string>
  defaultValue: T
  ariaLabel?: string
  placement?: 'top' | 'bottom'
  onChange?: (value: T) => void
}) {
  const [value, setValue] = useState<T>(defaultValue)
  const pick = (next: T) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <Listbox name={name} value={value} onChange={pick}>
      <div className="relative">
        <ListboxButton className="input relative pe-8" aria-label={ariaLabel}>
          <span className="block truncate">{options[value]}</span>
          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-2">
            <ChevronsUpDown className="text-muted size-4" aria-hidden />
          </span>
        </ListboxButton>
        <ListboxOptions
          transition
          className={cn(
            'card styled-scrollbar absolute z-50 flex max-h-60 w-full flex-col overflow-auto text-sm shadow-xl shadow-slate-500/10 transition duration-100 ease-in data-leave:data-closed:opacity-0',
            placement === 'top' ? 'bottom-full mb-1' : 'mt-1',
          )}
        >
          {(Object.entries(options) as [T, string][]).map(([key, label]) => (
            <ListboxOption
              key={key}
              value={key}
              className="group text-content data-focus:fill-brand-2 data-focus:text-brand-2 relative flex w-full cursor-default py-2 ps-10 pe-3 select-none data-focus:bg-[var(--primary-90)]"
            >
              <span className="block truncate font-normal group-data-selected:font-medium">{label}</span>
              <span className="text-brand-2 absolute inset-y-0 start-0 hidden items-center ps-3 group-data-selected:flex">
                <Check className="size-4" aria-hidden />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  )
}
