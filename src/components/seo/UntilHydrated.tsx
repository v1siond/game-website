'use client'

import { useEffect, useState, type ReactNode } from 'react'

/** Renders its children in the server HTML and the first client render, then removes them once the
 *  page has hydrated. The first client render matches the server, so there is no hydration mismatch. */
export function UntilHydrated({ children }: Readonly<{ children: ReactNode }>) {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  if (hydrated) return null
  return children
}
