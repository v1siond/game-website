import type { SectionId } from '@/lib/cv/sectionPlan'
import type { Era } from './palette'

// The corridor's rooms: each CV section the active profession shows (the shared sectionPlan), then the
// contact beacon. A room names its era (its look, palette.ts ERAS), the prop that stands for one of its
// items in the tunnel (props.tsx) and what the runner does at each prop (motion.ts ACTIONS).

export type RoomId = SectionId | 'contact'

export type PropKind = 'shard' | 'checkpoint' | 'ironCrate' | 'pylon' | 'crate' | 'socket' | 'speaker' | 'bag' | 'beacon'

export type Action = 'smash' | 'ride' | 'flop' | 'slide' | 'chase' | 'bounce' | 'drum' | 'boss' | 'dance'

export interface RoomPlan {
  era: Era
  prop: PropKind
  action: Action
  /** The keystone door that slides open after the room's last item. */
  door: boolean
}

export const ROOM_PLAN: Record<RoomId, RoomPlan> = {
  about: { era: 'observatory', prop: 'shard', action: 'smash', door: false },
  work: { era: 'speedway', prop: 'checkpoint', action: 'ride', door: false },
  tech: { era: 'forge', prop: 'ironCrate', action: 'flop', door: false },
  services: { era: 'relay', prop: 'pylon', action: 'slide', door: false },
  projects: { era: 'sands', prop: 'crate', action: 'chase', door: false },
  ventures: { era: 'keystone', prop: 'socket', action: 'bounce', door: true },
  bands: { era: 'arena', prop: 'speaker', action: 'drum', door: false },
  muayThai: { era: 'pavilion', prop: 'bag', action: 'boss', door: false },
  contact: { era: 'beacon', prop: 'beacon', action: 'dance', door: false },
}

export const HUB_ERA: Era = 'hub'

/** The anchor id of a room's section on the page. */
export const roomAnchor = (id: RoomId): string => `np-${id}`
