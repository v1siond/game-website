import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import type { LayerMotions, TheatreScene } from '../shared/theatre/useTheatre'
import type { StageLayer } from '../shared/theatre/Stage'
import { about } from './scenes/about'
import { bands } from './scenes/bands'
import { goal } from './scenes/goal'
import { hub } from './scenes/hub'
import type { Level } from './scenes/level'
import { muayThai } from './scenes/muayThai'
import { projects } from './scenes/projects'
import { services } from './scenes/services'
import { tech } from './scenes/tech'
import { ventures } from './scenes/ventures'
import { work } from './scenes/work'

// The page as scenes: the hub (hero), one level per section of the shown profession in reading order,
// the goal (contact). Each scene names its picture, its anchor and how many cards its section counts
// (stageItems), read from the same slot the section's cards are drawn from.

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
  /** The section's slot; the hero and the goal have none. */
  slot: SectionSlot | null
}

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number, profession: Profession): TrailScene => {
  const { level, ...def } = SCENE_DEFS[id]
  const input = { count, profession }
  return { ...def, id, slot, count, layers: level.layers(input), bind: (stage) => level.bind(stage, input) }
}

/** Every scene of the page in order, each with what its picture is built from. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: number, profession: Profession): TrailScene[] {
  const sections = slots.map((slot) => {
    const { lead, count } = stageItems(slot, labels, highlights)
    return sceneOf(slot.id, slot, lead + count, profession)
  })
  return [sceneOf('hero', null, 0, profession), ...sections, sceneOf('contact', null, 0, profession)]
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
