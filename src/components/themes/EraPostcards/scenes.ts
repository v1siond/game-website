import type { WorldCV } from '@/lib/cv/content'
import type { Labels } from '@/lib/cv/labels'
import { everySection, type SectionId, type SectionSlot, type SlotOf } from '@/lib/cv/sectionPlan'
import { muayThaiFacts } from '@/lib/cv/sectionText'
import type { LayerMotion } from '@/lib/scroll/stage'
import { LOOK, type EraLook } from './palette'
import page from './page.module.css'
import type { Era, EraInput, Layer } from './eras/era'
import { beacon, hero } from './eras/hub'
import { fern } from './eras/fern'
import { highway } from './eras/highway'
import { tomb } from './eras/tomb'
import { market } from './eras/market'
import { wall } from './eras/wall'
import { keystone } from './eras/keystone'
import { arena } from './eras/arena'
import { jungle } from './eras/jungle'

// The page as scenes: the hub (hero), one era per section of every profession in reading order, the
// beacon (contact). Each scene names its picture, its card look, its anchor and what its section counts,
// read from the same slot the section's cards are drawn from.

export type SceneId = 'hero' | SectionId | 'contact'

export interface SceneDef {
  era: Era
  look: EraLook
  anchor: string
}

export const SCENE_DEFS: Record<SceneId, SceneDef> = {
  hero: { era: hero, look: LOOK.hero, anchor: 'top' },
  about: { era: fern, look: LOOK.about, anchor: 'about' },
  work: { era: highway, look: LOOK.work, anchor: 'work' },
  tech: { era: tomb, look: LOOK.tech, anchor: 'tech' },
  services: { era: market, look: LOOK.services, anchor: 'services' },
  projects: { era: wall, look: LOOK.projects, anchor: 'projects' },
  ventures: { era: keystone, look: LOOK.ventures, anchor: 'ventures' },
  bands: { era: arena, look: LOOK.bands, anchor: 'bands' },
  muayThai: { era: jungle, look: LOOK.muayThai, anchor: 'muay-thai' },
  contact: { era: beacon, look: LOOK.contact, anchor: 'contact' },
}

const only = (count: number): EraInput => ({ count, years: [], featured: 0 })

const NOTHING = only(0)

// What each section's picture is built from, read off its slot: one prop per card the section shows.
const INPUT_FOR: { [Id in SectionId]: (slot: SlotOf<Id>, cv: WorldCV, labels: Labels) => EraInput } = {
  about: (_slot, cv) => only(cv.professionalSummary.highlights.length),
  work: ({ jobs }) => ({ count: jobs.length, years: jobs.map((job) => job.startDate.getUTCFullYear()), featured: 0 }),
  tech: ({ categories }) => only(categories.length),
  services: ({ services }) => only(services.length),
  projects: ({ projects }) => only(projects.length),
  ventures: ({ companies }) => ({ count: companies.length, years: [], featured: companies.filter((company) => company.featured).length }),
  bands: ({ bands }) => only(bands.length),
  muayThai: ({ martialArts }, _cv, labels) => only(muayThaiFacts(martialArts, labels).length),
}

const inputOf = (slot: SectionSlot, cv: WorldCV, labels: Labels): EraInput =>
  (INPUT_FOR[slot.id] as (slot: SectionSlot, cv: WorldCV, labels: Labels) => EraInput)(slot, cv, labels)

/** The half of the screen a scene plays on: right of its section's cards, or left of them. */
export type Side = 'right' | 'left'

/** How far his layers move across the canvas: beside the cards from lg, and in a phone's stacked band. */
export interface Shift {
  wide: number
  phone: number
}

export interface Scene extends SceneDef {
  id: SceneId
  /** The side it plays on: its section's cards sit on the other. */
  side: Side
  shift: Shift
  input: EraInput
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

// Where he stands once his era moves to its side. From lg, right of the cards he keeps his own place, or is
// moved right to RIGHT_FROM when it would sit under them: his cape trails about 210 behind his feet, and the
// section's title plate, wider than the cards (to x 770 on a 1440 wide screen for Tech Stack), rises past him
// as the section comes in. Left of them he stands at LEFT_AT, his era's order of things unchanged and clear of
// the cards. In a phone's stacked band he stands in the half the section names: right of PHONE_RIGHT_FROM or
// at PHONE_LEFT_AT.
const RIGHT_FROM = 1000
const LEFT_AT = 330
const PHONE_RIGHT_FROM = 860
const PHONE_LEFT_AT = 740

const SHIFT: Record<Side, (place: number) => Shift> = {
  right: (place) => ({ wide: Math.max(0, RIGHT_FROM - place), phone: Math.max(0, PHONE_RIGHT_FROM - place) }),
  left: (place) => ({ wide: LEFT_AT - place, phone: Math.min(0, PHONE_LEFT_AT - place) }),
}

const STAY: Shift = { wide: 0, phone: 0 }

/** The side of the section at `index` of the page (0 the first after the hero): the first plays right of its
 *  cards, the next left of them, and so on up to the contact. */
const sideOf = (index: number): Side => (index % 2 === 0 ? 'right' : 'left')

const placed = (def: SceneDef, index: number): Pick<Scene, 'side' | 'shift'> => ({ side: sideOf(index), shift: SHIFT[sideOf(index)](def.era.place) })

/** Every scene of the page in order, each with what its picture is built from and the side it plays on; the
 *  hero keeps its own place. */
export function scenesOf(cv: WorldCV, labels: Labels, year: number): Scene[] {
  const slots = everySection(cv, year)
  const sections = slots.map((slot, i): Scene => ({ ...SCENE_DEFS[slot.id], ...placed(SCENE_DEFS[slot.id], i), id: slot.id, input: inputOf(slot, cv, labels), slot }))
  return [
    { ...SCENE_DEFS.hero, side: 'right', shift: STAY, id: 'hero', input: NOTHING, slot: null },
    ...sections,
    { ...SCENE_DEFS.contact, ...placed(SCENE_DEFS.contact, slots.length), id: 'contact', input: NOTHING, slot: null },
  ]
}

/** Each layer's push in across its scene: the far layers move least, which gives the depth. */
export const LAYER_MOTION: Record<Layer, LayerMotion> = {
  sky: { zoom: [1.0, 1.05], lift: [0, 0] },
  far: { zoom: [1.02, 1.09], lift: [0, -1] },
  mid: { zoom: [1.04, 1.13], lift: [0, -2] },
  near: { zoom: [1.06, 1.17], lift: [0, -3] },
  figure: { zoom: [1.06, 1.17], lift: [0, -3] },
  fg: { zoom: [1.12, 1.32], lift: [1, -5] },
}

/** A scene's card look as the CSS variables its stage and section read. */
export const lookVars = ({ accent, rim, card }: EraLook): Record<string, string> => ({ '--era-accent': accent, '--era-rim': rim, '--era-card': card })

/** Each side's class on the page's css: the cards' column and the contact's plate from lg. */
export const SIDE_CLASS: Record<Side, string> = { right: page.cardsLeft, left: page.cardsRight }

/** How far its stage's moving layers shift, as the CSS variables eras.module.css reads per screen. */
export const shiftVars = ({ wide, phone }: Shift): Record<string, string> => ({ '--era-shift-wide': `${wide}px`, '--era-shift-phone': `${phone}px` })
