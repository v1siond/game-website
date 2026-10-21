'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { headingId } from '@/components/cv/sectionText'
import type { Zone } from './wasteland'
import cel from './cel.module.css'

// A section's stage: the inked title slab and the section's own scene. useSectionTrigger marks it
// data-on once, the first time it scrolls into view, and every entrance inside starts off that flag;
// under reduced motion it is on from the start. While the stage is in view it hands its zone (the
// hour of the desert) to the page, which crossfades the fixed sky to it.

interface WorldMotion {
  reduced: boolean
  onZone: (zone: Zone) => void
}

const WorldMotionContext = createContext<WorldMotion>({ reduced: false, onZone: () => undefined })

export const WorldMotionProvider = WorldMotionContext.Provider

export const useWorldMotion = () => useContext(WorldMotionContext)

/** Whether a stage has come into view, its zone handed up while it is in view. */
export function useStage(zone: Zone) {
  const { reduced, onZone } = useWorldMotion()
  const { ref, triggered, inView } = useSectionTrigger()

  useEffect(() => {
    if (inView) onZone(zone)
  }, [inView, zone, onZone])

  return { ref, on: triggered || reduced, reduced }
}

export const celHeadingId = (title: string) => headingId('cel', title)

export function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={celHeadingId(title)} className={`mb-8 text-3xl sm:text-4xl ${cel.display}`}>
      <span className={cel.titleSlab}>
        <span>{title}</span>
      </span>
    </h2>
  )
}

export function Stage({ title, zone, children }: { title: string; zone: Zone; children: ReactNode }) {
  const { ref, on } = useStage(zone)

  return (
    <section ref={ref} data-on={on || undefined} aria-labelledby={celHeadingId(title)} className={`mb-24 scroll-mt-8 ${cel.stage}`}>
      <SectionTitle title={title} />
      {children}
    </section>
  )
}
