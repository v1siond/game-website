import type { ComponentType } from 'react'
import type { SectionId, SlotOf } from '@/lib/cv/sectionPlan'

// A world's sections drawn from the shared plan: the world names one frame per section id (its stage,
// title, motion and the divider after it), and the plan decides which frames show and in which order.

export type SectionFrames<Extra extends object = object> = {
  [Id in SectionId]: ComponentType<{ slot: SlotOf<Id> } & Extra>
}
