'use client'

import { Search as SearchIcon, X } from 'lucide-react'

/** taouzie-ui commonSearch: a search field whose clear button slides in when there is something to clear. */
export function Search({
  value,
  onChange,
  placeholder = 'Rechercher',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative flex items-center overflow-hidden">
      <div className="absolute start-0 m-1.5 flex h-7 w-7 items-center justify-center">
        <SearchIcon size={14} aria-hidden />
      </div>
      <button
        type="button"
        aria-label="Effacer"
        tabIndex={value ? 0 : -1}
        aria-hidden={!value}
        onClick={() => onChange('')}
        className={`absolute end-0 m-1.5 flex h-7 w-7 items-center justify-center transition-all duration-300 ${value ? 'translate-x-0' : 'translate-x-10 rtl:-translate-x-10'}`}
      >
        <X size={14} aria-hidden />
      </button>
      <input
        type="text"
        className={`input-search ps-10 placeholder:text-xs placeholder:capitalize ${value ? 'pe-10' : 'pe-2.5'}`}
        placeholder={`${placeholder} ...`}
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
