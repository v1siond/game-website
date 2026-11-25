import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import type { StageLayer } from '../shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '../shared/theatre/useTheatre'
import { scenePlace, type PlaceInput, type Scene, type Side } from './place'
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
import { Canvas, Columns, FarRuins, Floor, Fog, Front, Sky } from './ruins'
import page from './page.module.css'

// The page as scenes, one way through the ruined kingdom at dusk: the shrine where the fire catches (hero),
// one place per section of the shown profession in reading order, the rest by the fire, the ledge over a
// hollow, the courtyard parry, the fog gate, the demon's arena, the great door, the bell tower and the
// shield knight, and the last fire with its chest at the end (contact). Each scene names its place, its
// anchor, its script of one to three actions the scroll plays, and how many cards its section counts
// (stageItems) for the theatre's reading line.

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

export interface SoulScene extends TheatreScene {
  id: SceneId
  anchor: string
  /** The side it plays on: its section's cards sit on the other. */
  side: Side
  layers: StageLayer[]
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

const layersOf = ({ far, mid, floor }: Scene, input: PlaceInput): StageLayer[] => [
  { name: 'sky', node: <Sky /> },
  { name: 'far', node: far ? far(input) : <FarRuins /> },
  { name: 'fog', node: <Fog /> },
  { name: 'mid', node: mid ? mid(input) : <Columns /> },
  { name: 'near', node: <Floor /> },
  { name: 'figure', node: <Canvas>{floor(input)}</Canvas> },
  { name: 'fg', node: <Front /> },
]

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number, profession: Profession, phone: boolean, side: Side): SoulScene => {
  const place = PLACES[id]
  const input = { profession, phone, side }
  return {
    id,
    anchor: ANCHORS[id],
    side,
    slot,
    count,
    script: place.script,
    layers: layersOf(place, input),
    bind: (stage) => place.bind(stage, input),
  }
}

/** The side of the section at `index` of the page (0 the first after the hero): the first plays right of its
 *  cards, the next left of them, and so on up to the contact. */
const sideOf = (index: number): Side => (index % 2 === 0 ? 'right' : 'left')

/**
 * Every scene of the page in order, each with what its picture is built from. With the cards beside the scene
 * (`split`, from lg) or on a phone the sections take turns, right of their cards then left; a screen between
 * the two keeps every scene on the right. The hero keeps its own place.
 */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: number, profession: Profession, phone: boolean, split: boolean): SoulScene[] {
  const side = (index: number): Side => (phone || split ? sideOf(index) : 'right')
  const sections = slots.map((slot, i) => {
    const { lead, count } = stageItems(slot, labels, highlights)
    return sceneOf(slot.id, slot, lead + count, profession, phone, side(i))
  })
  return [sceneOf('hero', null, 0, profession, phone, 'right'), ...sections, sceneOf('contact', null, 0, profession, phone, side(slots.length))]
}

/** Each side's class on the page's css: the cards' column from lg. */
export const SIDE_CLASS: Record<Side, string> = { right: '', left: page.cardsRight }



/** Each layer's push in across its scene: the sky least, the rubble in front most, which gives the depth.
 *  The floor, what stands on it and he move together, so he always stands on it. */
export const LAYER_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.03], lift: [0, 0] },
  far: { zoom: [1.01, 1.06], lift: [0, -1] },
  fog: { zoom: [1.02, 1.08], lift: [0, -1] },
  mid: { zoom: [1.03, 1.1], lift: [0, -2] },
  near: { zoom: [1.05, 1.14], lift: [0, -3] },
  figure: { zoom: [1.05, 1.14], lift: [0, -3] },
  fg: { zoom: [1.12, 1.3], lift: [1, -5] },
}
