import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { spread } from '../shared/stageNodes'
import type { StageLayer } from '../shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '../shared/theatre/useTheatre'
import { rarityOf } from './loot'
import { CEL } from './palette'
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
import { Canvas, Dunes, Front, Ground, Mesas, Sky, dustWriter } from './desert'

// The page as scenes, one day in the desert: the mesa top at noon (hero), one place per section of the
// shown profession in reading order, noon to the town's afternoon to dusk, and the station at night
// (contact). Each scene names its place, its anchor and how many cards its section counts (stageItems),
// read from the same slot the section's cards are drawn from: one prop per card.

export type SceneId = 'hero' | SectionId | 'contact'

const PLACES: Record<SceneId, Place> = { hero, about, work, tech, services, projects, ventures, bands, muayThai, contact }

const ANCHORS: Record<SceneId, string> = {
  hero: 'top',
  about: 'about',
  work: 'work',
  tech: 'tech',
  services: 'services',
  projects: 'projects',
  ventures: 'ventures',
  bands: 'bands',
  muayThai: 'muay-thai',
  contact: 'contact',
}

export interface CelScene extends TheatreScene {
  id: SceneId
  anchor: string
  layers: StageLayer[]
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

const layersOf = ({ hour, back, set, floor }: Place, input: PlaceInput): StageLayer[] => [
  { name: 'sky', node: <Sky hour={hour} /> },
  ...(back ? [{ name: 'back', node: back(input) }] : []),
  { name: 'far', node: <Mesas /> },
  { name: 'mid', node: <Dunes /> },
  { name: 'near', node: <Ground /> },
  ...(set ? [{ name: 'set', node: set(input) }] : []),
  { name: 'figure', node: <Canvas>{floor(input)}</Canvas> },
  { name: 'fg', node: <Front /> },
]

/** A project's prop shows its rarity's colour; no other card colours its prop. */
const tonesOf = (slot: SectionSlot | null): string[] => (slot?.id === 'projects' ? slot.projects.map((project) => CEL[rarityOf(project)]) : [])

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number, profession: Profession): CelScene => {
  const place = PLACES[id]
  const input = { xs: spread(count, ROW_FROM, ROW_TO), tones: tonesOf(slot), profession }
  return {
    id,
    anchor: ANCHORS[id],
    slot,
    count,
    layers: layersOf(place, input),
    bind: (stage) => {
      const dust = dustWriter(stage)
      const write = place.bind(stage, input)
      return (progress, reached) => {
        dust(progress)
        write(progress, reached)
      }
    },
  }
}

/** Every scene of the page in order, each with what its picture is built from. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: number, profession: Profession): CelScene[] {
  const sections = slots.map((slot) => {
    const { lead, count } = stageItems(slot, labels, highlights)
    return sceneOf(slot.id, slot, lead + count, profession)
  })
  return [sceneOf('hero', null, 0, profession), ...sections, sceneOf('contact', null, 0, profession)]
}

/** Each layer's push in across its scene: the sky and its art move least, the scrub in front most, which
 *  gives the depth. The sand, what stands on it and he move together, so he always stands on it. */
export const LAYER_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.04], lift: [0, 0] },
  back: { zoom: [1.0, 1.05], lift: [0, 0] },
  far: { zoom: [1.01, 1.07], lift: [0, -1] },
  mid: { zoom: [1.03, 1.11], lift: [0, -2] },
  near: { zoom: [1.05, 1.14], lift: [0, -3] },
  set: { zoom: [1.05, 1.14], lift: [0, -3] },
  figure: { zoom: [1.05, 1.14], lift: [0, -3] },
  fg: { zoom: [1.12, 1.3], lift: [1, -5] },
}
