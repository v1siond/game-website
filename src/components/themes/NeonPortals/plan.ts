import type { SectionId } from '@/lib/cv/sectionPlan'
import type { Era } from './palette'

// The corridor's rooms: each CV section the active profession shows (the shared sectionPlan), then the
// contact. A room names its era: the colours of its portal in the machine's passage (palette.ts ERAS) and the
// place its set piece shows behind that portal (sets/). The rooms are the run of the time travelling
// platformer in its own order (research notes, the warp rooms [2]): the first room's village, its chase over
// lava and its boss in the colosseum; the second room's bike race and its boss in his ring of glass; the
// third room's boss on the rising platforms; the fourth room's sky of blimps; the last boss at the machine's
// core; and the machine imploding on the villains.

export type RoomId = SectionId | 'contact'

/** The page's scenes: the hero's fall, then one per room. */
export type SceneId = 'hero' | RoomId

export const ROOM_ERA: Record<RoomId, Era> = {
  about: 'village',
  work: 'swamp',
  tech: 'colosseum',
  services: 'highway',
  projects: 'glass',
  ventures: 'tower',
  bands: 'sky',
  muayThai: 'core',
  contact: 'saved',
}

export const HUB_ERA: Era = 'hub'

/** The anchor id of a room's section on the page. */
export const roomAnchor = (id: RoomId): string => `np-${id}`

/** Where a room's cards sit from the desktop line up; its scene takes the other half. */
export type CardSide = 'left' | 'right'

/** The rooms zigzag down the page: the first after the hero has its cards left and its scene right, the next
 *  the reverse, and so on to the contact, counted over the rooms the page shows. The hero keeps its own. */
export const cardSideOf = (index: number): CardSide => (index % 2 === 0 ? 'left' : 'right')
