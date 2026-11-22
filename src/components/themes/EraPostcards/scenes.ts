import type { WorldCV } from '@/lib/cv/content'
import type { Labels } from '@/lib/cv/labels'
import { everySection, type SectionId, type SectionSlot, type SlotOf } from '@/lib/cv/sectionPlan'
import { muayThaiFacts } from '@/lib/cv/sectionText'
import type { LayerMotion } from '@/lib/scroll/stage'
import { LOOK, type EraLook } from './palette'
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
// beacon (contact). Each scene names its picture, its card look, its words in labels.eras, its anchor and
// what its section counts, read from the same slot the section's cards are drawn from.

export type SceneId = 'hero' | SectionId | 'contact'

type EraWords = Labels['eras']

export interface SceneDef {
  era: Era
  look: EraLook
  place: keyof EraWords
  /** The ledger's line, "{count} of {total} rune stones lit"; a scene that counts nothing has none. */
  count: keyof EraWords | null
  anchor: string
}

export const SCENE_DEFS: Record<SceneId, SceneDef> = {
  hero: { era: hero, look: LOOK.hero, place: 'placeHero', count: null, anchor: 'top' },
  about: { era: fern, look: LOOK.about, place: 'placeAbout', count: 'countAbout', anchor: 'about' },
  work: { era: highway, look: LOOK.work, place: 'placeWork', count: 'countWork', anchor: 'work' },
  tech: { era: tomb, look: LOOK.tech, place: 'placeTech', count: 'countTech', anchor: 'tech' },
  services: { era: market, look: LOOK.services, place: 'placeServices', count: 'countServices', anchor: 'services' },
  projects: { era: wall, look: LOOK.projects, place: 'placeProjects', count: 'countProjects', anchor: 'projects' },
  ventures: { era: keystone, look: LOOK.ventures, place: 'placeVentures', count: 'countVentures', anchor: 'ventures' },
  bands: { era: arena, look: LOOK.bands, place: 'placeBands', count: 'countBands', anchor: 'bands' },
  muayThai: { era: jungle, look: LOOK.muayThai, place: 'placeMuayThai', count: 'countMuayThai', anchor: 'muay-thai' },
  contact: { era: beacon, look: LOOK.contact, place: 'placeContact', count: null, anchor: 'contact' },
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

export interface Scene extends SceneDef {
  id: SceneId
  input: EraInput
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

/** Every scene of the page in order, each with what its picture is built from. */
export function scenesOf(cv: WorldCV, labels: Labels, year: number): Scene[] {
  const sections = everySection(cv, year).map((slot): Scene => ({ ...SCENE_DEFS[slot.id], id: slot.id, input: inputOf(slot, cv, labels), slot }))
  return [{ ...SCENE_DEFS.hero, id: 'hero', input: NOTHING, slot: null }, ...sections, { ...SCENE_DEFS.contact, id: 'contact', input: NOTHING, slot: null }]
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
