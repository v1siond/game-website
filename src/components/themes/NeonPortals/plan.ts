import type { Labels } from '@/lib/cv/labels'
import type { SectionId } from '@/lib/cv/sectionPlan'
import type { Era } from './palette'

// The corridor's rooms: each CV section the active profession shows (the shared sectionPlan), then the
// contact beacon. A room names its era (its look, palette.ts ERAS), the prop that stands for one of its
// items in the tunnel (props.tsx) and what the runner does at each prop (motion.ts ACTIONS).

export type RoomId = SectionId | 'contact'

export type PropKind = 'shard' | 'checkpoint' | 'ironCrate' | 'pylon' | 'crate' | 'socket' | 'speaker' | 'bag' | 'beacon'

export type Action = 'reach' | 'cheer' | 'spin' | 'jump' | 'drum' | 'kick' | 'wave'

export interface RoomPlan {
  era: Era
  prop: PropKind
  action: Action
  /** The keystone door that slides open after the room's last item. */
  door: boolean
  /** The era line under the room's title, a key of labels.warp. */
  line: keyof Labels['warp']
}

export const ROOM_PLAN: Record<RoomId, RoomPlan> = {
  about: { era: 'observatory', prop: 'shard', action: 'reach', door: false, line: 'observatory' },
  work: { era: 'speedway', prop: 'checkpoint', action: 'cheer', door: false, line: 'speedway' },
  tech: { era: 'forge', prop: 'ironCrate', action: 'spin', door: false, line: 'forge' },
  services: { era: 'relay', prop: 'pylon', action: 'reach', door: false, line: 'relay' },
  projects: { era: 'sands', prop: 'crate', action: 'jump', door: false, line: 'sands' },
  ventures: { era: 'keystone', prop: 'socket', action: 'jump', door: true, line: 'keystone' },
  bands: { era: 'arena', prop: 'speaker', action: 'drum', door: false, line: 'arena' },
  muayThai: { era: 'pavilion', prop: 'bag', action: 'kick', door: false, line: 'pavilion' },
  contact: { era: 'beacon', prop: 'beacon', action: 'wave', door: false, line: 'beacon' },
}

export const HUB_ERA: Era = 'hub'

/** The anchor id of a room's section on the page. */
export const roomAnchor = (id: RoomId): string => `np-${id}`
