'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & { toggleLabel: string }

export function PasswordInput({ toggleLabel, ...props }: Props) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="input gap-2 pe-1">
      <input
        {...props}
        type={visible ? 'text' : 'password'}
        dir="ltr"
        className="h-full min-w-0 flex-1 bg-transparent outline-none"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={toggleLabel}
        aria-pressed={visible}
        className="text-muted hover:text-content rounded-full p-1.5"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  )
}
