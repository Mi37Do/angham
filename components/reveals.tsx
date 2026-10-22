'use client'

import { useEffect } from 'react'

const SELECTOR = '[data-reveal]:not(.is-in), [data-shutter]:not(.is-in)'

/*
 * Section entrances (globals.css, "Motion"): each [data-reveal] / [data-shutter]
 * element gets .is-in once, the first time it enters the viewport. Content
 * streamed in later (Suspense) and client navigations are picked up by the
 * MutationObserver. Nothing replays, and without this script the CSS safety
 * net shows everything. The marker can land before a streamed client subtree
 * hydrates, so [data-reveal] / [data-shutter] elements inside client components
 * carry suppressHydrationWarning (they never change their own className).
 */
export function Reveals() {
  useEffect(() => {
    const root = document.documentElement
    // The head script marks <html>; a document re-created by React (a 404) loses it.
    root.classList.add('js')
    const show = (element: Element) => element.classList.add('is-in')

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(SELECTOR).forEach(show)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          show(entry.target)
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    const watch = () =>
      document.querySelectorAll(SELECTOR).forEach((element) => io.observe(element))

    watch()
    const mo = new MutationObserver(watch)
    mo.observe(document.body, { childList: true, subtree: true })
    root.classList.add('reveals-ready')

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}
