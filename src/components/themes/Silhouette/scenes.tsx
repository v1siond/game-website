import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import type { StageLayer } from '../shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '../shared/theatre/useTheatre'
import { Canvas, FarPines, Fog, Front, Ground, Sky, Trunks } from './forest'
import { LIGHTS, type LightName } from './palette'
import { scenePlace, type PlaceInput, type Scene } from './place'
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

// The page as scenes, one way through the black forest and into the machine city, the game's own set
// pieces one per place: its edge at dawn where he wakes (hero), one place per section of the shown
// profession in reading order, the boulder on the slope, the trap and the trunk, the flooded hold, the
// conveyor and the hook, the crusher, the wall gun, the gear and the gravity room, and the clearing at the
// end (contact). Every place past the hero stands in the profession's own light: cold
// dawn for the System Engineer, an ember sunset for the Musician, a crimson dusk for the Martial Artist.
// Each scene names its place, its anchor, its script of one to three actions the scroll plays, and how many
// cards its section counts (stageItems) for the theatre's reading line.

export type SceneId = 'hero' | SectionId | 'contact'

const PLACES: Record<SceneId, Scene> = {
  hero,
  about: scenePlace(about),
  work: scenePlace(work),
  tech: scenePlace(tech),
  services: scenePlace(services),
  projects: scenePlace(projects),
  ventures: scenePlace(ventures),
  bands: scenePlace(bands),
  muayThai: scenePlace(muayThai),
  contact: scenePlace(contact),
}

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

const PROFESSION_LIGHT: Record<Profession, LightName> = { engineer: 'dawn', drummer: 'ember', fighter: 'crimson' }

export interface ShadeScene extends TheatreScene {
  id: SceneId
  anchor: string
  layers: StageLayer[]
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

const layersOf = ({ far, mid, floor }: Scene, input: PlaceInput, light: LightName): StageLayer[] => [
  { name: 'sky', node: <Sky light={light} /> },
  { name: 'far', node: far ? far(input) : <FarPines light={input.light} /> },
  { name: 'fog', node: <Fog light={input.light} /> },
  { name: 'mid', node: mid ? mid(input) : <Trunks light={input.light} /> },
  { name: 'near', node: <Ground light={input.light} /> },
  { name: 'figure', node: <Canvas>{floor(input)}</Canvas> },
  { name: 'fg', node: <Front /> },
]

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number, profession: Profession): ShadeScene => {
  const place = PLACES[id]
  const light = id === 'hero' ? 'dawn' : PROFESSION_LIGHT[profession]
  const input = { profession, light: LIGHTS[light] }
  return {
    id,
    anchor: ANCHORS[id],
    slot,
    count,
    script: place.script,
    layers: layersOf(place, input, light),
    bind: (stage) => place.bind(stage, input),
  }
}

/** Every scene of the page in order, each with what its picture is built from. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: number, profession: Profession): ShadeScene[] {
  const sections = slots.map((slot) => {
    const { lead, count } = stageItems(slot, labels, highlights)
    return sceneOf(slot.id, slot, lead + count, profession)
  })
  return [sceneOf('hero', null, 0, profession), ...sections, sceneOf('contact', null, 0, profession)]
}

/** Each layer's push in across its scene: the sky least, the soft shapes in front most, which gives the
 *  depth. The ground, what stands on it and he move together, so he always stands on it. */
export const LAYER_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.03], lift: [0, 0] },
  far: { zoom: [1.01, 1.06], lift: [0, -1] },
  fog: { zoom: [1.02, 1.08], lift: [0, -1] },
  mid: { zoom: [1.03, 1.1], lift: [0, -2] },
  near: { zoom: [1.05, 1.14], lift: [0, -3] },
  figure: { zoom: [1.05, 1.14], lift: [0, -3] },
  fg: { zoom: [1.12, 1.3], lift: [1, -5] },
}
