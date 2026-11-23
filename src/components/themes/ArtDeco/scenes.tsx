import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { spread } from '../shared/stageNodes'
import type { StageLayer } from '../shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '../shared/theatre/useTheatre'
import { ROW_FROM, ROW_TO, type Chamber, type ChamberInput } from './chamber'
import { about } from './chambers/about'
import { bands } from './chambers/bands'
import { contact } from './chambers/contact'
import { hero } from './chambers/hero'
import { muayThai } from './chambers/muayThai'
import { projects } from './chambers/projects'
import { services } from './chambers/services'
import { tech } from './chambers/tech'
import { ventures } from './chambers/ventures'
import { work } from './chambers/work'
import { Canvas, Floor, Front, Hall, Skyline, Water, bubblesWriter } from './city'

// The page as scenes: the station lobby (hero), one chamber per section of the shown profession in reading
// order, the revival chamber (contact). Each scene names its chamber, its anchor and how many cards its
// section counts (stageItems), read from the same slot the section's cards are drawn from: one prop per
// card.

export type SceneId = 'hero' | SectionId | 'contact'

interface SceneDef {
  chamber: Chamber
  anchor: string
}

const SCENE_DEFS: Record<SceneId, SceneDef> = {
  hero: { chamber: hero, anchor: 'top' },
  about: { chamber: about, anchor: 'about' },
  work: { chamber: work, anchor: 'work' },
  tech: { chamber: tech, anchor: 'tech' },
  services: { chamber: services, anchor: 'services' },
  projects: { chamber: projects, anchor: 'projects' },
  ventures: { chamber: ventures, anchor: 'ventures' },
  bands: { chamber: bands, anchor: 'bands' },
  muayThai: { chamber: muayThai, anchor: 'muay-thai' },
  contact: { chamber: contact, anchor: 'contact' },
}

export interface DecoScene extends TheatreScene, Omit<SceneDef, 'chamber'> {
  id: SceneId
  layers: StageLayer[]
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

const layersOf = (id: SceneId, { light, set, floor }: Chamber, input: ChamberInput): StageLayer[] => [
  { name: 'sky', node: <Water id={`deco-${id}`} light={light} /> },
  { name: 'far', node: <Skyline /> },
  ...(set ? [{ name: 'set', node: set(input) }] : []),
  { name: 'mid', node: <Hall /> },
  { name: 'near', node: <Floor /> },
  { name: 'figure', node: <Canvas>{floor(input)}</Canvas> },
  { name: 'fg', node: <Front /> },
]

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number, profession: Profession): DecoScene => {
  const { chamber, ...def } = SCENE_DEFS[id]
  const input = { xs: spread(count, ROW_FROM, ROW_TO), profession }
  return {
    ...def,
    id,
    slot,
    count,
    layers: layersOf(id, chamber, input),
    bind: (stage) => {
      const bubbles = bubblesWriter(stage)
      const write = chamber.bind(stage, input)
      return (progress, reached) => {
        bubbles(progress)
        write(progress, reached)
      }
    },
  }
}

/** Every scene of the page in order, each with what its picture is built from. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: number, profession: Profession): DecoScene[] {
  const sections = slots.map((slot) => {
    const { lead, count } = stageItems(slot, labels, highlights)
    return sceneOf(slot.id, slot, lead + count, profession)
  })
  return [sceneOf('hero', null, 0, profession), ...sections, sceneOf('contact', null, 0, profession)]
}

/** Each layer's push in across its scene: the far towers move least, the kelp most, which gives the depth.
 *  The floor and what stands on it move together, so he always stands on it. */
export const LAYER_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.04], lift: [0, 0] },
  far: { zoom: [1.01, 1.07], lift: [0, -1] },
  set: { zoom: [1.02, 1.09], lift: [0, -1] },
  mid: { zoom: [1.03, 1.11], lift: [0, -2] },
  near: { zoom: [1.05, 1.14], lift: [0, -3] },
  figure: { zoom: [1.05, 1.14], lift: [0, -3] },
  fg: { zoom: [1.12, 1.3], lift: [1, -5] },
}
