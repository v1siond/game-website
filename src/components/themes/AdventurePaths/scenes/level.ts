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
  /** From lg the level plays on the left half, its section's cards reading on the right (scenes.ts sideOf). */
  left: boolean
  /** On a phone the level is drawn the other way round about the middle of the view, so he ends in the half
   *  his section names (scenes.ts turnedOf). */
  turned: boolean
  /** The spot he walks from on the map: the one before this level in the page. */
  from: SpotId
  /** This level's spot. */
  at: SpotId
}

export type LevelWriter = (play: Playhead) => void

export interface Level {
  script: SceneScript
  /** Where he ends, at the level's end frame; the hero's start has none. */
  end?: (input: LevelInput) => number
  layers: (input: LevelInput) => StageLayer[]
  bind: (stage: ParentNode, input: LevelInput) => LevelWriter
}

/** How far action `i` has played: 0 before it, its eased t while it plays, 1 once it is over. */
export const phase = ({ action, t }: Playhead, i: number): number => (action > i ? 1 : action < i ? 0 : t)

/** Where he starts in a level: right of the text column on a wide screen, or 700 further left when the cards
 *  read on the right, so the level fills the left half the same way; in a phone's view (x 570 to 1030). */
export const startX = ({ phone, left }: Pick<LevelInput, 'phone' | 'left'>): number => (phone ? 640 : left ? 160 : 860)

// Beside cards on the left of a wide screen nothing he does or meets goes left of their edge: x 648 of a
// 1440 wide screen is about x 750 of the canvas, and a little room is left past it.
const CARDS_EDGE = 760

/** His half width on the canvas, the default reach of a thing kept clear of the cards. */
export const HERO_HALF = 40

/** x, kept right of the cards' edge by `half` where they read on the left of a wide screen. */
export const clearOf = ({ phone, left }: Pick<LevelInput, 'phone' | 'left'>, x: number, half = HERO_HALF): number => (phone || left ? x : Math.max(CARDS_EDGE + half, x))

/** A level's distances on a phone, which sees less of the canvas. */
export const reach = ({ phone }: Pick<LevelInput, 'phone'>, d: number): number => (phone ? d * 0.65 : d)

/** The map walk every level after the hero opens with, as its first action. */
export const MAP_MS = 1200
