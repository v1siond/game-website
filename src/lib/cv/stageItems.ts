import type { Labels } from './labels'
import type { SectionId, SectionSlot, SlotOf } from './sectionPlan'
import { muayThaiFacts } from './sectionText'

// How many cards a section's theatre counts, the ones its frame marks with data-stage-items, read off its
// slot once for every world. `lead` is the cards before the props a scene draws (the Muay Thai record's
// facts come before its achievements); lead + count is what the theatre measures. The About items are the
// world's own (its highlights, or its highlights and facts as tags), so the world passes their number.

export interface StageItems {
  lead: number
  count: number
}

type RecordWords = Pick<Labels, 'record' | 'years'>

const props = (count: number): StageItems => ({ lead: 0, count })

const ITEMS_FOR: { [Id in SectionId]: (slot: SlotOf<Id>, labels: RecordWords, aboutItems: number) => StageItems } = {
  about: (_slot, _labels, aboutItems) => props(aboutItems),
  work: ({ jobs }) => props(jobs.length),
  tech: ({ categories }) => props(categories.length),
  services: ({ services }) => props(services.length),
  projects: ({ projects }) => props(projects.length),
  ventures: ({ companies }) => props(companies.length),
  bands: ({ bands }) => props(bands.length),
  muayThai: ({ martialArts }, labels) => ({ lead: muayThaiFacts(martialArts, labels).length, count: martialArts.primary.achievements.length }),
}

/** The cards `slot`'s section counts: `lead` before its props, then `count` props. */
export function stageItems(slot: SectionSlot, labels: RecordWords, aboutItems: number): StageItems {
  // The map is keyed by the same id that narrows `slot`, so this entry takes this slot.
  const items = ITEMS_FOR[slot.id] as (slot: SectionSlot, labels: RecordWords, aboutItems: number) => StageItems
  return items(slot, labels, aboutItems)
}
