import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { spread } from '../shared/stageNodes'
import type { StageLayer } from '../shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '../shared/theatre/useTheatre'
import { ROW_FROM, ROW_TO, type Place, type PlaceInput } from './place'
import { about } from './places/about'
import { bands } from './places/bands'
import { contact } from './places/contact'
import { hero } from './places/hero'
import { muayThai } from './places/muayThai'
import { projects } from './places/projects'
import { services } from './places/services'
import { tech } from './places/tech'
import { ventures } from './places/ventures'
import { work } from './places/work'
import { Canvas, Front, Night, Skyline, Street, Wall, rainWriter } from './street'

// The page as scenes: the rooftop (hero), one place of the night per section of the shown profession in
// reading order, the calling card (contact). Each scene names its place, its anchor and how many cards its
// section counts (stageItems), read from the same slot the section's cards are drawn from: one prop per
// card.

export type SceneId = 'hero' | SectionId | 'contact'

interface SceneDef {
  place: Place
  anchor: string
}

const SCENE_DEFS: Record<SceneId, SceneDef> = {
  hero: { place: hero, anchor: 'top' },
  about: { place: about, anchor: 'about' },
  work: { place: work, anchor: 'work' },
  tech: { place: tech, anchor: 'tech' },
  services: { place: services, anchor: 'services' },
  projects: { place: projects, anchor: 'projects' },
  ventures: { place: ventures, anchor: 'ventures' },
  bands: { place: bands, anchor: 'bands' },
  muayThai: { place: muayThai, anchor: 'muay-thai' },
  contact: { place: contact, anchor: 'contact' },
}

export interface NoirScene extends TheatreScene, Omit<SceneDef, 'place'> {
  id: SceneId
  layers: StageLayer[]
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

const layersOf = (id: SceneId, { light, set, floor }: Place, input: PlaceInput): StageLayer[] => [
  { name: 'sky', node: <Night id={`noir-${id}`} light={light} /> },
  { name: 'far', node: <Skyline /> },
  ...(set ? [{ name: 'set', node: set(input) }] : []),
  { name: 'mid', node: <Wall /> },
  { name: 'near', node: <Street /> },
  { name: 'figure', node: <Canvas>{floor(input)}</Canvas> },
  { name: 'fg', node: <Front /> },
]

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number, profession: Profession): NoirScene => {
  const { place, ...def } = SCENE_DEFS[id]
  const input = { xs: spread(count, ROW_FROM, ROW_TO), profession }
  return {
    ...def,
    id,
    slot,
    count,
    layers: layersOf(id, place, input),
    bind: (stage) => {
      const rain = rainWriter(stage)
      const write = place.bind(stage, input)
      return (progress, reached) => {
        rain(progress)
        write(progress, reached)
      }
    },
  }
}

/** Every scene of the page in order, each with what its picture is built from. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: number, profession: Profession): NoirScene[] {
  const sections = slots.map((slot) => {
    const { lead, count } = stageItems(slot, labels, highlights)
    return sceneOf(slot.id, slot, lead + count, profession)
  })
  return [sceneOf('hero', null, 0, profession), ...sections, sceneOf('contact', null, 0, profession)]
}

/** Each layer's push in across its scene: the far towers move least, the glass in front most, which gives
 *  the depth. The pavement and what stands on it move together, so he always stands on it. */
export const LAYER_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.04], lift: [0, 0] },
  far: { zoom: [1.01, 1.07], lift: [0, -1] },
  set: { zoom: [1.02, 1.09], lift: [0, -1] },
  mid: { zoom: [1.03, 1.11], lift: [0, -2] },
  near: { zoom: [1.05, 1.14], lift: [0, -3] },
  figure: { zoom: [1.05, 1.14], lift: [0, -3] },
  fg: { zoom: [1.12, 1.3], lift: [1, -5] },
}
