import type { Profession } from '@/lib/cv/professions'
import type { StageLayer } from '../../shared/theatre/Stage'
import type { Playhead, SceneScript } from '@/lib/scroll/player'
import type { SpotId } from './worldMap'

// What every level is: its script (each action's length, played by the scroll as its section comes in), its
// layers on the shared canvas (kit.tsx), from the sky to the world map laid over it, and a binder that
// finds the nodes its actions move and returns the writer of a playhead. Every level but the hero opens on
// the world map: his marker walks to the level's spot and the spot opens into the level (worldMap.tsx).

/** What a level is built from: whose outfit he wears, the screen, and where on the map he comes from. */
export interface LevelInput {
  profession: Profession
  phone: boolean
  /** The spot he walks from on the map: the one before this level in the page. */
  from: SpotId
  /** This level's spot. */
  at: SpotId
}

export type LevelWriter = (play: Playhead) => void

export interface Level {
  script: SceneScript
  layers: (input: LevelInput) => StageLayer[]
  bind: (stage: ParentNode, input: LevelInput) => LevelWriter
}

/** How far action `i` has played: 0 before it, its eased t while it plays, 1 once it is over. */
export const phase = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action < i ? 0 : t)

/** Where he starts in a level: right of the text column on a wide screen, in a phone's view (x 570 to 1030). */
export const startX = ({ phone }: Pick<LevelInput, 'phone'>): number => (phone ? 640 : 860)

/** A level's distances on a phone, which sees less of the canvas. */
export const reach = ({ phone }: Pick<LevelInput, 'phone'>, d: number): number => (phone ? d * 0.65 : d)

/** The map walk every level after the hero opens with, as its first action. */
export const MAP_MS = 1200
