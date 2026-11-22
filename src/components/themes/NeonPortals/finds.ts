import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { maskSteps } from './choreography'

// The tally's finds, counted the way the game's box counter counts broken boxes against the level's
// total: the count box (About), one box per tech category, the iron box (Services), one gem per venture,
// one box lid per band and one mask step per achievement, at most three. He passes the jobs and points at
// the projects, so they add none. The total is counted from the sections the active profession shows, so
// a section the plan leaves out adds nothing.

const FINDS_IN: { [Id in SectionId]: (slot: SlotOf<Id>) => number } = {
  about: () => 1,
  work: () => 0,
  tech: ({ categories }) => categories.length,
  services: () => 1,
  projects: () => 0,
  ventures: ({ companies }) => companies.length,
  bands: ({ bands }) => bands.length,
  muayThai: ({ martialArts }) => maskSteps(martialArts.primary.achievements.length),
}

const findsIn = (slot: SectionSlot): number => {
  // The map is keyed by the same id that narrows `slot`, so this counter takes this slot.
  const count = FINDS_IN[slot.id] as (slot: SectionSlot) => number
  return count(slot)
}

/** How many finds a profession's run holds. */
export const findTotal = (plan: readonly SectionSlot[]): number => plan.reduce((total, slot) => total + findsIn(slot), 0)

/** One find's id: its section and its item, so two sections never share one. */
export const findId = (section: SectionId, item: string | number): string => `${section}:${item}`
