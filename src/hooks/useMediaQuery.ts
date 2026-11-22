'use client'

import { useSyncExternalStore } from 'react'

// The one media query reader for every world. The server render and hydration read false, so they agree;
// a component mounted on the client reads the real answer in its first render, so a reduced motion caller
// never starts its motion for one commit. One MediaQueryList and one subscribe function per query, kept
// for the page's life, so every caller of a query shares them and React never resubscribes.

const canMatch = (): boolean => typeof window !== 'undefined' && typeof window.matchMedia === 'function'

/** A one off read for code that decides at the moment of an event, outside render. */
export function matchesMedia(query: string): boolean {
  if (!canMatch()) return false
  return window.matchMedia(query).matches
}

type Subscribe = (onChange: () => void) => () => void

const lists = new Map<string, MediaQueryList>()
const subscribers = new Map<string, Subscribe>()

const listFor = (query: string): MediaQueryList => {
  const known = lists.get(query)
  if (known) return known
  const list = window.matchMedia(query)
  lists.set(query, list)
  return list
}

const subscribeFor = (query: string): Subscribe => {
  const known = subscribers.get(query)
  if (known) return known
  const subscribe: Subscribe = (onChange) => {
    if (!canMatch()) return () => {}
    const list = listFor(query)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }
  subscribers.set(query, subscribe)
  return subscribe
}

const serverSnapshot = (): boolean => false

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(subscribeFor(query), () => canMatch() && listFor(query).matches, serverSnapshot)
}
