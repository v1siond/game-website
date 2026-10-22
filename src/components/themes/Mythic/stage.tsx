'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useZoneStage } from '@/hooks/useZoneStage'
import { headingId } from '@/components/cv/sectionText'
import u from './underworld.module.css'

// A section's stage in the descent: the gilded title plate and the section's own scene. useZoneStage
// marks it data-on once, the first time it scrolls into view, and every entrance inside starts off that
// flag. While the stage is in view it hands its region to the page, which fades the fixed depths
// (depths.tsx) to that region.

/** The regions the page goes down, top to bottom. */
export type Zone = 'hall' | 'storm' | 'magma' | 'rhodes' | 'olympus'

interface House {
  // Counts the visitor's returns to the house from the last gate; the hero replays the rise on each.
  rebirths: number
  returnToHouse: () => void
}

const HouseContext = createContext<House>({ rebirths: 0, returnToHouse: () => undefined })

export const HouseProvider = HouseContext.Provider

export const useHouse = () => useContext(HouseContext)

export const mythHeadingId = (title: string) => headingId('myth', title)

export function Laurel({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 ${flip ? '-scale-x-100' : ''}`} aria-hidden="true">
      <path d="M20 21 Q8 18 5 4" fill="none" stroke="currentColor" strokeWidth={1.6} />
      {[6, 10, 14, 18].map((y, index) => (
        <path key={y} d={`M${7 + index * 2.6} ${y} q-5 -1 -5 -5 q5 0 5 5 Z`} fill="currentColor" />
      ))}
    </svg>
  )
}

export function SectionTitle({ title }: { title: string }) {
  return (
    <h2 id={mythHeadingId(title)} className="mb-8 text-[clamp(1.25rem,0.85rem+1.8vw,1.875rem)]">
      <span className={`${u.plate} ${u.display}`}>
        <Laurel />
        <span className="min-w-0">{title}</span>
        <Laurel flip />
      </span>
    </h2>
  )
}

export function Stage({ title, zone, children }: { title: string; zone: Zone; children: ReactNode }) {
  const { ref, on } = useZoneStage<Zone>(zone)

  return (
    <section ref={ref} data-on={on || undefined} aria-labelledby={mythHeadingId(title)} className="mb-28 scroll-mt-8">
      <SectionTitle title={title} />
      {children}
    </section>
  )
}
