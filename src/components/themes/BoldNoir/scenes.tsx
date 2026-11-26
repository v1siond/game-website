import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { sceneEnd } from '@/lib/scroll/player'
import type { StageLayer } from '../shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '../shared/theatre/useTheatre'
import { PHONE_MIDDLE, PHONE_SCALE, holdX, type CaseInput, type Hold, type Place } from './case'
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

// The page as scenes, one case of the 1947 detective game from the call to the close: the street where the
// call comes in (hero), one step of the case per section of the shown profession in reading order, the
// captain's desk where it is closed (contact). Each scene names its place, its anchor and its place's
// script, which the scroll plays at the scene's own pace whatever the number of its cards (stageItems still
// counts them for the theatre's settled frame). The sections alternate sides from lg: the first after the hero
// plays its step on the right half beside its cards on the left, the next on the left half beside its cards
// on the right, and so on to the contact.

/** The half of a wide screen a scene plays its step in; its cards read on the other half. */
export type SceneSide = 'right' | 'left'

/** The side of the scene at `index` among the sections after the hero, the contact last: right, left, right... */
const sideOf = (index: number): SceneSide => (index % 2 === 0 ? 'right' : 'left')

export type SceneId = 'hero' | SectionId | 'contact'

/** His spot in a scene: the hero's own, the half its step plays in from lg, the right one below lg. */
const holdOf = (id: SceneId, side: SceneSide, wide: boolean): Hold => {
  if (id === 'hero') return 'hero'
  return wide ? side : 'right'
}

const NAMED: Record<SceneSide, number> = { right: 1, left: -1 }

/** On a phone a section's step is turned round the middle of the view where he would end in the half it does
 *  not name: he then works facing the other way, what he works at on his other side (nothing in it is
 *  lettered), and ends in the named half. */
const turnedOf = (id: SceneId, side: SceneSide, place: Place, input: Omit<CaseInput, 'turned'>): boolean => {
  if (id === 'hero' || !input.phone) return false
  const end = holdX(input) + (place.ends ?? 0) * PHONE_SCALE
  return (end - PHONE_MIDDLE) * NAMED[side] < 0
}

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
  /** The half its step plays in from lg; the hero keeps its own layout on the right. */
  side: SceneSide
}

const layersOf = ({ light, set, mid, near, floor }: Place, input: CaseInput): StageLayer[] => [
  { name: 'sky', node: <Night light={light} /> },
  { name: 'far', node: <Skyline /> },
  ...(set ? [{ name: 'set', node: set(input) }] : []),
  { name: 'mid', node: mid ? mid(input) : <Wall /> },
  { name: 'near', node: near ? near(input) : <Street /> },
  { name: 'figure', node: <Canvas>{floor(input)}</Canvas> },
  { name: 'fg', node: <Front /> },
]

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number, profession: Profession, screen: Screen, side: SceneSide): NoirScene => {
  const { place, ...def } = SCENE_DEFS[id]
  const held = { profession, phone: screen.phone, hold: holdOf(id, side, screen.wide) }
  const input: CaseInput = { ...held, turned: turnedOf(id, side, place, held) }
  return {
    ...def,
    id,
    slot,
    count,
    side,
    script: place.script,
    layers: layersOf(place, input),
    bind: (stage) => {
      const rain = rainWriter(stage)
      const write = place.bind(stage, input)
      return (progress, _reached, play) => {
        rain(progress)
        write(play ?? sceneEnd(place.script))
      }
    },
  }
}

/** The screen a page is drawn for: a phone (below md), or wide enough for cards and step side by side (lg). */
export interface Screen {
  phone: boolean
  wide: boolean
}

/** Every scene of the page in order, each with what its picture is built from, the sides alternating. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: number, profession: Profession, screen: Screen): NoirScene[] {
  const sections = slots.map((slot, i) => {
    const { lead, count } = stageItems(slot, labels, highlights)
    return sceneOf(slot.id, slot, lead + count, profession, screen, sideOf(i))
  })
  return [sceneOf('hero', null, 0, profession, screen, 'right'), ...sections, sceneOf('contact', null, 0, profession, screen, sideOf(slots.length))]
}

/** Each layer's push in across its scene: the far skyline moves least, the rain in front most, which gives
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
