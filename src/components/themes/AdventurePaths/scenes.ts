import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import type { LayerMotions, TheatreScene } from '../shared/theatre/useTheatre'
import type { StageLayer } from '../shared/theatre/Stage'
import { about } from './scenes/about'
import { bands } from './scenes/bands'
import { goal } from './scenes/goal'
import { hub } from './scenes/hub'
import type { Level } from './scenes/level'
import type { SpotId } from './scenes/worldMap'
import { sceneEnd, type Playhead, type SceneScript } from '@/lib/scroll/player'
import { muayThai } from './scenes/muayThai'
import { projects } from './scenes/projects'
import { services } from './scenes/services'
import { tech } from './scenes/tech'
import { ventures } from './scenes/ventures'
import { work } from './scenes/work'

// The page as scenes: the start (hero), one level per section of the shown profession in reading order,
// the goal (contact), the way one world of the 16 bit platformer is played from start to finish. Each
// scene names its picture, its anchor and its script, the actions the scroll plays as its section comes in.
// The sections alternate sides from lg: the first after the hero plays its level on the right half beside its
// cards on the left, the next on the left half beside its cards on the right, and so on to the goal.

/** The half of a wide screen a level plays in; its cards read on the other half. */
export type SceneSide = 'right' | 'left'

/** The side of the scene at `index` among the sections after the hero, the goal last: right, left, right... */
const sideOf = (index: number): SceneSide => (index % 2 === 0 ? 'right' : 'left')

/** The screen a page is drawn for: a phone (below md), or wide enough for cards and level side by side (lg). */
export interface Screen {
  phone: boolean
  wide: boolean
}

export type SceneId = 'hero' | SectionId | 'contact'

interface SceneDef {
  level: Level
  anchor: string
}

const SCENE_DEFS: Record<SceneId, SceneDef> = {
  hero: { level: hub, anchor: 'top' },
  about: { level: about, anchor: 'about' },
  work: { level: work, anchor: 'work' },
  tech: { level: tech, anchor: 'tech' },
  services: { level: services, anchor: 'services' },
  projects: { level: projects, anchor: 'projects' },
  ventures: { level: ventures, anchor: 'ventures' },
  bands: { level: bands, anchor: 'bands' },
  muayThai: { level: muayThai, anchor: 'muay-thai' },
  contact: { level: goal, anchor: 'contact' },
}

export interface TrailScene extends TheatreScene, Omit<SceneDef, 'level'> {
  id: SceneId
  layers: StageLayer[]
  /** The level's actions, played by the scroll as its section comes in. */
  script: SceneScript
  /** The section's slot; the hero and the goal have none. */
  slot: SectionSlot | null
  /** The half its level plays in from lg; the hero keeps its own layout on the right. */
  side: SceneSide
}

/** A scene's spot on the world map: the hero's is his house. */
const spotOf = (id: SceneId): SpotId => (id === 'hero' ? 'home' : id)

const sceneOf = (id: SceneId, slot: SectionSlot | null, before: SceneId, profession: Profession, screen: Screen, side: SceneSide): TrailScene => {
  const { level, ...def } = SCENE_DEFS[id]
  const input = { profession, phone: screen.phone, left: screen.wide && side === 'left', from: spotOf(before), at: spotOf(id) }
  return {
    ...def,
    id,
    slot,
    side,
    count: 0,
    script: level.script,
    layers: level.layers(input),
    bind: (stage) => {
      const write = level.bind(stage, input)
      return (_progress, _reached, play?: Playhead) => write(play ?? sceneEnd(level.script))
    },
  }
}

/** Every scene of the page in order, the sides alternating; each level opens on the map walk from the scene before it. */
export function scenesOf(slots: readonly SectionSlot[], profession: Profession, screen: Screen): TrailScene[] {
  const ids: SceneId[] = ['hero', ...slots.map((slot) => slot.id), 'contact']
  return ids.map((id, i) =>
    sceneOf(id, slots.find((slot) => slot.id === id) ?? null, ids[Math.max(0, i - 1)], profession, screen, id === 'hero' ? 'right' : sideOf(i - 1)),
  )
}

/** Each layer's push in across its scene: the far layers move least, which gives the depth. The ground
 *  and the course move together, so he always stands on it. */
export const LAYER_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.05], lift: [0, 0] },
  far: { zoom: [1.02, 1.08], lift: [0, -1] },
  mid: { zoom: [1.04, 1.12], lift: [0, -2] },
  near: { zoom: [1.06, 1.16], lift: [0, -3] },
  figure: { zoom: [1.06, 1.16], lift: [0, -3] },
  fg: { zoom: [1.12, 1.3], lift: [1, -5] },
}
