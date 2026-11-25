import type { Labels } from '@/lib/cv/labels'
import type { Profession } from '@/lib/cv/professions'
import type { SectionId, SectionSlot } from '@/lib/cv/sectionPlan'
import { stageItems } from '@/lib/cv/stageItems'
import { stretchesOf } from '@/lib/motion/sideScroll'
import type { StageLayer } from '../shared/theatre/Stage'
import type { LayerMotions, TheatreScene } from '../shared/theatre/useTheatre'
import { Canvas, Far, Fog, Front, Ground, Mid, Sky, framingOf, type Region, type Run } from './forest'
import { LIGHTS, type LightName } from './palette'
import { Stretch, bindStretch, type Place, type PlaceInput } from './place'
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

// The page as one run through one level of the side scroller, its story told in order: he wakes in the
// grass at the forest's edge (hero), crosses the forest and its traps, reaches the decayed city at its end
// and the machines inside it, the gear hall and the gravity room, and comes out of the last door into the
// quiet light past the trees (contact). Each section of the shown profession is the next stretch of the
// level, laid right after the one before, so the camera that follows him through one scene starts the next
// where it left him. Every stretch past the hero stands in the profession's own light: a cold grey dawn for
// the System Engineer, a warm grey for the Musician, a red grey dusk for the Martial Artist.
// Each scene names its stretch, its anchor, its script of one to three actions the scroll plays, and how
// many cards its section counts (stageItems) for the theatre's reading line.

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

const PROFESSION_LIGHT: Record<Profession, LightName> = { engineer: 'dawn', drummer: 'ember', fighter: 'crimson' }

export interface ShadeScene extends TheatreScene {
  id: SceneId
  anchor: string
  layers: StageLayer[]
  /** The section's slot; the hero and the contact have none. */
  slot: SectionSlot | null
}

const layersOf = (id: SceneId, place: Place, input: PlaceInput, run: Run, light: LightName): StageLayer[] => [
  { name: 'sky', node: <Sky light={light} /> },
  { name: 'far', node: <Far run={run} light={input.light} /> },
  { name: 'fog', node: <Fog run={run} light={input.light} /> },
  { name: 'mid', node: <Mid run={run} light={input.light} /> },
  { name: 'near', node: <Ground run={run} light={input.light} gaps={place.gaps} /> },
  {
    name: 'figure',
    node: (
      <Canvas>
        <Stretch place={place} input={input} run={run} marked={id === 'hero'} />
      </Canvas>
    ),
  },
  { name: 'fg', node: <Front run={run} /> },
]

interface Planned {
  id: SceneId
  slot: SectionSlot | null
  count: number
}

/** Every scene of the page in order, each its stretch of the one level and what its picture is built from. */
export function scenesOf(slots: readonly SectionSlot[], labels: Labels, highlights: number, profession: Profession, phone: boolean): ShadeScene[] {
  const planned: Planned[] = [
    { id: 'hero', slot: null, count: 0 },
    ...slots.map((slot) => {
      const { lead, count } = stageItems(slot, labels, highlights)
      return { id: slot.id, slot, count: lead + count }
    }),
    { id: 'contact', slot: null, count: 0 },
  ]
  // the hero's run also crosses the screen from where he wakes to the hold
  const framings = planned.map(({ id }) => framingOf(id === 'hero', phone))
  const lengths = planned.map(({ id }, i) => PLACES[id].length + framings[i].hold - framings[i].start)
  const stretches = stretchesOf(lengths)
  const regionAt = (x: number): Region => {
    const at = stretches.findIndex(({ to }) => x < to)
    return PLACES[planned[at === -1 ? planned.length - 1 : at].id].region
  }
  return planned.map(({ id, slot, count }, i) => {
    const place = PLACES[id]
    const light = id === 'hero' ? 'dawn' : PROFESSION_LIGHT[profession]
    const input = { profession, light: LIGHTS[light] }
    const run: Run = { ...framings[i], from: stretches[i].from, length: lengths[i], region: place.region, regionAt }
    return {
      id,
      anchor: ANCHORS[id],
      slot,
      count,
      script: place.script,
      layers: layersOf(id, place, input, run, light),
      bind: (stage) => bindStretch(place, run, stage, input),
    }
  })
}

/** The camera's follow carries the depth now, so the layers only breathe: a slight push in on the sky and
 *  the soft shapes in front, the ground, what stands on it and he held level so he always stands on it. */
export const LAYER_MOTION: LayerMotions = {
  sky: { zoom: [1.0, 1.02], lift: [0, 0] },
  far: { zoom: [1.0, 1.0], lift: [0, 0] },
  fog: { zoom: [1.0, 1.0], lift: [0, 0] },
  mid: { zoom: [1.0, 1.0], lift: [0, 0] },
  near: { zoom: [1.0, 1.0], lift: [0, 0] },
  figure: { zoom: [1.0, 1.0], lift: [0, 0] },
  fg: { zoom: [1.0, 1.04], lift: [0, 0] },
}
