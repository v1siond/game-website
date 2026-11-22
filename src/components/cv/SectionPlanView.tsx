'use client'

import { useMemo, type ComponentType } from 'react'
import type { ProfessionSections } from '@/lib/cv/cvView'
import { sectionPlan, type SectionId, type SectionSlot, type SlotOf } from '@/lib/cv/sectionPlan'
import { useCVData } from './CVDataProvider'
import type { ProfessionSectionViews } from './ProfessionSectionsView'

// A world's sections drawn from the shared plan: the world names one frame per section id (its stage,
// title, motion and the divider after it), and the plan decides which frames show and in which order.

export type SectionFrames<Extra extends object = object> = {
  [Id in SectionId]: ComponentType<{ slot: SlotOf<Id> } & Extra>
}

/**
 * The world's ProfessionSectionViews map built from its frames, once at module scope. With `className`
 * the frames sit in one div of that class (a world that spaces its sections from the wrapper).
 */
export function sectionViews<Extra extends object = object>(frames: SectionFrames<Extra>, className?: string): ProfessionSectionViews<Extra> {
  function PlannedSections({ sections, ...extra }: { sections: ProfessionSections } & Extra) {
    const { professionalSummary } = useCVData()
    const plan = useMemo(() => sectionPlan(sections, professionalSummary.bio), [sections, professionalSummary.bio])
    const shown = plan.map((slot) => {
      // The frames map is keyed by the same id that narrows `slot`, so this frame takes this slot.
      const Frame = frames[slot.id] as ComponentType<{ slot: SectionSlot } & Extra>
      return <Frame key={slot.id} slot={slot} {...(extra as Extra)} />
    })

    if (!className) return <>{shown}</>
    return <div className={className}>{shown}</div>
  }

  return { engineer: PlannedSections, drummer: PlannedSections, fighter: PlannedSections }
}
