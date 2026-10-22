'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { TriangleAlert } from 'lucide-react'
import { useState, useTransition } from 'react'

/**
 * taouzie-ui commonConfirmModal: "are you sure?" before anything destructive.
 * Props-driven, so a screen may have as many as it needs. Here it wraps its
 * own trigger and runs a server action on confirm.
 */
export function ConfirmModal({
  action,
  subject,
  message = 'Cet élément sera supprimé définitivement.',
  label = 'Supprimer',
  trigger,
}: {
  action: () => Promise<void>
  /** The thing itself, shown so nobody confirms blind. */
  subject?: string
  message?: string
  label?: string
  trigger?: (open: () => void) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const close = () => !pending && setOpen(false)

  return (
    <>
      {trigger ? (
        trigger(() => setOpen(true))
      ) : (
        <button type="button" className="btn btn-nofloat-red" onClick={() => setOpen(true)}>
          {label}
        </button>
      )}
      <Dialog open={open} onClose={close} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/15 backdrop-blur-[2px] duration-300 ease-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-3 sm:items-center">
            <DialogPanel
              transition
              className="bg-surface flex w-full max-w-md flex-col items-center gap-3 overflow-hidden rounded-2xl p-[1.125rem] shadow-xl duration-300 ease-out data-closed:scale-95 data-closed:opacity-0 sm:w-96"
            >
              <div className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-500">
                <TriangleAlert className="size-7" aria-hidden />
              </div>
              <DialogTitle as="h3" className="pixa-title truncate">
                Confirmation
              </DialogTitle>
              <p className="text-center">
                {message}
                {subject && (
                  <>
                    <br />
                    <span className="font-medium uppercase">{subject}</span>
                  </>
                )}
              </p>
              <div className="mt-2 grid w-full grid-cols-2 gap-2">
                <button
                  type="button"
                  className="btn btn-primary-red justify-center"
                  disabled={pending}
                  onClick={() => startTransition(() => action())}
                >
                  {pending ? <span className="loader !w-5 invert" aria-hidden /> : label}
                </button>
                <button type="button" className="btn btn-nofloat justify-center" disabled={pending} onClick={close}>
                  Conserver
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
