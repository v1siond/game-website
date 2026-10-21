'use client'

import { useEffect, useState } from 'react'

// The one reduced motion check for every world. The hook starts false so the server render and the
// first client render agree, then follows the media query live.

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** A one off read for code that decides at the moment of an event, outside render. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
    setReducedMotion(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}
