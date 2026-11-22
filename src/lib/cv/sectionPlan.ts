import type { Band, CVData, Job, MartialArts, Musician, Project, WorldCV } from './content'
import { viewFor, type ProfessionSections, type SectionsOf } from './cvView'
import type { Profession } from './professions'

// Which sections a world shows for a profession and in which order, decided once for every world. Each
// world only draws a frame per section id; it never checks a list or reads the bio itself.

// `titleKey` is the section's key in labels.sections, read by a frame as sections[slot.titleKey].
export type SectionSlot =
  | { id: 'about'; titleKey: 'about'; bio: string }
  | { id: 'work'; titleKey: 'workExperience'; jobs: Job[] }
  | { id: 'tech'; titleKey: 'techStack'; categories: SectionsOf<'engineer'>['techStack'] }
  | { id: 'services'; titleKey: 'services'; services: WorldCV['services'] }
  | { id: 'projects'; titleKey: 'projects'; projects: Project[] }
  | { id: 'ventures'; titleKey: 'ventures'; companies: CVData['companies'] }
  | { id: 'bands'; titleKey: 'bands'; musician: Musician; bands: Band[] }
  | { id: 'muayThai'; titleKey: 'muayThai'; martialArts: MartialArts }

export type SectionId = SectionSlot['id']

export type SlotOf<Id extends SectionId> = Extract<SectionSlot, { id: Id }>

/** A section with the content it shows: an empty bio or list leaves its section out. */
interface Candidate {
  slot: SectionSlot
  content: { length: number }
}

const filled = (candidates: Candidate[]): SectionSlot[] =>
  candidates.filter(({ content }) => content.length > 0).map(({ slot }) => slot)

const PLAN_FOR: { [Id in Profession]: (sections: SectionsOf<Id>, bio: string) => SectionSlot[] } = {
  engineer: ({ jobs, techStack, services, projects, companies }, bio) =>
    filled([
      { slot: { id: 'about', titleKey: 'about', bio }, content: bio },
      { slot: { id: 'work', titleKey: 'workExperience', jobs }, content: jobs },
      { slot: { id: 'tech', titleKey: 'techStack', categories: techStack }, content: techStack },
      { slot: { id: 'services', titleKey: 'services', services }, content: services },
      { slot: { id: 'projects', titleKey: 'projects', projects }, content: projects },
      { slot: { id: 'ventures', titleKey: 'ventures', companies }, content: companies },
    ]),
  // The bands and the Muay Thai record always show, as the musician block and the record are never empty.
  drummer: ({ musician, bands }) => [{ id: 'bands', titleKey: 'bands', musician, bands }],
  fighter: ({ martialArts }) => [{ id: 'muayThai', titleKey: 'muayThai', martialArts }],
}

/** The sections one profession shows, in reading order. */
export function sectionPlan(sections: ProfessionSections, bio: string): SectionSlot[] {
  // The map is keyed by the same profession that narrows `sections`, so this plan takes these sections.
  const plan = PLAN_FOR[sections.profession] as (sections: ProfessionSections, bio: string) => SectionSlot[]
  return plan(sections, bio)
}

// The reading order of a page that shows every profession at once: the engineer's sections, then the
// musician's, then the martial artist's.
const READING_ORDER: readonly Profession[] = ['engineer', 'drummer', 'fighter']

/** Every section of every profession on one page, each profession's world view of `year`, in reading order. */
export const everySection = (cv: WorldCV, year: number): SectionSlot[] =>
  READING_ORDER.flatMap((profession) => sectionPlan(viewFor(cv, profession, 'world', year).sections, cv.professionalSummary.bio))
