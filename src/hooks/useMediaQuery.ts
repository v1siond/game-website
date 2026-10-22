'use client'

import { useEffect, useState } from 'react'

// The one media query reader for every world. The hook starts false so the server render and the first
// client render agree, then follows the query live.

/** A phone wide screen, below Tailwind's md breakpoint. */
export const PHONE_QUERY = '(max-width: 767px)'

/** A one off read for code that decides at the moment of an event, outside render. */
export function matchesMedia(query: string): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia(query).matches
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/** Whether the screen is phone wide, where a reveal that waits on a tap opens on scroll instead. */
export const useIsPhone = (): boolean => useMediaQuery(PHONE_QUERY)
