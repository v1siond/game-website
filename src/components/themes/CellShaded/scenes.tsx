import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import type { StageLayer } from '../shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '../shared/theatre/useTheatre'
import { START, type Place, type PlaceInput } from './place'
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
import { Canvas, Front, Ground, PhoneView, Ridge, Rise, Sky, dustWriter, type Side } from './desert'
import page from './page.module.css'

// The page as scenes, the hunt for the vault in the game's order: off the bus in the badlands (hero), one stop
// per section of the shown profession in reading order, through the town, the gully, the station, the mine,
// the dig, the coast, the salt flats and the vault, and the night under the satellite (contact). Each scene
// names its stop, its anchor, the half it plays on, its script and how many cards its section counts
// (stageItems, for the theatre's reading line), read from the same slot the section's cards are drawn from.

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
  /** The half it plays on: its section's cards sit on the other. */
  side: Side
  layers: StageLayer[]
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

// Every layer is drawn inside the scene's phone value, so its canvas frames itself for the screen.
const layersOf = ({ land, floor }: Place, input: PlaceInput): StageLayer[] =>
  [
    { name: 'sky', node: <Sky land={land} /> },
    { name: 'far', node: <Ridge land={land} /> },
    { name: 'mid', node: <Rise land={land} /> },
    { name: 'near', node: <Ground land={land} /> },
    { name: 'figure', node: <Canvas>{floor(input)}</Canvas> },
    { name: 'fg', node: <Front land={land} side={input.side} phone={input.phone} /> },
  ].map(({ name, node }) => ({ name, node: <PhoneView.Provider value={input.phone}>{node}</PhoneView.Provider> }))

const sceneOf = (id: SceneId, slot: SectionSlot | null, count: number, profession: Profession, phone: boolean, side: Side): CelScene => {
  const place = PLACES[id]
  const input = { count, profession, phone, side }
  const actions = place.script.length
  return {
    id,
    anchor: ANCHORS[id],
    side,
    slot,
    count,
    script: place.script,
    layers: layersOf(place, input),
    bind: (stage) => {
      const dust = dustWriter(stage)
      const write = place.bind(stage, input)
      return (progress, reached, play = START) => {
        dust((Math.min(play.action, actions - 1) + play.t) / actions)
        write(progress, reached, play)
      }
    },
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
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: number, profession: Profession, phone: boolean, split: boolean): CelScene[] {
  const side = (index: number): Side => (phone || split ? sideOf(index) : 'right')
  const sections = slots.map((slot, i) => {
    const { lead, count } = stageItems(slot, labels, highlights)
    return sceneOf(slot.id, slot, lead + count, profession, phone, side(i))
  })
  return [sceneOf('hero', null, 0, profession, phone, 'right'), ...sections, sceneOf('contact', null, 0, profession, phone, side(slots.length))]
}

/** Each side's classes on the page's css: the cards' column from lg, and the shade under it. */
export const SIDE_CLASS: Record<Side, string> = { right: '', left: page.cardsRight }
export const SCRIM_CLASS: Record<Side, string> = { right: page.scrim, left: `${page.scrim} ${page.scrimRight}` }

/** Each layer's push in across its scene: the sky moves least, the scrub in front most, which gives the
 *  depth. The ground, what stands on it and he move together, so he always stands on it. */
export const LAYER_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.04], lift: [0, 0] },
  far: { zoom: [1.01, 1.07], lift: [0, -1] },
  mid: { zoom: [1.03, 1.11], lift: [0, -2] },
  near: { zoom: [1.05, 1.14], lift: [0, -3] },
  figure: { zoom: [1.05, 1.14], lift: [0, -3] },
  fg: { zoom: [1.12, 1.3], lift: [1, -5] },
}
