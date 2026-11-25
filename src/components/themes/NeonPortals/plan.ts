import type { SectionId } from '@/lib/cv/sectionPlan'
import type { Era } from './palette'

// The corridor's rooms: each CV section the active profession shows (the shared sectionPlan), then the
// contact. A room names its era: the colours of its portal in the machine's passage (palette.ts ERAS) and the
// place its set piece shows behind that portal (sets/).

export type RoomId = SectionId | 'contact'

/** The page's scenes: the hero's fall, then one per room. */
export type SceneId = 'hero' | RoomId

export const ROOM_ERA: Record<RoomId, Era> = {
  about: 'village',
  work: 'swamp',
  tech: 'deepSea',
  services: 'highway',
  projects: 'colosseum',
  ventures: 'trial',
  bands: 'sky',
  muayThai: 'core',
  contact: 'saved',
}

export const HUB_ERA: Era = 'hub'

/** The anchor id of a room's section on the page. */
export const roomAnchor = (id: RoomId): string => `np-${id}`
