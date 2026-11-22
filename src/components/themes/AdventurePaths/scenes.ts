import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { muayThaiFacts } from '@/lib/cv/sectionText'
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
// the goal (contact). Each scene names its picture, its words in labels.trail for the HUD, its anchor and
// how many cards its section counts, read from the same slot the section's cards are drawn from.

export type SceneId = 'hero' | SectionId | 'contact'

type TrailWords = Labels['trail']

interface SceneDef {
  level: Level
  place: keyof TrailWords
  /** The HUD's line, "{count} of {total} blocks hit"; a scene that counts nothing has none. */
  tally: keyof TrailWords | null
  anchor: string
}

const SCENE_DEFS: Record<SceneId, SceneDef> = {
  hero: { level: hub, place: 'placeHero', tally: null, anchor: 'top' },
  about: { level: about, place: 'placeAbout', tally: 'countAbout', anchor: 'about' },
  work: { level: work, place: 'placeWork', tally: 'countWork', anchor: 'work' },
  tech: { level: tech, place: 'placeTech', tally: 'countTech', anchor: 'tech' },
  services: { level: services, place: 'placeServices', tally: 'countServices', anchor: 'services' },
  projects: { level: projects, place: 'placeProjects', tally: 'countProjects', anchor: 'projects' },
  ventures: { level: ventures, place: 'placeVentures', tally: 'countVentures', anchor: 'ventures' },
  bands: { level: bands, place: 'placeBands', tally: 'countBands', anchor: 'bands' },
  muayThai: { level: muayThai, place: 'placeMuayThai', tally: 'countMuayThai', anchor: 'muay-thai' },
  contact: { level: goal, place: 'placeContact', tally: null, anchor: 'contact' },
}

// How many cards each section counts: what it marks with data-stage-items, read off its slot.
const COUNT_FOR: { [Id in SectionId]: (slot: SlotOf<Id>, labels: Labels, highlights: number) => number } = {
  about: (_slot, _labels, highlights) => highlights,
  work: ({ jobs }) => jobs.length,
  tech: ({ categories }) => categories.length,
  services: ({ services: list }) => list.length,
  projects: ({ projects: list }) => list.length,
  ventures: ({ companies }) => companies.length,
  bands: ({ bands: list }) => list.length,
  muayThai: ({ martialArts }, labels) => muayThaiFacts(martialArts, labels).length + martialArts.primary.achievements.length,
}

const countOf = (slot: SectionSlot, labels: Labels, highlights: number): number =>
  (COUNT_FOR[slot.id] as (slot: SectionSlot, labels: Labels, highlights: number) => number)(slot, labels, highlights)

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
  const sections = slots.map((slot) => sceneOf(slot.id, slot, countOf(slot, labels, highlights), profession))
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
