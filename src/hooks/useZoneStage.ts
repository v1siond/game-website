'use client'

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, type RefObject } from 'react'
import { useSectionTrigger } from './useSectionTrigger'

// A world page that fades its fixed backdrop to the part of the page in view. The page keeps the zone in a
// store of its own (useZoneStore), outside React state, and shares the store's writer and its reduced
// motion flag through ZoneStageProvider; each section stage calls useZoneStage, which marks the stage on
// once it first scrolls into view (on from the start under reduced motion) and hands its zone up while it
// is in view. Only the backdrop that draws the zone subscribes (useStoreValue), or the root writes it as
// data-zone without a render (useZoneAttribute), so a zone crossing re-renders that backdrop and nothing
// else. Every world draws its own backdrop, stages and entrances.

/** A value outside React state: read, written, and followed by the components that draw it. */
export interface ValueStore<Value> {
  read(): Value
  // The value before any write, which is also what the server render and hydration read.
  first(): Value
  write(value: Value): void
  subscribe(onChange: () => void): () => void
}

/** A store holding `initial` until written; a write of the value it holds wakes nobody. */
export function createValueStore<Value>(initial: Value): ValueStore<Value> {
  let value = initial
  const listeners = new Set<() => void>()

  return {
    read: () => value,
    first: () => initial,
    write: (next) => {
      if (Object.is(next, value)) return
      value = next
      listeners.forEach((listener) => listener())
    },
    subscribe: (onChange) => {
      listeners.add(onChange)
      return () => {
        listeners.delete(onChange)
      }
    },
  }
}

/** The store's value (the zone in view, for the backdrop that draws it), re-rendering the caller only when it changes. */
export const useStoreValue = <Value>(store: ValueStore<Value>): Value =>
  useSyncExternalStore(store.subscribe, store.read, store.first)

interface ZoneStageContext {
  reduced: boolean
  // Method syntax keeps the parameter bivariant, so a handler typed to the page's own zone union fits here.
  onZone(zone: string): void
}

const ZoneStage = createContext<ZoneStageContext>({ reduced: false, onZone: () => undefined })

export const ZoneStageProvider = ZoneStage.Provider

/**
 * The page side: one zone store per mount of the world, never shared between mounts, since each world
 * starts on its own zone, and the provider value, which changes only with `reduced`.
 */
export function useZoneStore<Zone extends string>(initial: Zone, reduced: boolean) {
  const [zones] = useState(() => createValueStore(initial))
  const stage = useMemo(() => ({ reduced, onZone: zones.write }), [reduced, zones])
  return { zones, stage }
}

/**
 * For a world whose root carries the zone as data-zone for its css: the root renders the first zone and
 * every later one is written on the element, so the root itself never re-renders for a crossing.
 */
export function useZoneAttribute<Zone extends string>(zones: ValueStore<Zone>, root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const show = () => root.current?.setAttribute('data-zone', zones.read())
    show()
    return zones.subscribe(show)
  }, [zones, root])
}

/** The page's reduced motion flag and zone handler, for parts of a world that are not stages. */
export const useZoneStageContext = () => useContext(ZoneStage)

/** Whether a stage has come into view, its zone handed to the page while it is in view. */
export function useZoneStage<Zone extends string>(zone: Zone) {
  const { reduced, onZone } = useZoneStageContext()
  // Observed for the whole visit, so scrolling back up hands this zone up again; the stage itself stays on.
  const { ref, triggered, inView } = useSectionTrigger({ triggerOnce: false })
  const [seen, setSeen] = useState(false)
  if (inView && !seen) setSeen(true)

  useEffect(() => {
    if (inView) onZone(zone)
  }, [inView, zone, onZone])

  return { ref, on: seen || triggered || reduced, reduced }
}
