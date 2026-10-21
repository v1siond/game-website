'use client'

import { createContext, useContext, useEffect } from 'react'
import { useSectionTrigger } from './useSectionTrigger'

// A world page that fades its fixed backdrop to the part of the page in view. The page keeps the zone in
// state and shares its zone handler and its reduced motion flag through ZoneStageProvider; each section stage
// calls useZoneStage, which marks the stage on once it first scrolls into view (on from the start under
// reduced motion) and hands its zone up while it is in view. Only this data is shared: every world draws
// its own backdrop, stages and entrances.

interface ZoneStageContext {
  reduced: boolean
  // Method syntax keeps the parameter bivariant, so a handler typed to the page's own zone union fits here.
  onZone(zone: string): void
}

const ZoneStage = createContext<ZoneStageContext>({ reduced: false, onZone: () => undefined })

export const ZoneStageProvider = ZoneStage.Provider

/** The page's reduced motion flag and zone handler, for parts of a world that are not stages. */
export const useZoneStageContext = () => useContext(ZoneStage)

/** Whether a stage has come into view, its zone handed to the page while it is in view. */
export function useZoneStage<Zone extends string>(zone: Zone) {
  const { reduced, onZone } = useZoneStageContext()
  const { ref, triggered, inView } = useSectionTrigger()

  useEffect(() => {
    if (inView) onZone(zone)
  }, [inView, zone, onZone])

  return { ref, on: triggered || reduced, reduced }
}
